import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Set name for Task'],
    },
    // ID дошки, з посиланням на модель 'Board'
    boardId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'Board',
    },
    // ID колонки, до якої відноситься завдання
    columnId: {
      type: mongoose.Types.ObjectId,
      required: [true, 'Set columnId for Task'],
      ref: 'Column',
    },

    description: {
      type: String,
    },

    priority: {
      type: String,
      enum: ['without', 'low', 'medium', 'high'],
      default: 'without',
    },

    deadline: {
      type: String,
      default: '',
    },
    /* deadline: {
         type: Date,
         default: null,
     },*/
  },
  { timestamps: true, versionKey: false }
);

const Task = mongoose.model('Task', taskSchema);
export default Task;

