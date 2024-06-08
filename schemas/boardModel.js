import mongoose from 'mongoose';

const queryProjection = '-createdAt -updatedAt -owner';

const boardSchema = new mongoose.Schema(
  {
    //назва дошки
    name: {
      type: String,
      default: null,
      required: [true, 'Set name for Board'],
    },
    //власник дошки
    owner: {
      type: mongoose.Types.ObjectId,
      ref: 'User', //посилання на модель користувача 'User'
    },
    // створюємо іконку
    icon: {
      type: String,
      required: [true, 'Set icon for board'],
    },
    // створюємо бекграунд з типом та посиланням
    background: {
      type: {
        type: String,
        // required: true,
      },
      url: {
        type: String,
        // required: true,
      },
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

boardSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

const Board = mongoose.model('Board', boardSchema);
export default Board;

/* export default mongoose.model('Board', boardSchema);
 */
