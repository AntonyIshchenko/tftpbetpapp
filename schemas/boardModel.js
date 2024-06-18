import mongoose from 'mongoose';
import { backgrounds } from '../data/index.js';

const queryProjection = '-createdAt -updatedAt -owner';

const boardSchema = new mongoose.Schema(
  {
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
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret._id;

        queryProjection.split(' ').forEach(field => {
          if (field.length > 0 && field[0] === '-') {
            delete ret[field.slice(1)];
          }
        });

        if (ret.background) {
          const background = backgrounds.find(
            elem => elem.name === ret.background
          );

          ret.background = background
            ? {
                name: background.name,
                desktop: background.desktop,
                desktop2x: background.desktop2x,
                tablet: background.tablet,
                tablet2x: background.tablet2x,
                mobile: background.mobile,
                mobile2x: background.mobile2x,
              }
            : '';
        } else {
          ret.background = '';
        }
      },
    },
    toObject: { virtuals: true },
  }
);

boardSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

const Board = mongoose.model('Board', boardSchema);
export default Board;
