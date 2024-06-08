import HttpError from "../helpers/httpError.js";
import ctrlWrapper from "../helpers/ctrlWrapper.js";
import taskServices from "../services/taskServices.js";
import 'dotenv/config';

// ------------------------ Контролери для Board! Done!
const getAllBoards = async (req, res) => {
  const userId = req.user.id;
  //отримуємо всі дошки, які знаходяться в нашій БД
  const board = await taskServices.board.getAll(userId);

  res.success(board, 200);
}

// ----------
const getOneBoard = async (req, res) => {
  const { id } = req.params;
  //цим методом шукаємо дошку, за вказаним ідентифікатором
  const board = await taskServices.board.getinfo({ _id: id });

  if (!board) {
    throw HttpError(404);
  }

  res.success(board, 200);
}

// ----------
const createBoard = async (req, res) => {
  const board = await taskServices.board.create({
    ...req.body, // копіюємо всі дані з тіла запиту,
    owner: req.user._id, // додаємо власника дошки, який зберігається в об'єкті req.user
  });

  res.success(board, 200);
}

// ----------
const editBoard = async (req, res) => {
  const { id } = req.params;
  //шукаємо дошку за ID і власником (owner) з використанням findOne.
  const board = await taskServices.board.getData({ _id: id, owner: req.user.id });

  if (!board) {
    throw HttpError(404);
  }
  //використовуємо параметр findByIdAndUpdate, для оновлення дошки, за ID, та за допомогою new: true, повертаємо оновлену дошку
  const updatedBoard = await taskServices.board.update(id, req.body, { new: true });

  if (!updatedBoard) {
    throw HttpError(404);
  }

  res.success(updatedBoard, 200);
}

// ----------
const deleteBoard = async (req, res) => {
  const { id } = req.params;

  //шукаємо дошку, за вказаним ідентифікатором та перевіряємо, чи вона належить саме тому користувачеві, який виконав запит
  const deletedBoard = await taskServices.board.delete({
    _id: id,
    owner: req.user.id,
  });

  if (!deletedBoard) {
    throw HttpError(404);
  }

  res.success(deletedBoard, 200);
}

// ------------------------ Контролери для Колонки! Done!
const createColumn = async (req, res) => {
  const { name } = req.body;
  //отримуємо значення властивості boardId з параметрів запиту,
  const { boardId } = req.params;

  if (!name) {
    throw HttpError(400, 'Name is required');
  }
  // Створення нової колонки за допомогою заданих параметрів
  const newColumn = await taskServices.column.create({
    name,
    boardId,
  });

  res.success(newColumn, 200);
}

// ----------
const editColumn = async (req, res) => {
  //отримуємо ID колонки та дошки,
  const { id, boardId } = req.params;

  //цей метод оновлює колонку за вказаними умовами
  const updatedColumn = await taskServices.column.update({
    _id: id,
    boardId,
  },
    req.body,
    { new: true });

  if (!updatedColumn) {
    throw HttpError(404);
  }

  res.success(updatedColumn);
}

// ----------
const deleteColumn = async (req, res) => {
  const { id, boardId } = req.params;

  //цей метод видалає дошку, за допомогою вказаних параметрів
  const deletedColumn = await taskServices.column.delete({
    _id: id,
    boardId,
  });

  if (!deletedColumn) {
    throw HttpError(404);
  }

  res.success(deletedColumn);
}


// ------------------------ Контролери для Завдань! Done!
const createTask = async (req, res) => {
  //отримуємо дані про завдання з тіла запиту
  const { name, description, priority } = req.body;
  //отримуємо ID колонки та дошки
  const { columnId, boardId } = req.params;

  //створюємо об'єкт з інф. завдання
  const taskInfo = {
    name,
    description,
    priority: priority || 'without',
    deadline: '',
    boardId,
    columnId,
  }
  //за допомогою цього метода, створюємо завдання
  const newTask = await taskServices.task.create(taskInfo);

  res.success(newTask);
}

// ----------
const editTask = async (req, res) => {
  //отримуємо ID колонки та дошки
  const { columnId, boardId, id } = req.params;

  //за допомогою метода, оновлюємо за вказаними параметрами
  const updatedTask = await taskServices.task.update(
    { _id: id, boardId, columnId },
    req.body,
    { new: true }
  );

  if (!updatedTask) {
    throw HttpError(404);
  }

  res.success(updatedTask);
}

// ----------
const deleteTask = async (req, res) => {
  //отримуємо ID колонки, дошки та завдання
  const { columnId, boardId, id } = req.params;

  //видалаємо за вказаними умовами, методом findOneAndDelete
  const deletedTask = await taskServices.task.delete({
    _id: id, boardId, columnId,
  });

  if (!deletedTask) {
    throw HttpError(404);
  }

  res.success(deletedTask);
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
