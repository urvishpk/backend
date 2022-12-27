const mongoose = require("mongoose");

const customFormSchema = new mongoose.Schema({
  form: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Form",
  },
  fields: [
    {
      label: String,
      answer: String | [String],
    },
  ],
});

const CustomForm = mongoose.model("CustomForm", customFormSchema);

module.exports = CustomForm;
