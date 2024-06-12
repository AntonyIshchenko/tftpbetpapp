import mongoose from 'mongoose';

const queryProjection = '-createdAt -updatedAt';

const taskSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Set name for Task'],
    },
    boardId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'Board',
    },
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

taskSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

const Task = mongoose.model('Task', taskSchema);
export default Task;
