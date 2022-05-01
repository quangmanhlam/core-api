import * as mongoose from 'mongoose';

export const UserResetPassSchema = new mongoose.Schema({
  userId: {type: String, required: true, index: true},
  verifyCode: {type: String, required: true},
  expiredAt: {type: Date, default: null},
  status: {type: String, default: null, index: true},

  createdBy: {type: String, default: null},
  updatedBy: {type: String, default: null},
  deletedBy: {type: String, default: null},
  deletedAt: {type: Date, default: null},
}, {
  timestamps: true,
  collection: 'user_reset_pass',
  autoIndex: true,
  autoCreate: true,
});
