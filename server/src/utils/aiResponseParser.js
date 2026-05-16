const parseJSON = (text) => {
  try {
    return JSON.parse(text);
  } catch (err) {
    // Attempt to extract JSON from markdown code blocks
    const match = text.match(/```json\n([\s\S]*?)\n```/);
    if (match && match[1]) {
      try {
        return JSON.parse(match[1]);
      } catch (e) {
        return null;
      }
    }
    return null;
  }
};

module.exports = parseJSON;
