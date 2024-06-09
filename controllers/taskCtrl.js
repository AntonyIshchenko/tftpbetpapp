import HttpError from "../helpers/httpError.js";
import ctrlWrapper from "../helpers/ctrlWrapper.js";
import taskServices from "../services/taskServices.js";

const success = data => ({
  status: 'success',
  data
});

// ------------------------ Контролери для Board
const getAllBoards = async (req, res) => {
  const userId = req.user.id;
  const board = await taskServices.board.getAll(userId);

  res.json(success(board));
}

const getOneBoard = async (req, res) => {
  const { id } = req.params;
  const board = await taskServices.board.getinfo({ _id: id });

  if (!board) {
    throw HttpError(404, 'Board not found');
  }

  res.json(success(board));
}

const createBoard = async (req, res) => {
  const board = await taskServices.board.create({
    ...req.body,
    owner: req.user._id, // власник дошки
  });

  res.status(201).json(success(board));
}

const editBoard = async (req, res) => {
  //шукаємо дошку за ID і власником (owner) з використанням findOne. Обговоримо цю перевірку, пізніше
  /*const board = await taskServices.board.getData({ _id: id, owner: req.user.id });

  if (!board) {
    throw HttpError(404);
  }*/

  if (Object.keys(req.body).length === 0)
    throw HttpError(400, 'Body must have at least one field');

  const { id } = req.params;
  const updatedBoard = await taskServices.board.update(id, req.body, { new: true });

  if (!updatedBoard) {
    throw HttpError(404, 'Board not found');
  }

  res.json(success(updatedBoard));
}

const deleteBoard = async (req, res) => {
  const { id } = req.params;

  const deletedBoard = await taskServices.board.delete({
    _id: id,
    owner: req.user.id,
  });

  if (!deletedBoard) {
    throw HttpError(404, 'Board not found');
  }

  res.json(success(deletedBoard));
}

// ------------------------ Контролери для Column! Done!
const createColumn = async (req, res) => {
  const { boardId, name } = req.body;

  const newColumn = await taskServices.column.create({
    name,
    boardId,
  });

  res.status(201).json(success(newColumn));
}

const editColumn = async (req, res) => {

  if (Object.keys(req.body).length === 0)
    throw HttpError(400, 'Body must have at least one field');

  const { id } = req.params;

  const updatedColumn = await taskServices.column.update(id, req.body, { new: true });

  if (!updatedColumn) {
    throw HttpError(404, 'Column not found');
  }

  res.json(success(updatedColumn));
}

const deleteColumn = async (req, res) => {
  const { id } = req.params;

  const deletedColumn = await taskServices.column.delete({ _id: id });

  if (!deletedColumn) {
    throw HttpError(404, 'Column not found');
  }

  res.json(success(deletedColumn));
}

// ------------------------ Контролери для Task! Done!
const createTask = async (req, res) => {
  const newTask = await taskServices.task.create(req.body);

  res.status(201).json(success(newTask));
}

const editTask = async (req, res) => {

  if (Object.keys(req.body).length === 0)
    throw HttpError(400, 'Body must have at least one field');

  const { id } = req.params;

  const updatedTask = await taskServices.task.update({ _id: id }, req.body, { new: true });

  if (!updatedTask) {
    throw HttpError(404, 'Task not found');
  }

  res.json(success(updatedTask));
}

const deleteTask = async (req, res) => {
  const { id } = req.params;
  const deletedTask = await taskServices.task.delete({ _id: id });

  if (!deletedTask) {
    throw HttpError(404, 'Task not found');
  }

  res.json(success(deletedTask));
}

export default {
  getAllBoards: ctrlWrapper(getAllBoards),
  getOneBoard: ctrlWrapper(getOneBoard),
  createBoard: ctrlWrapper(createBoard),
  editBoard: ctrlWrapper(editBoard),
  deleteBoard: ctrlWrapper(deleteBoard),
  //
  createColumn: ctrlWrapper(createColumn),
  editColumn: ctrlWrapper(editColumn),
  deleteColumn: ctrlWrapper(deleteColumn),
  //
  createTask: ctrlWrapper(createTask),
  editTask: ctrlWrapper(editTask),
  deleteTask: ctrlWrapper(deleteTask),
}
