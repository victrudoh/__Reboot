const Order = require("../Models/order.model");
const User = require("../Models/user.model");

module.exports = {
  getOrderController: async (req, res, next) => {
    let message = req.flash("error");
    //so the error message box will not always be active
    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }

    const query = {};
    for (let value of Object.keys(req.body)) {
      query[value] = req.body[value];
    }

    const orders = await Order.find(query).populate("cashier", "username");

    res.render("cashier/cashier_orders", {
      pageTitle: "Orders",
      path: "orders",
      orders: orders,
      role: req.user?.role,
      errorMessage: message,
    });
  },

  postSearchOrdersController: async (req, res, next) => {
    let message = req.flash("error");
    //so the error message box will not always be active
    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }
    const orderId = req.body.orderId;
    console.log("postSort orderId", orderId);
    const orders = await Order.findById(orderId).populate("cashier", "username");
    if (!orders) {
      req.flash("error", "Sorry, we can't find your order");
      return res.redirect("/cashier/orders");
    }

    res.render("cashier/cashier_searched_order", {
      pageTitle: "Orders",
      path: "orders",
      order: orders,
      role: req.user?.role,
      errorMessage: message,
    });
  },

  getViewOrderController: async (req, res, next) => {
    const orderId = req.params.id;
    const orders = await Order.findById(orderId).populate("cashier", "username");
    res.render("cashier/cashier_view_order", {
      pageTitle: "View Order",
      path: "orders",
      role: req.user?.role,
      order: orders,
    });
  },

  togglePaidController: async (req, res, next) => {
    const orderId = req.body.orderId;
    console.log("this is a comment on paid toggle", orderId);
    const order = await Order.findById(orderId);
    const cashier = await User.findOne({
      role: "cashier",
      username: req.session.user.username,
    });
    const orderState = order.paid;
    order.paid = !orderState;
    order.cashier = cashier._id;

    await order.save();
    res.redirect("/cashier/orders");
  },
};
