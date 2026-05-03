const mongoose = require('mongoose');

const searchLogSchema = new mongoose.Schema(
  {
    query: { type: String, required: true, trim: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    college: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SearchLog', searchLogSchema);
