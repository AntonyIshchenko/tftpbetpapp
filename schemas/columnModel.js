import mongoose from 'mongoose';

const queryProjection = '-createdAt -updatedAt';

const columnSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Set name for Column'],
    },
    boardId: {
      type: mongoose.Types.ObjectId,
      required: [true, 'Set boardId for Column'],
      ref: 'Board',
    },
  },
  {
    timestamps: true,
    versionKey: false,
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

columnSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

const Column = mongoose.model('Column', columnSchema);
export default Column;
