const mongoose = require("mongoose");

mongoose.set("strictQuery", false);
const url = process.env.MONGODB_URI

mongoose
  .connect(url)
  .then((res) => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log("error connecting db", err.message);
  });

const phoneSchema = new mongoose.Schema({
  name: String,
  phone: Number,
});

phoneSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Phone", phoneSchema);
