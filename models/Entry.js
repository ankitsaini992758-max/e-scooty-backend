import mongoose from 'mongoose';

const entrySchema = new mongoose.Schema(
  {
    vehicleName: {
      type: String,
      required: [true, 'Please enter vehicle name'],
      trim: true,
    },
    actualPrice: {
      type: Number,
      required: [true, 'Please enter actual price'],
      min: 0,
    },
    sellingPrice: {
      type: Number,
      required: [true, 'Please enter selling price'],
      min: 0,
    },
    profit: {
      type: Number,
      required: true,
    },
    month: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Entry = mongoose.model('Entry', entrySchema);
export default Entry;
