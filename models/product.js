const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String
    },
    brand: {
        type: String
    },
    price: {
        type: Number
    },
    img: {
        data: String,
        contentType: String,
    },
    quantyti: {
        type: Number,
    },
    descaption: {
        type: String
    },
})

module.exports = new mongoose.model('product', productSchema)