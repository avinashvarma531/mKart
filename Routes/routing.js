const router = require("express").Router();
const controller = require("../Controller/controller");

router.get("/login", controller.authoriseUser);
router.post("/signup", controller.createNewUser);
router.get("/tablets", controller.getTablets);
router.get("/mobiles", controller.getMobiles);
router.get("/carts", controller.getCarts);
router.get("/carts/:username", controller.getCartsByUser);
router.post("/carts", controller.createCart);
router.put("/carts/:username", controller.addToCart);
router.post("/orders/:username", controller.createOrder);
router.delete("/products/:productName", controller.deleteProduct);

module.exports = router;