const CustomForm = require("../models/CustomForm");
const Form = require("../models/Form");

const saveForm = async (req, res) => {
  if (!validateForm(req.body)) {
    res.status(400).json({ message: "Invalid input" });
    return;
  }
  try {
    const form = new Form(req.body);
    const savedForm = await form.save();
    res.status(201).json(savedForm);
  } catch (e) {
    res.status(400).json({ message: "Invalid input" });
  }
};

const validateForm = (form) => {
  if (!form.title) return false;
  if (!form.fields || form.fields.length === 0) return false;
  let isValid = true;
  form.fields.forEach((f) => {
    if (f.options && !Array.isArray(f.options)) isValid = false;
  });
  return isValid;
};

const getForms = async (req, res) => {
  try {
    const forms = await Form.find();
    res.status(200).json(forms);
  } catch (e) {
    res.status(500);
  }
};

const getFormById = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    res.status(200).json(form);
  } catch (e) {
    res.status(500);
  }
};

const saveCustomFormData = async (req, res) => {
  try {
    const requestBody = {
      form: req.params.id,
      fields: parseRequest(req.body),
    };
    const customForm = new CustomForm(requestBody);
    const result = await customForm.save();
    await Form.findOneAndUpdate(
      { _id: req.params.id },
      { $inc: { totalResponses: 1 } }
    );

    res.status(201).json(result);
  } catch (e) {
    res.status(500);
  }
};

const parseRequest = (data) => {
  const fields = [];
  const keys = Object.keys(data);
  for (key of keys) {
    const field = {
      label: key,
      answer: data[key],
    };
    fields.push(field);
  }
  return fields;
};

module.exports = { saveForm, getForms, getFormById, saveCustomFormData };
