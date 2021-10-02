const { log } = require("console");
const {
    Users,
    Products,
    Carts,
    Orders
} = require("../Models/schema");
const { generateId } = require("../Utilities/idGenerator");

exports.authoriseUser = async (req, res) => {
    const { username, password } = req.query;
    log(username, password);

    try {
        const data = await Users.findOne({ username, password });
        log(data);
        
        if (data) {
            res.status(200).json({
                status: "success",
                message: `Login successfull! Welcome ${username}`
            })
        }
        else {
            res.status(400).json({
                status: "fail",
                message: "Invalid username or password"
            })
        }
    }
    catch (err) {
        log(err);
        res.status(400).json({
            "status": "fail",
            "message": err
        })
    }
}

exports.createNewUser = async (req, res) => {
    try {
        const newUser = {
            username: req.body.username,
            password: req.body.password,
            phoneNumber: req.body.phoneNumber,
            email: req.body.email,
        };

        const data = await Users.create(newUser);
        log(data);
        res.status(201).json({
            status: "success",
            data
        })
    }
    catch (err) {
        log(err);
        res.status(400).json({
            status: "fail",
            message: err
        })
    }
}

exports.getTablets = async (req, res) => {
    try {
        const data = await Products.find({
            productCode: /^tab/i
        }, {
            _id: 0,
            __v: 0
        });
        res.status(200).json({
            status: "success",
            data
        })
    }
    catch (err) {
        log(err);
        res.status(400).json({
            status: "fail",
            message: err
        })
    }
}

exports.getMobiles = async (req, res) => {
    try {
        const data = await Products.find({
            productCode: /^mob/i
        }, {
            _id: 0,
            __v: 0
        });

        res.status(200).json({
            status: "success",
            data
        });
    }
    catch (err) {
        res.status(400).json({
            status: "fail",
            message: err
        });
    }
}

exports.getCarts = async (req, res) => {
    try {
        const data = await Carts.find({}, {
            _id: 0,
            __v: 0
        });

        res.status(200).json({
            status: "success",
            data
        });
    }
    catch (err) {
        res.status(400).json({
            status: "fail",
            message: err
        });
    }
}

exports.getCartsByUser = async (req, res) => {
    try {
        const { username } = req.params;
        const data = await Carts.findOne({ username }, { _id: 0, __v: 0 });
        res.status(200).json({
            status: "success",
            data
        });
    }
    catch (err) {
        res.status(400).json({
            status: "fail",
            message: err
        });
    }
}

exports.createCart = async (req, res) => {
    try {
        const { username, productsInCart } = req.body;
        const checkCart = await Carts.findOne({ username }, {
            _id: 0,
            __v: 0
        });
        const userExists = await Users.findOne({ username });

        if (checkCart) {
            res.status(400).json({
                status: "fail",
                message: "User's cart is already available, append to the same cart"
            })
        }
        else if (!userExists) {
            res.status(400).json({
                status: "fail",
                message: "User doesn't exists"
            })
        }
        else{
            const count = await Carts.count();
            const cart = {
                cartId: generateId(count),
                username,
                productsInCart
            };
            const cartData = await Carts.create(cart);
            res.status(201).json({
                status: "success",
                data: cartData
            })
        }
    }
    catch (err) {
        res.status(400).json({
            status: "fail",
            message: err
        });
    }
}

exports.addToCart = async (req, res) => {
    try {
        const { username } = req.params;
        const { productsInCart } = req.body;
        const data = await Carts.findOneAndUpdate({ username }, {
            $push: {
                productsInCart: {$each: productsInCart}
            }
        },
            { new: true });
        
        if (data) {
            res.status(200).json({
                status: "success",
                message: `CartID: ${data.cartId} updated`
            });   
        }
        else {
            res.status(400).json({
                status: "fail",
                message: "User's cart is not available"
            });    
        }
    }
    catch (err) {
        res.status(400).json({
            status: "fail",
            message: err
        });
    }
}

exports.createOrder = async (req, res) => {
    try {
        const { username } = req.params;
        const count = await Orders.count();
        const cart = await Carts.findOneAndUpdate({ username }, { $set: {statusOfCart: "Closed"}}, { new: true });
        
        if (cart) {
            const order = {
                cartId: cart.cartId,
                orderId: generateId(count),
                amount: req.body.orderAmount
            }
            await Orders.create(order);
            res.status(201).json({
                status: "success",
                message: `New order placed with the ID: ${order.orderId}`
            })
        }
        else {
            res.status(400).json({
                status: "fail",
                message: "User's cart is not available"
            })
        }
    }
    catch (err) {
        res.status(400).json({
            status: "fail",
            message: err
        })
    }
}

exports.deleteProduct = async (req, res) => {
    try {
        const { productName } = req.params;

        const dbRes = await Products.deleteOne({ productName });
        if (dbRes.deletedCount === 0) {
            res.status(400).json({
                status: "fail",
                message: "Product not available"
            })
        }
        else {
            res.status(200).json({
                status: "success",
                message: "Product removed successfully"
            })
        }
        
    }
    catch (err) {
        res.status(400).json({
            status: "fail",
            message: err
        })
    }
}