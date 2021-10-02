const mongoose = require("mongoose");
const { log } = require("console");

const DB = "mCart";

const DB_OPTIONS = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
};

mongoose.connect(`mongodb://localhost:27017/${DB}`).then(() => log(`DB connection successful for ${DB}`));

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phoneNumber: Number,
    email: String
});

const productSchema = new mongoose.Schema({
    productId: {
        type: Number,
        required: true,
        unique: true
    },
    productName: {
        type: String,
        required: true
    },
    productCode: {
        type: String,
        required: true
    },
    description: String,
    price: {
        type: Number,
        required: true
    },
    rating: Number,
    manufacturer: String,
    osType: String
});

const cartSchema = new mongoose.Schema({
    cartId: {
        type: Number,
        unique: true,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    productsInCart: Array,
    statusOfCart: {
        type: String,
        required: true,
        validate: (val) => (val === "Open" || val === "Closed"),
        default: "Open"
    }
});

const orderSchema = new mongoose.Schema({
    orderId: {
        type: Number,
        unique: true,
        required: true
    },
    cartId: {
        type: Number,
        unique: true,
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    }
});

exports.Users = mongoose.model("users", userSchema);
exports.Products = mongoose.model("products", productSchema);
exports.Carts = mongoose.model("carts", cartSchema);
exports.Orders = mongoose.model("orders", orderSchema);