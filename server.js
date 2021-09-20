const path = require("path");

const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");

const port = process.env.PORT || 3033;

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));

app.set("view engine", "ejs"); // template engine
app.set("views", path.join(__dirname, "views")); // setting views directory
app.use(express.static(path.join(__dirname, "public"))); // static files directory

const errorController = require("./Controller/error.controller");
const User = require("./Models/user.model");

const adminRouter = require("./routes/admin.routes");
const shopRouter = require("./Routes/shop.routes");

app.use((req, res, next) => {
  User.findById("6141fa5d4900a4d6907247a7")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err, "User error in server.js"));
});

app.use("/admin", adminRouter);
app.use("/", shopRouter);
app.use(errorController.get404);

mongoose
  .connect("mongodb://localhost:27017/shop", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          username: "Edikan",
          email: "Echma@gmail.com",
          cart: {
            items: [],
          },
        });
        user.save();
      }
    });

    console.log("database connected succesfuly");
    app.listen(port, () => {
      console.log(`Server running on ${port}`);
    });
  })
  .catch((err) => console.log("connection error: ", err.message));
