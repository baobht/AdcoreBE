"use strict";

const { model, Schema } = require("mongoose");

const DOCUMENT_NAME = "Course";
const COLLECTION_NAME = "Courses";

var courseSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      maxLength: 150,
    },
    categories: {
      type: Array,
      default: [],
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 1,
    },
    cover_image: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

courseSchema.index({ createdAt: 1 }, { expireAfterSeconds: 600 });

export default model(DOCUMENT_NAME, courseSchema)
