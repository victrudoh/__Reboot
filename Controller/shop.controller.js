const Product = require("../Models/product.model");
const Order = require("../Models/order.model");
const moment = require('moment');

module.exports = {
  getProductController: (req, res, next) => {
    Product.find({ isDisabled: false })
      .then((products) => {
        res.render("shop/product_list", {
          prods: products,
          pageTitle: "Products",
          path: "product_list",
        });
      })
      .catch((err) => {
        console.log(err, "getProductController");
      });
  },

  getProductByIdController: (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId)
      .then((product) => {
        res.render("shop/product_detail", {
          product: product,
          pageTitle: product.title,
          path: "product_list", //so the products header will be active when we view the product
        });
      })
      .catch((err) => {
        console.log(err, "getProductByIdController");
      });
  },

  getIndexController: (req, res, next) => {
    Product.find()
      .then((products) => {
        res.render("shop/index", {
          prods: products,
          pageTitle: "Shop",
          path: "index",
        });
      })
      .catch((err) => {
        console.log(err, "getIndexController");
      });
  },

  getcartController: (req, res, next) => {
    req.user
      .populate("cart.items.productId")
      .then((user) => {
        const products = user.cart.items;
        res.render("shop/cart", {
          path: "cart",
          pageTitle: "Your Cart",
          products: products,
          moment: moment
        });
      })
      .catch((err) => console.log(err, "getcartController"));
  },

  postCartController: (req, res, next) => {
    const prodId = req.body.productId;
    console.log(prodId);
    Product.findById(prodId)
      .then((product) => {
        isCartEmpty = false;
        console.log("🚀 ~ file: shop.controller.js ~ line 68 ~ .then ~ isCartEmpty", isCartEmpty)
        return req.user.addToCart(product);
      })
      .then((result) => {
        console.log(result);
        res.redirect("/cart");
      })
      .catch((err) => {
        console.log(err, "postCartController");
      });
  },

  postCartDeleteProductController: (req, res, next) => {
    const prodId = req.body.id;
    req.user
      .deleteItemFromCart(prodId)
      .then((result) => {
        res.redirect("/cart");
      })
      .catch((err) => console.log(err, "postCartDeleteProductController"));
  },

  postOrderController: (req, res, next) => {
    req.user
      .populate("cart.items.productId")
      .then((user) => {
        const products = user.cart.items.map((i) => {
          return { quantity: i.quantity, product: {...i.productId._doc }};
        });
        const order = new Order({
          user: {
            name: req.user.username,
          },
          userId: req.user._id,
          products: products,
        });
        return order.save();
      })
      .then((result) => {
        isCartEmpty = true;
        return req.user.clearCart();
      })
      .then(() => {
        res.redirect("/orders");
      })
      .catch((err) => console.log(err, 'postOrderController'));
  },

  getOrdersController: (req, res, next) => {
    Order.find({ "user.userId": req.user._id })
      .then((orders) => {
        res.render("shop/orders", {
          path: "orders",
          pageTitle: "Your Orders",
          orders: orders,
        });
      })
      .catch((err) => console.log(err, "getOrdersController"));
  },

  getcheckoutController: (req, res) => {
    res.render("shop/checkout", {
      pageTitle: "Check Out",
      path: "/checkout",
    });
  },
};
