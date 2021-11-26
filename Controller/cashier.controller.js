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

    const active = req.session.user._id;
    const cashier = await User.findOne({ role: "cashier", _id: active });

    const orderId = req.body.orderId;
    const orders = await Order.findById(orderId).populate(
      "cashier",
      "username"
    );
    if (!orders) {
      req.flash("error", "Sorry, we can't find your order");
      return res.redirect("/cashier/findOrders");
    }
    if (orders.cashier.username !== cashier.username) {
      req.flash("error", "Sorry, you can't access this order, please contact admin");
      console.log('Cashier: ', orders.cashier.username);
      console.log('Cashier: ', cashier.username);
      return res.redirect("/cashier/findOrders");
    }


    if (orders.cashier?.username === cashier.username || orders.cashier === null) {
      console.log("okay this works in postSearchOrdersController >>>>>>>>>");
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
    const orders = await Order.findById(orderId).populate(
      "cashier",
      "username"
    );
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
    res.redirect("/cashier/confirmedOrders");
  },

  getDashboardController: async (req, res, next) => {
    const active = req.session.user._id;
    const cashier = await User.findOne({ role: "cashier", _id: active });

    //pending orders
    const pending = await Order.find({ cashier: null })
    const pendingOrders = pending.length;

    //confirmed orders
    const confirmed = await Order.find({ paid: 'true', cashier: active })
    const confirmedOrders = confirmed.length;

    res.render("cashier/dashboard", {
      pageTitle: "Dashboard",
      path: "dashboard",
      role: req.user.role,
      cashier: cashier,
      pendingOrders: pendingOrders,
      confirmedOrders: confirmedOrders,
    });
  },

  getPendingOrdersController: async (req, res, next) => {
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

    const pending = await Order.find({ paid: false });

    res.render("cashier/pendingOrders", {
      pageTitle: "Pending Orders",
      path: "dashboard",
      orders: pending,
      role: req.user?.role,
      errorMessage: message,
    });
  },

  postPendingOrdersController: async (req, res, next) => {
    const orderId = req.body.orderId;
    const searchedId = await Order.findById({ _id: orderId })

    res.render("cashier/searchedOrder", {
      pageTitle: "Pending Orders",
      path: "dashboard",
      orders: pending,
      role: req.user?.role,
    });
    
  },

  getConfirmedOrdersController: async (req, res, next) => {
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

    const active = req.session.user._id;
    const cashier = await User.findOne({ role: "cashier", _id: active });

    const confirmed = await Order.find({ paid: "true", cashier: active });

    res.render("cashier/confirmedOrders", {
      pageTitle: "Confirmed Orders",
      path: "dashboard",
      orders: confirmed,
      role: req.user?.role,
      errorMessage: message,
      cashier: cashier,
    });
  },

  getFindOrderController: async (req, res, next) => {
    let message = req.flash("error");
    //so the error message box will not always be active
    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }
    res.render("cashier/findOrder", {
      pageTitle: "Find Orders",
      path: "dashboard",
      role: req.user?.role,
      errorMessage: message,
    });
  }
};
