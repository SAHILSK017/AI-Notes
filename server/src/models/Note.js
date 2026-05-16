const mongoose = require('mongoose');
const crypto = require('crypto');

const noteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      default: 'Untitled Note',
    },
    content: {
      type: String,
      default: '',
    },
    tags: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      default: 'Uncategorized',
    },
    archived: {
      type: Boolean,
      default: false,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    shareId: {
      type: String,
      unique: true,
      sparse: true,
    },
    aiSummary: {
      type: String,
      default: '',
    },
    aiActionItems: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

noteSchema.pre('save', function () {
  if (this.isPublic && !this.shareId) {
    this.shareId = crypto.randomBytes(16).toString('hex');
  }
});

const Note = mongoose.model('Note', noteSchema);
module.exports = Note;
