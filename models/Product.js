const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: { // URL to the product image
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        default: 0
    },
    countInStock: { // Quantity available
        type: Number,
        required: true,
        default: 0
    },
    rating: { // Average rating (could be calculated or set by admin)
        type: Number,
        default: 0
    },
    numReviews: { // Number of reviews (could be calculated)
        type: Number,
        default: 0
    },
    user: { // Who added the product (useful for admin tracking)
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // Reference to the User model
    }
}, {
    timestamps: true
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;