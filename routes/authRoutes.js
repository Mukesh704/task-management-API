const express = require("express");
const router = express.Router();

const { registerController, loginController, profileController, logoutController } = require('../controllers/authController');

router.post('/register', registerController);
router.post('/login', loginController);
router.get('/me', profileController);
router.post('/logout', logoutController);

module.exports = router;