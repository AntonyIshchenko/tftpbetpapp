import Board from './../schemas/boardModel.js';
import Column from './../schemas/columnModel.js';
import Task from './../schemas/taskModel.js';

const board = {
  create: async boardData => Board.create(boardData),

  getAll: async userId => Board.find({ owner: userId }),

  getData: async boardId => {
    const data = await Promise.all([
      Board.findById(boardId),
      Column.find({ boardId }),
      Task.find({ boardId }, { sort: 'deadline' }),
    ]);

    console.log(data);

    return { board: data[0], columns: data[1], tasks: data[2] };
  },

  getinfo: async boardId => Board.findById(boardId),

  update: async (boardId, data) =>
    Board.findByIdAndUpdate(boardId, data, { new: true }),

  delete: async boardId => {
    await Task.deleteMany(boardId);
    await Column.deleteMany(boardId);
    return await Board.findByIdAndDelete(boardId);
  },
};

const column = {
  create: async columnData => Column.create(columnData),

  getAll: async boardId => Column.find(boardId),

  update: async (columnId, data) =>
    Column.findByIdAndUpdate(columnId, data, { new: true }),

  delete: async columnId => {
    await Task.deleteMany(columnId);
    return await Column.findByIdAndDelete(columnId);
  },
};

const task = {
  create: async taskData => Task.create(taskData),

  getAll: async boardId => Task.find(boardId),

  update: async (taskId, data) =>
    Task.findByIdAndUpdate(taskId, data, { new: true }),

  delete: async taskId => {
    return await Task.findByIdAndDelete(taskId);
  },
};

export default {
  board,
  column,
  task,
};
