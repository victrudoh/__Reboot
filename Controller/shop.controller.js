const Product = require("../Models/product.model");
const Order = require("../Models/order.model");
const moment = require("moment");

module.exports = {
  getProductController: async (req, res, next) => {
    Product.find({ isDisabled: false })
      .then((products) => {
        res.render("shop/product_list", {
          prods: products,
          pageTitle: "Products",
          path: "product_list",
          role: req.user?.role,
        });
      })
      .catch((err) => {
        console.log(err, "getProductController");
      });
  },

  getProductByIdController: async (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId)
      .then((product) => {
        res.render("shop/product_detail", {
          product: product,
          pageTitle: product.title,
          path: "product_list", //so the products header will be active when we view the product
          role: req.user.role,
        });
      })
      .catch((err) => {
        console.log(err, "getProductByIdController");
      });
  },

  getIndexController: async (req, res, next) => {
    Product.find()
      .then((products) => {
        res.render("shop/index", {
          prods: products,
          pageTitle: "Shop",
          path: "index",
          csrfToken: req.csrfToken(),
          role: req.user?.role,
        });
      })
      .catch((err) => {
        console.log(err, "getIndexController");
      });
  },

  getcartController: async (req, res, next) => {
    req.user
      .populate("cart.items.productId")
      .then((user) => {
        const products = user.cart.items;
        res.render("shop/cart", {
          path: "cart",
          pageTitle: "Your Cart",
          products: products,
          moment: moment,
          role: req.user.role,
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
        console.log(
          "🚀 ~ file: shop.controller.js ~ line 68 ~ .then ~ isCartEmpty",
          isCartEmpty
        );
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

  postOrderController: async (req, res, next) => {
    // if (req.user.isCartEmpty) {
    //   return res.redirect('/cart');
    // }
    const user = await req.user.populate("cart.items.productId");
    const products = user.cart.items.map((i) => {
      return { quantity: i.quantity, product: { ...i.productId._doc } };
    });
    const newOrder = new Order({
      user: {
        name: req.user.username,
        email: req.user.email,
      },
      userId: req.user._id,
      products: products,
    });

    const order = await newOrder.save();
    isCartEmpty = true;
    await req.user.clearCart();
    res.redirect(`/checkout/${order.id}`);
  },

  getOrdersController: async (req, res, next) => {
    const query = { userId: req.user.id };
    for (let value of Object.keys(req.body)) {
      query[value] = req.body[value];
    }
    Order.find(query)
      .then((orders) => {
        res.render("shop/orders", {
          path: "orders",
          pageTitle: "Your Orders",
          orders: orders,
          role: req.user.role,
        });
      })
      .catch((err) => console.log(err, "getOrdersController"));
  },

  getInvoiceController: async (req, res) => {
    //i sha used stuff from the order controller because that's where i'm getting my data
    Order.find({ _id: req.params.id })
      .then((orders) => {
        res.render("shop/invoice", {
          path: "invoice",
          pageTitle: "Invoice",
          orders: orders,
          role: req.user.role,
          user: req.user,
        });
      })
      .catch((err) => console.log(err, "getInvoiceController"));
  },

  getcheckoutController: async (req, res) => {
    Order.find({ _id: req.params.id })
      .then((orders) => {
        res.render("shop/checkout", {
          pageTitle: "Check Out",
          path: "/checkout",
          role: req.user.role,
          orders: orders,
          role: req.user.role,
          user: req.user,
        });
      })
      .catch((err) => console.log(err, "getInvoiceController"));
  },

  postCheckoutController: async (req, res, next) => {
    const paymentOption = req.body.category;
    let found = await Order.findOne({ _id: req.params.id });
    found.paymentStatus = paymentOption;
    await found.save();
    res.redirect("/orders");
  },
};
