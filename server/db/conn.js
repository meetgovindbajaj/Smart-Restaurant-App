const mongoose = require("mongoose");
const DB = process.env.DATABASE;

mongoose
  .connect(DB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    console.log(`connection successful`);
  })
  .catch((err) => {
    console.log(`no connection`);
    console.log(err);
  });