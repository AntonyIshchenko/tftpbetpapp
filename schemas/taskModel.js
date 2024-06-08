import mongoose from 'mongoose';

const queryProjection = '-createdAt -updatedAt';

const taskSchema = new mongoose.Schema(
  {
    //назва завдання
    name: {
      type: String,
      required: [true, 'Set name for Task'],
    },
    // ID колонки, до якої відноситься завдання
    columnId: {
      type: mongoose.Types.ObjectId,
      required: [true, 'Set columnId for Task'],
      ref: 'Column', // це посилання на модель колонки 'Column'
    },
    // ID дошки, з посиланням на модель 'Board'
    boardId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'Board',
    },
    //тут ми описуємо завдання
    description: {
      type: String,
    },
    //визначаємо приорітет
    priority: {
      type: String,
      enum: ['without', 'low', 'medium', 'high'],
      default: 'without',
    },
    //встановлюємо дедлайни на конкретне завдання
    deadline: {
      type: String,
      default: '',
    },
    /* deadline: {
         type: Date,
         default: null,
     },*/
  },
  //створення та оновлення таски
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

taskSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

const Task = mongoose.model('Task', taskSchema);
export default Task;

/* export default mongoose.model('Task', taskSchema);
 */
