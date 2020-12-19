const mongoose = require("mongoose")

const FoodsSchema = mongoose.Schema({
  productName:{
    type: String,
    required: true,
    unique: true
  },
  productPrice:{
    type: Number,
    required: true
  },
  productAbout:{
    type: String
  }
  
}, { timestamps: true })

const Product = mongoose.model( "Product", FoodsSchema )

module.exports = Product