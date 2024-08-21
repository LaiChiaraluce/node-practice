const mongoose = require("mongoose");

const password = "RC5vquKuPw2Y8Yr5";

const url = `mongodb+srv://laito-final-project:${password}@cluster0.5s0sn.mongodb.net/prueba?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set("strictQuery", false);

mongoose.connect(url);

// const user = process.argv[2];
// const phoneNumber = process.argv[3];

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

const Phone = mongoose.model("Phone", phoneSchema);

// const phone = new Phone({
//   name: user,
//   phone: phoneNumber,
// });

// phone.save().then((result) => {
//   console.log(result);
//   console.log("phone saved!");
// });

Phone.find({}).then((result) => {
  result.forEach((phone) => {
    console.log(phone);
  });
  mongoose.connection.close();
});
