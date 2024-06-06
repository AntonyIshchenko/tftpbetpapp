import HttpError from "../helpers/httpError.js";
import ctrlWrapper from "../helpers/ctrlWrapper.js";

//Контролери для Дошки
const getAllBoards = async (req, res) => {
  //отримуємо всі дошки, які знаходяться в нашій БД
  const board = await Board.find({});

  res.json(board);
}

const getOneBoard = async (req, res) => {
  const { id } = req.params;
  //цим методом шукаємо дошку, за вказаним ідентифікатором
  const board = await Board.findOne({ _id: id });

  if (!board) {
    throw HttpError(404);
  }

  res.json(board);
}

const createBoard = async (req, res) => {
  // за допомогою цього методу, створюємо нову дошку
  const board = await Board.create({
    ...req.body, // копіюємо всі дані з тіла запиту,
    owner: req.user._id, // додаємо власника дошки, який зберігається в об'єкті req.user
  });

  res.status(200).json(board);
}

const editBoard = async (req, res) => {
  const { id } = req.params;
  //шукаємо дошку за ID і власником (owner) з використанням findOne.
  const board = await Board.findOne({ _id: id, owner: req.user.user.id });

  if (!board) {
    throw HttpError(404);
  }
  //використовуємо параметр findByIdAndUpdate, для оновлення дошки, за ID, та за допомогою new: true, повертаємо оновлену дошку
  const updateBoard = await Board.findByIdAndUpdate(id, req.body, { new: true });

  if (!updateBoard) {
    throw HttpError(404);
  }

  res.status(200).json(updateBoard);
}

const deleteBoard = async (req, res) => {
  const { id } = req.params;

  //шукаємо дошку, за вказаним ідентифікатором та перевіряємо, чи вона належить саме тому користувачеві, який виконав запит
  const board = await Board.findOneAndDelete({
    _id: id,
    owner: req.user.id,
  });

  if (!board) {
    throw HttpError(404);
  }

  res.status(200).json(board);
}

//Контролери для Колонки
const createColumn = async (req, res, next) => {
  //отримуємо значення властивості name з тіла запиту,
  const { name } = req.body;
  //отримуємо значення властивості boardId з параметрів запиту,
  const { boardId } = req.params;

  if (!name) {
    throw HttpError(400, 'Name is required');
  }

  // Створення нової колонки
  const newColumn = await Column.create({
    name,
    boardId,
  });

  res.status(200).json(newColumn);
}

const editColumn = async (req, res, next) => {
}

const deleteColumn = async (req, res, next) => {
}

//Контролери для Завдань
const createTask = async (req, res, next) => {
}

const editTask = async (req, res, next) => {
}

const deleteTask = async (req, res, next) => {
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



