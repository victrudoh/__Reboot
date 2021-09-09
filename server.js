const express = require("express");
const morgan = require("morgan");
const path = require("path");

const port = process.env.PORT || 3033;

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));

app.set("view engine", "ejs"); // template engine
app.set("views", path.join(__dirname, "views")); // setting views directory
app.use(express.static(path.join(__dirname, "public"))); // static files directory

const errorController = require("./Controller/error.controller");

const adminRouter = require("./routes/admin.routes");
const productRouter = require("./Routes/product.routes");

app.use("/admin", adminRouter);
app.use("/", productRouter);
app.use(errorController.errorController);


app.listen(port, () => {
  console.log(`Server running on ${port}`);
});
