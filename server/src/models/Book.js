const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true },
    branch: { type: String, required: true, trim: true },
    semester: { type: Number, required: true, min: 1, max: 12 },
    college: { type: String, required: true, trim: true },
    condition: { type: String, enum: ['New', 'Like New', 'Good', 'Old'], required: true },
    type: { type: String, enum: ['Sell', 'Exchange', 'Donate'], required: true },
    price: { type: Number, default: 0, min: 0 },
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
      },
    ],
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected', 'Sold'], default: 'Pending' },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Book', bookSchema);
