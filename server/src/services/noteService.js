const Note = require('../models/Note');

class NoteService {
  async getAllNotes(userId, queryOptions = {}) {
    const { search, tag, category, archived } = queryOptions;
    
    const query = { userId };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    if (tag) {
      query.tags = { $in: [tag] };
    }

    if (category) {
      query.category = category;
    }

    // Default: don't show archived unless explicitly requested
    query.archived = archived === 'true';

    return await Note.find(query).sort({ updatedAt: -1 });
  }

  async getNoteById(noteId, userId) {
    return await Note.findOne({ _id: noteId, userId });
  }

  async createNote(noteData) {
    return await Note.create(noteData);
  }

  async updateNote(noteId, userId, updateData) {
    // Prevent manual userId updates
    if (updateData.userId) {
      delete updateData.userId;
    }

    return await Note.findOneAndUpdate(
      { _id: noteId, userId },
      updateData,
      { new: true, runValidators: true }
    );
  }

  async deleteNote(noteId, userId) {
    const note = await Note.findOne({ _id: noteId, userId });
    if (!note) return null;
    
    await note.deleteOne();
    return true;
  }

  async shareNote(noteId, userId) {
    return await Note.findOneAndUpdate(
      { _id: noteId, userId },
      { isPublic: true },
      { new: true }
    );
  }

  async getDashboardAnalytics(userId) {
    const totalNotes = await Note.countDocuments({ userId, archived: false });
    const recentNotes = await Note.find({ userId, archived: false })
      .sort({ updatedAt: -1 })
      .limit(5)
      .select('title updatedAt');
    
    const allNotes = await Note.find({ userId });
    
    const stats = {
      tagsCount: {},
      aiUsageCount: 0
    };
    
    allNotes.forEach(note => {
      // Count tags
      if (note.tags && note.tags.length > 0) {
        note.tags.forEach(tag => {
          stats.tagsCount[tag] = (stats.tagsCount[tag] || 0) + 1;
        });
      }
      
      // Count AI usage
      const hasAiFeatures = note.aiSummary || (note.aiActionItems && note.aiActionItems.length > 0);
      if (hasAiFeatures) {
        stats.aiUsageCount++;
      }
    });

    const topTags = Object.entries(stats.tagsCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    return {
      totalNotes,
      recentNotes,
      topTags,
      aiUsageCount: stats.aiUsageCount
    };
  }
}

module.exports = new NoteService();
