import mongoose from 'mongoose';

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
  { timestamps: true, versionKey: false } // залишаємо ?
);

const Task = mongoose.model('Task', taskSchema);
export default Task;

/* export default mongoose.model('Task', taskSchema);
 */
