import { Schema, model } from 'mongoose';

const queryProjection = '-updatedAt';

const sessionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
  },
  {
    versionKey: false,
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret._id;

        queryProjection.split(' ').forEach(field => {
          if (field.length > 0 && field[0] === '-') {
            delete ret[field.slice(1)];
          }
        });
      },
    },
    toObject: { virtuals: true },
  }
);

sessionSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

export default model('Session', sessionSchema);
