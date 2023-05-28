const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user_id: {
        type: String,
    },
    total: {
        type: Number,
    },
    date: {
        type: String,
    },
    status: {
        type: String,
    }
})

module.exports = new mongoose.model('order', orderSchema);