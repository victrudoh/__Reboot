const { products } = require('./admin.controller');
const adminData = require('./admin.controller');

module.exports = {
    shopController: (req, res)=> {
        console.log('Shop js =>', adminData.products);
        res.render('shop', {
            prods: products,
            pageTitle: 'Shop',
            path: '/',
            hasProducts: products.length > 0,
            activeShop: true,
            productCSS: true
        });
    },
}