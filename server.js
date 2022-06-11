import express from "express";

const app = express();
const port = process.env.PORT || 5000;
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/", require("./routes"));

app.listen(port, () => {
  console.log("listening");
});
