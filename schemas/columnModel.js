import mongoose from 'mongoose';

const queryProjection = '-createdAt -updatedAt';

const columnSchema = new mongoose.Schema(
  {
    //назва колонки
    name: {
      type: String,
      required: [true, 'Set name for Column'],
    },
    // тут ID дошки, до якої відноситься колонка
    boardId: {
      type: mongoose.Types.ObjectId,
      required: [true, 'Set boardId for Column'],
      ref: 'Board', // посилаємось на модель дошки 'Board'
    },
  },
  //створення та оновлення колонки
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

/* export default mongoose.model('Column', columnSchema);
 */
