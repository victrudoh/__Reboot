module.exports = {
  errorController: (req, res, next) => {
    res.status(404).render("404", {path: ''});
  },
};
