import HttpError from "../helpers/httpError.js";
import ctrlWrapper from "../helpers/ctrlWrapper.js";
import taskServices from "../services/taskServices.js";
import 'dotenv/config';
import jsend from "jsend";

// ------------------------ Контролери для Дошки
//+
const getAllBoards = async (_, res) => {
  //отримуємо всі дошки, які знаходяться в нашій БД
  const board = await taskServices.board.getAll();

  res.jsend.success(board);
}

//+
const getOneBoard = async (req, res) => {
  const { id } = req.params;
  //цим методом шукаємо дошку, за вказаним ідентифікатором
  const board = await taskServices.board.getinfo({ _id: id });

  if (!board) {
    throw HttpError(404);
  }

  res.jsend.success(board);
}

//+
const createBoard = async (req, res) => {
  // const { name } = req.body;  // назва дошки
  // за допомогою цього методу, створюємо нову дошку
  const board = await taskServices.board.create({
    ...req.body, // копіюємо всі дані з тіла запиту,
    owner: req.user._id, // додаємо власника дошки, який зберігається в об'єкті req.user
  });

  res.jsend.success(board);
}

//+
const editBoard = async (req, res) => {
  const { id } = req.params;
  //шукаємо дошку за ID і власником (owner) з використанням findOne.
  const board = await taskServices.board.getData({ _id: id, owner: req.user.id });
  // const board = await taskServices.board.getData(); тест

  if (!board) {
    throw HttpError(404);
  }
  //використовуємо параметр findByIdAndUpdate, для оновлення дошки, за ID, та за допомогою new: true, повертаємо оновлену дошку
  const updatedBoard = await taskServices.board.update(id, req.body, { new: true });

  if (!updatedBoard) {
    throw HttpError(404);
  }

  res.jsend.success(updatedBoard);
}

//+
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

  res.jsend.success(deletedBoard);
}

// ------------------------ Контролери для Колонки
//+
const createColumn = async (req, res) => {
  //отримуємо значення властивості name з тіла запиту,
  const { name } = req.body;
  //отримуємо значення властивості boardId з параметрів запиту,
  const { boardId } = req.params;

  if (!name) {
    throw HttpError(400, 'Name is required');
  }

  // Створення нової колонки
  const newColumn = await taskServices.column.create({
    name,
    boardId,
  });

  res.jsend.success(newColumn);
}

//+
const editColumn = async (req, res) => {
  //отримуємо ID колонки та дошки,
  const { id, boardId } = req.params;
  // const { id } = req.params; тест

  //та оновлюємо за вказаними умовами
  const updatedColumn = await taskServices.column.update({
    _id: id,
    boardId,
  },
    req.body,
    { new: true });

  if (!updatedColumn) {
    throw HttpError(404);
  }

  res.jsend.success(updatedColumn);
}

//+
const deleteColumn = async (req, res) => {
  const { id, boardId } = req.params;

  const deletedColumn = await taskServices.column.delete({
    _id: id,
    boardId,
  });

  if (!deletedColumn) {
    throw HttpError(404);
  }

  res.jsend.success(deletedColumn);
}


// ------------------------ Контролери для Завдань
//+
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
    columnId,
    boardId,
  }

  //створюємо завдання
  const newTask = await taskServices.task.create(taskInfo);

  res.jsend.success(newTask);
}

//+
const editTask = async (req, res) => {
  //отримуємо ID колонки та дошки
  const { columnId, boardId } = req.params;

  //оновлюємо за вказаними умовами
  const updatedTask = await taskServices.task.update(
    { _id: columnId, boardId },
    req.body,
    { new: true }
  );

  if (!updatedTask) {
    throw HttpError(404);
  }

  res.jsend.success(updatedTask);
}

//+
const deleteTask = async (req, res) => {
  //отримуємо ID колонки та дошки
  const { columnId, boardId } = req.params;

  //видалаємо за вказаними умовами, методом findOneAndDelete
  const deletedTask = await taskServices.task.delete({
    _id: columnId, boardId,
  });

  //перевіряємо чи успішно видалилось
  if (!deletedTask) {
    throw HttpError(404);
  }

  //надсилаємо відповідь з видаленням завдання
  res.jsend.success(deletedTask);
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
