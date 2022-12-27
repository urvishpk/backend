const mongoose = require("mongoose");
const Form = require("../models/Form");

const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../server");
const expect = chai.expect;

chai.use(chaiHttp);
describe("Form", () => {
  describe("POST /form", () => {
    before(async () => {
      await Form.deleteMany({ title: "Test Form" });
    });

    it("it should return 400 Bad Request for no input", async () => {
      const res = await chai.request(app).post("/api/form").send({});
      expect(res.status).to.equal(400);
    });

    it("it should return 400 Bad Request for incomplete input", async () => {
      const res = await chai
        .request(app)
        .post("/api/form")
        .send({ title: "Test Form" });
      expect(res.status).to.equal(400);
    });

    it("it should return 400 Bad Request for incomplete input", async () => {
      const res = await chai
        .request(app)
        .post("/api/form")
        .send({ title: "Test Form", fields: [] });
      expect(res.status).to.equal(400);
    });

    it("it should return 400 Bad Request for invalid input", async () => {
      const res = await chai
        .request(app)
        .post("/api/form")
        .send({
          title: "Test Form",
          fields: [{ label: "name", type: "textbox" }],
        });
      expect(res.status).to.equal(400);
    });

    it("it should return 400 Bad Request for invalid input", async () => {
      const res = await chai
        .request(app)
        .post("/api/form")
        .send({
          title: "Test Form",
          fields: [{ label: "name", type: "checkbox", options: "Wrong input" }],
        });
      expect(res.status).to.equal(400);
    });

    it("it should return 201 Created for valid input", async () => {
      const res = await chai
        .request(app)
        .post("/api/form")
        .send({
          title: "Test Form",
          fields: [{ label: "Name", type: "text" }],
        });
      expect(res.status).to.equal(201);
      const { title, fields } = res.body;
      expect(title).to.equal("Test Form");
      expect(fields[0].label).to.equal("Name");
      expect(fields[0].type).to.equal("text");
      expect(fields[0].options).to.have.length(0);
    });

    it("it should return 201 Created for valid input", async () => {
      const res = await chai
        .request(app)
        .post("/api/form")
        .send({
          title: "Test Form",
          fields: [
            {
              label: "Name",
              type: "text",
            },
            {
              label: "Vehicles",
              type: "checkbox",
              options: ["Bike", "Car", "Chopper"],
            },
          ],
        });
      expect(res.status).to.equal(201);
      const { title, fields } = res.body;
      expect(title).to.equal("Test Form");
      expect(fields[0].label).to.equal("Name");
      expect(fields[0].type).to.equal("text");
      expect(fields[0].options).to.have.length(0);
      expect(fields[1].label).to.equal("Vehicles");
      expect(fields[1].type).to.equal("checkbox");
      expect(fields[1].options).to.have.length(3);
      expect(fields[1].options[0]).to.equal("Bike");
      expect(fields[1].options[1]).to.equal("Car");
      expect(fields[1].options[2]).to.equal("Chopper");
    });

    it("it should return 201 Created for valid input", async () => {
      const res = await chai
        .request(app)
        .post("/api/form")
        .send({
          title: "Test Form",
          fields: [
            {
              label: "Name",
              type: "text",
            },
            {
              label: "Vehicles",
              type: "checkbox",
              options: ["Bike", "Car", "Chopper"],
            },
            {
              label: "Gender",
              type: "radio",
              options: ["Male", "Female"],
            },
          ],
        });
      expect(res.status).to.equal(201);
      const { title, fields } = res.body;
      expect(title).to.equal("Test Form");
      expect(fields[0].label).to.equal("Name");
      expect(fields[0].type).to.equal("text");
      expect(fields[0].options).to.have.length(0);
      expect(fields[1].label).to.equal("Vehicles");
      expect(fields[1].type).to.equal("checkbox");
      expect(fields[1].options).to.have.length(3);
      expect(fields[1].options[0]).to.equal("Bike");
      expect(fields[1].options[1]).to.equal("Car");
      expect(fields[1].options[2]).to.equal("Chopper");
      expect(fields[2].label).to.equal("Gender");
      expect(fields[2].type).to.equal("radio");
      expect(fields[2].options[0]).to.equal("Male");
      expect(fields[2].options[1]).to.equal("Female");
    });
  });

  describe("GET /forms", () => {
    it("it should return 200 OK", async () => {
      const res = await chai.request(app).get("/api/forms");
      expect(res.status).to.equal(200);
      expect(res.body[0]).to.have.property("title");
      expect(res.body[0]).to.have.property("fields");
      expect(res.body[0]).to.have.property("totalResponses");
      expect(res.body[0]).to.have.property("createdAt");
      expect(res.body[0]).to.have.property("updatedAt");
    });
  });

  describe("GET /form/:id", () => {
    it("it should return 200 OK", async () => {
      const allForms = await chai.request(app).get("/api/forms");
      const id = allForms.body[0]._id;
      const res = await chai.request(app).get(`/api/form/${id}`);
      expect(res.status).to.equal(200);
      expect(res.body.title).to.equal(allForms.body[0].title);
      expect(res.body.fields.length).to.equal(allForms.body[0].fields.length);
      expect(res.body.totalResponses).to.equal(allForms.body[0].totalResponses);
      expect(res.body.createdAt).to.equal(allForms.body[0].createdAt);
      expect(res.body.updatedAt).to.equal(allForms.body[0].updatedAt);
    });
  });

  describe("POST /form/:id", () => {
    it("it should return 200 OK", async () => {
      const form = await Form.findOne({ title: "Test Form" });
      const res = await chai
        .request(app)
        .post(`/api/form/${form._id}`)
        .send({ ["Name"]: "Urvish" });
      expect(res.body.fields[0].label).to.equal("Name");
      expect(res.body.fields[0].answer).to.equal("Urvish");
    });
  });
});
