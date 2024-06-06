import mongoose from "mongoose";

const boardSchema = new mongoose.Schema({
    //назва дошки
    name: {
        type: String,
        default: null,
        required: [true, 'Set name for Board'],
    },
    //власник дошки
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'User', //посилання на модель користувача 'User'
    },
    // створюємо іконку 
    icon: {
        type: String,
        required: [true, 'Set icon for board'],
    },
    // створюємо бекграунд з типом та посиланням
    background: {
        type: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
},
    //створення та оновлення колонки
    { timestamps: true, versionKey: false } // залишаємо ? 
);

const Board = mongoose.model('Board', boardSchema);
export default Board;

/* export default mongoose.model('Board', boardSchema); 
*/

