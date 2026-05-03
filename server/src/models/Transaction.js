const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['Requested', 'Accepted', 'Completed', 'Cancelled'],
      default: 'Requested',
    },
    meetupLocation: { type: String, required: true, trim: true },
    meetupDateTime: { type: Date, required: true },
    mockPaymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Not Required'],
      default: 'Pending',
    },
    price: { type: Number, default: 0, min: 0 },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Transaction', transactionSchema);
