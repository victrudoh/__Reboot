const adminData = require("./admin.controller");
const Product = require("../Models/product.model");
const products = [];

module.exports = {
  loginController: (req, res) => {
    res.render("shop/product_list", { path: "product_list" });
  },

  getAddProductController: (req, res) => {
    res.render("admin/add_product", { path: "add_product" });
  },

  postAddProductController: (req, res, next) => {
    const title = req.body.title;
    const media = req.body.media;
    const price = req.body.price;
    const description = req.body.description;
    // products.push(req.body);
    const product = new Product(title, media, price, description);
    product.save();
    res.redirect("/products");
  },

  getProductController: (req, res, next) => {
    Product.fetchAll((products) => {
      res.render("admin/adminProduct_list", {
        prods: products,
        pageTitle: "Admin Products",
        path: "adminProduct_list"
      });
    });
  },
};
