const mongoose = require("mongoose");

const formSchema = new mongoose.Schema(
  {
    title: String,
    fields: [
      {
        label: String,
        type: {
          type: String,
          enum: ["text", "checkbox", "radio"],
          default: "text",
        },
        options: {
          type: [String],
        },
      },
    ],
    totalResponses: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Form = mongoose.model("Form", formSchema);

module.exports = Form;
