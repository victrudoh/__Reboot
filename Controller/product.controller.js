// const adminData = require("./admin.controller");
const Product = require("../Models/product.model");
// const products = [];

module.exports = {

  getProductController: (req, res, next) => {
    Product.fetchAll((products) => {
      res.render("shop/product_list", {
        prods: products,
        pageTitle: "Products",
        path: "product_list"
      });
    });
  },

  getIndexController: (req, res, next) => {
    Product.fetchAll((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "index"
      });
    });
  },

  getcartController: (req, res) => {
    res.render("shop/cart", {
      pageTitle: "Your Cart",
      path: "cart"
    });
  },

  getOrdersController: (req, res) => {
    res.render("shop/orders", {
      pageTitle: "Your Order",
      path: "orders"
    });
  },

  getcheckoutController: (req, res) => {
    res.render("shop/checkout", {
      pageTitle: "Check Out",
      path: "/checkout"
    });
  },



};
