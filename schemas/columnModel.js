import mongoose from "mongoose";

const columnSchema = new mongoose.Schema({
    //назва колонки
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
    //створення та оновлення колонки
    { timestamps: true, versionKey: false } // залишаємо ?
);

const Column = mongoose.model('Column', columnSchema);
export default Column;

/* export default mongoose.model('Column', columnSchema); 
*/