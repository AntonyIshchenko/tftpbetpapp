import { Schema, model } from 'mongoose';

const sessionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    refreshToken: { type: String, required: true },
  },
  { versionKey: false }
);

export default model('Session', sessionSchema);
