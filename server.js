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

const adminRouter = require("./routes/admin.routes");
const shopRouter = require("./routes/shop.routes");

app.use("/admin", adminRouter);
app.use("/user", shopRouter);

app.use((req, res, next) => {
  res.status(404).render("404");
});

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});
