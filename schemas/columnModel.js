import mongoose from "mongoose";

const columnSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Set name for Column'],
    },

    boardId: {
        type: mongoose.Types.ObjectId,
        required: [true, 'Set boardId for Column'],
        ref: 'Board',
    },
},
    { timestamps: true, versionKey: false }
);

const Column = mongoose.model('Column', columnSchema);
export default Column;
