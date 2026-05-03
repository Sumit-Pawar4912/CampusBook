const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    college: { type: String, required: true, trim: true },
    branch: { type: String, required: true, trim: true },
    semester: { type: Number, required: true, min: 1, max: 12 },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isVerified: { type: Boolean, default: false },
    isBanned: { type: Boolean, default: false },
    trustScore: { type: Number, default: 0 },
    transactions: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
  },
  { timestamps: true }
);

userSchema.pre('save', function (next) {
  this.trustScore = this.transactions * 10 + this.rating * 10 + (this.isVerified ? 20 : 0);
  next();
});

userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('User', userSchema);
