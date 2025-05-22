const userModel = require('../models/user');
const taskModel = require('../models/task');
const { generateToken } = require('../middlewares/jwtMiddleware');

async function registerController(req, res) {
    try {
        const {name, email, password} = req.body;

        if(!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'These fields are required'
            })
        }

        const user = await userModel.findOne({email: email});
        if(user) {
            return res.status(400).json({
                success: false,
                message: 'Account already exists, Please login'
            })
        }

        const newPerson = await userModel.create({
            name,
            email,
            password
        });

        const payload = {
            id: newPerson.id,
            email: newPerson.email
        }

        const token = generateToken(payload)

        if(newPerson) {
            res.status(200).json({
                success: true,
                response: newPerson,
                token: token
            })
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
};

async function loginController(req, res) {
    try {
        const {email, password} = req.body;
        const user = await userModel.findOne({email: email});

        if(!user || !user.comparePassword(password)) {
            return res.status(401).json({
                success: false,
                error: 'Invalid email or password'
            })
        }

        const payload = {
            id: user.id,
            email: user.email
        }

        const token = generateToken(payload);
        res.status(200).json({
            success: true,
            token: token
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        })
    }
};

async function profileController(req, res) {
    try {
        const userId = req.user.id;
        const user = await userModel.findById(userId).select('-password -__v -updatedAt');

        const taskCount = await taskModel.countDocuments({user: userId});

        res.status(200).json({
            success: true,
            user,
            taskCount
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        })
    }
};

function logoutController(req, res) {};

module.exports = {
    registerController,
    loginController,
    profileController,
    logoutController
}