const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'a tour must have a name'],
      unique: true,
      trim: true,
    },
    duration: {
      type: Number,
      required: [true, 'a duration is needed'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'a team size is needed'],
    },

    difficulty: {
      type: String,
      required: [true, 'must have difficulty level'],
    },

    ratingsAverage: {
      type: Number,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },

    price: {
      type: Number,
      required: true,
    },

    priceDiscount: Number,

    summary: {
      type: String,
      trim: true,
      required: [true, 'a summary is mandatory'],
    },

    description: {
      type: String,
      trim: true,
    },

    imageCover: {
      type: String,
      required: [true, 'cover image is required'],
    },

    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

tourSchema.pre('save', function () {
  console.log(this);
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
