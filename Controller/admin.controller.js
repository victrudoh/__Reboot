const Product = require("../Models/product.model");
const Order = require("../Models/order.model");
const User = require("../Models/user.model");
const escapeStringRegexp = require("escape-string-regexp");



module.exports = {
  // loginController: async (req, res) => {
  //   res.render("shop/product_list", {
  //     pageTitle: "Product List",
  //     path: "product_list",
  //     role: req.user.role,
  //   });
  // },

  getAddProductController: async (req, res, next) => {
    res.render("admin/edit_product", {
      pageTitle: "Add Product",
      path: "add_product",
      editing: false,
      role: req.user.role,
    });
  },

  postAddProductController: (req, res, next) => {
    const title = req.body.title;
    const media = req.body.media;
    const price = req.body.price;
    const category = req.body.category;
    const inStock = req.body.inStock;
    const description = req.body.description;
    const product = new Product({
      title: title,
      media: media,
      price: price,
      category: category,
      inStock: inStock,
      description: description,
      userId: req.user,
      role: req.user.role,
    });
    product
      .save()
      .then((result) => {
        console.log("Created New Product");
        res.redirect("/admin/products");
      })
      .catch((err) => {
        console.log(err, "postAddProductController");
      });
  },

  getEditProductController: async (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
      return res.redirect("/");
    }
    const prodId = req.params.productId;
    Product.findById(prodId)
      .then((product) => {
        if (!product) {
          return res.redirect("/");
        }
        res.render("admin/edit_product", {
          pageTitle: "Edit Product",
          path: "dashboard",
          editing: editMode,
          product: product,
          role: req.user.role,
        });
      })
      .catch((err) => {
        console.log(err, "getEditProductController");
      });
  },

  postEditProductController: async (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedMedia = req.body.media;
    const updatedPrice = req.body.price;
    const updatedCategory = req.body.category;
    const updatedInStock = req.body.inStock;
    const updatedDescription = req.body.description;
    Product.findById(prodId)
      .then((product) => {
        (product.title = updatedTitle),
          (product.media = updatedMedia),
          (product.price = updatedPrice),
          (product.category = updatedCategory),
          (product.inStock = updatedInStock),
          (product.description = updatedDescription);

        product.save();
      })
      .then((result) => {
        console.log("Updated Product");
        res.redirect("/admin/products");
      })
      .catch((err) => {
        console.log(err, "postEditProductController");
      });
  },

  getProductController: async (req, res, next) => {
    Product.find()
      // .select('title price -_id')
      //   .populate("userId", 'username')
      .then((products) => {
        res.render("admin/adminProduct_list", {
          prods: products,
          pageTitle: "Admin Products",
          path: "dashboard",
          role: req.user.role,
          disable: false,
        });
      })
      .catch((err) => {
        console.log(err, "getProductController");
      });
  },

  postSortProductsController: (req, res, next) => {
    Product.find({ category: req.body.category })
      .then((products) => {
        res.render("admin/adminProduct_list", {
          prods: products,
          pageTitle: "Products",
          path: "dashboard",
          role: req.user?.role,
        });
      })
      .catch((err) => {
        console.log(err, "postSortProductsController");
      });
  },

  postDeleteProductController: (req, res, next) => {
    const prodId = req.body.productId;
    Product.findByIdAndRemove(prodId)
      .then(() => {
        console.log("Deleted Product");
        res.redirect("/admin/products");
      })
      .catch((err) => {
        console.log(err, "postDeleteProductController");
      });
  },

  getOrdersController: async (req, res, next) => {
    const query = {};
    console.log("req.body.date: ", req.body.date);
    console.log("getOrdersController: ~ query", query);
    for (let value of Object.keys(req.body)) {
      if (value != "_csrf") {
        if (value.match(/date/g)) {
          query["createdAt"] = {
            $gte: new Date(req.body[value]).setHours(00, 00, 00),
            $lte: new Date(req.body[value]).setHours(23, 59, 59),
          };
          // } else if (value === "paymentOption") {
          //   query[value] = req.body[value];
        } else {
          query[value] = req.body[value];
        }
      }
    }

    console.log("getOrdersController: ~ query", query);
    Order.find(query)
      .populate("cashier", "username")
      .then((orders) => {
        res.render("admin/orders", {
          path: "dashboard",
          pageTitle: "All Orders",
          orders: orders,
          role: req.user?.role,
        });
      })
      .catch((err) => console.log(err, "getOrdersController"));
  },

  getOrdersPaymentController: async (req, res, next) => {
    const query = {};
    for (let value of Object.keys(req.body)) {
      query[value] = req.body[value];
    }
    Order.find(query)
      .populate("cashier", "username")
      .then((orders) => {
        res.render("admin/orderspayment", {
          path: "dashboard",
          pageTitle: "All Orders",
          orders: orders,
          role: req.user?.role,
        });
      })
      .catch((err) => console.log(err, "getOrdersController"));
  },

  toggleDisableProductController: async (req, res, next) => {
    const prodId = req.body.productId;
    console.log("this is a comment on product toggle", prodId);
    const product = await Product.findById(prodId);
    const productState = product.isDisabled;
    product.isDisabled = !productState;

    await product.save();
    res.redirect("/admin/dashboard");
  },

  getDashboardController: async (req, res) => {
    const active = req.session.user._id;
    const admin = await User.findOne({ role: "admin", _id: active });

    const user = await User.find({ role: "user" });
    const users = user.length;

    const order = await Order.find();
    const orders = order.length;

    const prod = await Product.find();
    const prods = prod.length;

    const outProd = await Product.find({ isDisabled: true });
    const outProds = outProd.length;

    res.render("admin/dashboard", {
      pageTitle: "Dashboard",
      path: "dashboard",
      role: req.user.role,
      admin: admin,
      users: users,
      orders: orders,
      prods: prods,
      outProds: outProds,
    });
  },

  getUsersController: async (req, res, next) => {
    const users = await User.find({ role: "user" });

    res.render("admin/users", {
      pageTitle: "All Users",
      path: "dashboard",
      editing: false,
      role: req.user.role,
      users,
    });
  },

  postEditUserController: async (req, res, next) => {
    const userId = req.params.id;
    const user = await User.findOne({ _id: userId });
    res.render("admin/edit_user", {
      pageTitle: "Edit User",
      path: "dashboard",
      editing: false,
      role: req.user.role,
      user,
    });
  },

  postUpdateUserController: async (req, res, next) => {
    const userId = req.body.userId;
    const updatedUsername = req.body.username;
    const updatedEmail = req.body.email;
    const updatedPassword = req.body.password;
    const updatedPhysicalAddress = req.body.physicalAddress;
    const updatedRole = req.body.role;

    const user = await User.findById(userId);
    
    user.username = updatedUsername;
    user.email = updatedEmail;
    user.password = updatedPassword;
    user.physicalAddress = updatedPhysicalAddress;
    user.role = updatedRole;

    await user.save();
    res.redirect("/admin/users");
  },

  getDisabledProductsController: async (req, res, next) => {
    const prods = await Product.find({ isDisabled: true });
    const disabledMode = req.query.disable;
    console.log("getDisabledProductsController: ~ disabledMode", disabledMode)

    res.render("admin/adminProduct_list", {
      pageTitle: "Disabled Products",
      path: "dashboard",
      role: req.user.role,
      disable: disabledMode,
      prods,
    });
  },
};
