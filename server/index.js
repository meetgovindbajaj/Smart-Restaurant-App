const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const PORT = process.env.PORT || 5000;
const cookieParser = require("cookie-parser");
require("./db/conn");
app.use(cookieParser());
app.use(express.json());
function time() {
  const c = new Date();
  function convertTZ(date, tzString) {
    return new Date(
      (typeof date === "string" ? new Date(date) : date).toLocaleString(
        "en-US",
        { timeZone: tzString }
      )
    );
  }
  const a = convertTZ(c, "Asia/Kolkata");
  return a.getHours() + ":" + a.getMinutes() + ":" + a.getSeconds();
}

app.use(require("./routers/auth"));

app.listen(PORT, () => {
  console.log(
    `\n\nWE ARE ONLINE ~ \n\nURL\t: http://localhost:${PORT}\nTIME\t: ${time()}\n`
  );
});
