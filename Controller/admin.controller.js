const Product = require("../Models/product.model");
const Order = require("../Models/order.model");

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
    const description = req.body.description;
    const product = new Product({
      title: title,
      media: media,
      price: price,
      category: category,
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
          path: "edit_product",
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
    const updatedDescription = req.body.description;
    Product.findById(prodId)
      .then((product) => {
        (product.title = updatedTitle),
          (product.media = updatedMedia),
          (product.price = updatedPrice),
          (product.category = updatedCategory),
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
          path: "adminProduct_list",
          role: req.user.role,
        });
      })
      .catch((err) => {
        console.log(err, "getProductController");
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
    const query = {}
    for(let value of Object.keys(req.body)){
      query[value] = req.body[value]
    }
    Order.find(query)
      .then((orders) => {
        res.render("admin/orders", {
          path: "allOrders",
          pageTitle: "All Orders",
          orders: orders,
          role: req.user.role,
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
    res.redirect("/admin/products");
  },

  getDashboardController: async (req, res) => {
    res.render("admin/dashboard", {
      pageTitle: "Dashboard",
      path: "dashboard",
      role: req.user.role,
    });
  },
};
