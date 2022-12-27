const express = require("express");
const {
  saveForm,
  getForms,
  getFormById,
  saveCustomFormData,
} = require("../controllers/form.controller");
const router = express.Router();

router.post("/form", saveForm);
router.get("/forms", getForms);
router.get("/form/:id", getFormById);
router.post("/form/:id", saveCustomFormData);

module.exports = router;
