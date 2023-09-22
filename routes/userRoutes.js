const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");

router.get("/", userController.getUser);
router.post("/login", userController.loginUser);
router.post("/register", userController.registerUser);
router.put("/", userController.updateUser);
router.delete("/", userController.deleteUser);

module.exports = router;