const Product = require("../Models/product.model");
const User = require("../Models/user.model");

module.exports = {
  loginController: (req, res) => {
    res.render("shop/product_list", {
      pageTitle: "Product List",
      path: "product_list",
    });
  },

  getAddProductController: (req, res, next) => {
    res.render("admin/edit_product", {
      pageTitle: "Add Product",
      path: "add_product",
      editing: false,
    });
  },

  postAddProductController: (req, res, next) => {
    const title = req.body.title;
    const media = req.body.media;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product({
      title: title,
      media: media,
      price: price,
      description: description,
      userId: req.user,
    });
    product
      .save()
      .then((result) => {
        console.log("Created New Product");
        res.redirect("/products");
      })
      .catch((err) => {
        console.log(err, "postAddProductController");
      });
  },

  getEditProductController: (req, res, next) => {
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
    const updatedDescription = req.body.description;
    Product.findById(prodId)
      .then((product) => {
        (product.title = updatedTitle),
          (product.media = updatedMedia),
          (product.price = updatedPrice),
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

  getProductController: (req, res, next) => {
    Product.find()
    // .select('title price -_id')
    //   .populate("userId", 'username')
      .then((products) => {
        res.render("admin/adminProduct_list", {
          prods: products,
          pageTitle: "Admin Products",
          path: "adminProduct_list",
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

  toggleDisableProductController: async (req, res, next) => {
    const prodId = req.body.productId;
    console.log("this is a comment on product toggle", prodId);
    const product = await Product.findById(prodId);
    const productState = product.isDisabled;
    product.isDisabled = !productState;

    await product.save();
    res.redirect("/admin/products");
  },
};
