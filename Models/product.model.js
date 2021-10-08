const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  media: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  inStock: {
    type: Number,
    required: true
  },
  description: {
    type: String,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isDisabled: {
    type: Boolean,
    default: false
  }
},
{
  timestamps: true
});

// productSchema.methods.deleteFromStock = function (qty, id) {
//   if (this._id === id) {
//     this.inStock = this.inStock - qty;
//     return this.save();
//   } else {
//     return next();
//   }
// };

module.exports = mongoose.model('Product', productSchema);




















// const fs = require("fs");
// const path = require("path");

// const Cart = require('./cart.model');

// const p = path.join(
//   path.dirname(process.mainModule.filename),
//   "data",
//   "products.json"
// );

// const getProductsFromFile = (cb) => {
//   fs.readFile(p, (err, fileContent) => {
//     if (err) {
//       cb([]);
//     } else {
//       cb(JSON.parse(fileContent));
//     }
//   });
// };

// module.exports = class Product {
//   constructor(id, title, media, price, description) {
//     this.id = id;
//     this.title = title;
//     this.media = media;
//     this.price = price;
//     this.description = description;
//   }

//   save() {
//     getProductsFromFile(products => {
//       if (this.id) {
//         const existingProductIndex = products.findIndex(
//           prod => prod.id === this.id
//         );
//         const updatedProducts = [...products];
//         updatedProducts[existingProductIndex] = this;
//         fs.writeFile(p, JSON.stringify(updatedProducts), err => {
//           console.log(err);
//         });
//       } else {
//         this.id = Math.floor(Math.random() * 50000).toString();
//         products.push(this);
//         fs.writeFile(p, JSON.stringify(products), err => {
//           console.log(err);
//         });
//       }
//     });
//   }

//   static deleteById(id) {
//     getProductsFromFile((products) => {
//       const product = products.find(prod => prod.id === id);
//       const updatedProducts = products.filter(prod => prod.id !== id);
//       fs.writeFile(p, JSON.stringify(updatedProducts), err => {
//         console.log(err, 'deleteById');
//         if (!err) {
//           Cart.deleteProduct(id, product.price);
//         }
//       });
//     });
//   }


//   static fetchAll(cb) {
//     getProductsFromFile(cb);
//   }

//   static findById(id, cb) {
//     getProductsFromFile((products) => {
//       const product = products.find(p => p.id === id);
//       cb(product);
//     });
//   }
// };
