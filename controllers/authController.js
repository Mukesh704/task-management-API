const userModel = require('../models/user');

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

        if(newPerson) {
            res.status(200).json({
                success: true,
                message: 'User registered successfully!'
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

function loginController(req, res) {};

function profileController(req, res) {};

function logoutController(req, res) {};

module.exports = {
    registerController,
    loginController,
    profileController,
    logoutController
}