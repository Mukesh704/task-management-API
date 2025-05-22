const express = require("express");
const router = express.Router();

const { registerController, loginController, profileController, logoutController } = require('../controllers/authController');
const { jwtMiddleware } = require('../middlewares/jwtMiddleware')

router.post('/register', registerController);
router.post('/login', loginController);
router.get('/me', jwtMiddleware, profileController);
router.post('/logout', logoutController);

module.exports = router;