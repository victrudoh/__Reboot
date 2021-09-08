const products = [];

module.exports = {
  loginController: (req, res) => {
    res.render("shop");
  },

  addProductController: (req, res) => {
    res.render("add_product");
  },

  postProductController: (req, res, next) => {
    const {title, price, description} = req.body;
    products.push(req.body);
    res.redirect("/user");
  },

  products,
};
