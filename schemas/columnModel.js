import mongoose from "mongoose";

const columnSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Set name for Column'],
    },
    // тут ID дошки, до якої відноситься колонка
    boardId: {
        type: mongoose.Types.ObjectId,
        required: [true, 'Set boardId for Column'],
        ref: 'Board', // посилаємось на модель дошки 'Board'
    },
},
    { timestamps: true, versionKey: false } // залишаємо ?
);

const Column = mongoose.model('Column', columnSchema);
export default Column;
