import mongoose from "mongoose";

const boardSchema = new mongoose.Schema({
    name: {
        type: String,
        default: null,
        required: [true, 'Set name for Board'],
    },

    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    },

    icon: {
        type: String,
        required: [true, 'Set icon for board'],
    },

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
    { timestamps: true, versionKey: false }
);

const Board = mongoose.model('Board', boardSchema);
export default Board;

