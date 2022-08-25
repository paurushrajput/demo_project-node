const USER = require('../models/userModel');
const bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken');
const { body, validationResult,errorFormatter } = require('express-validator');
const response = require("../utils/httpResponseMessage");
const statusCode = require("../utils/httpResponseCode");

module.exports = {

    userSignup: async (req, res) => {
        try {
            console.log("Request for user signup is=============>", req.body)
            await body('firstName').not().isEmpty().run(req);
            await body('lastName').not().isEmpty().run(req);
            await body('phone').not().isEmpty().run(req);
            await body('email').not().isEmpty().run(req);

            const errors = validationResult(req).formatWith(errorFormatter);;
            if (!errors.isEmpty()) {
                return response.responseHandlerWithData(res, statusCode.DATAMISSING, "Please check your request", errors.array());
            }
            let checkEmail = await USER.findOne({ email: req.body.email })
            if (!checkEmail) {
                const salt = bcrypt.genSaltSync(10)
                const hash = await bcrypt.hash(req.body.password, salt);
                let signupObj = new USER({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    fullName: req.body.firstName.concat(" ", req.body.lastName),
                    email: req.body.email.toLowerCase(),
                    phoneNumber: req.body.phone,
                    password:hash,
                    plainPassword:req.body.password
                })
                await signupObj.save()
                return response.responseHandlerWithData(res, statusCode.SUCCESS, "User Signup Sucessfully");
            }
           
            return response.responseHandlerWithMessage(res, statusCode.RESULTNOTFOUND, "Email already exist");
        } catch (error) {
            console.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, statusCode.ERROR, "Internal server error");
        }
    },
    //=============================================== Admin Login =========================================//

    userLogin: async (req, res) => {
        try {
            body('email').not().isEmpty().run(req);
            body('password').not().isEmpty().run(req);
            console.log("Request for User is=============>", req.body);

            const errors = validationResult(req).formatWith(errorFormatter);
            if (!errors.isEmpty()) {
                return response.responseHandlerWithData(res, statusCode.DATAMISSING, "Please check your request", errors.array());
            }
            let checkUser = await USER.findOne({
                email: req.body.email
            })
            if (!checkUser) {
                return response.responseHandlerWithMessage(res, statusCode.RESULTNOTFOUND, "Invalid Email");
            }
            console.log('===============checkUser====',checkUser)
            let passVerify = await bcrypt.compare(req.body.password, checkUser.password);
            if (!passVerify) {
                return response.responseHandlerWithMessage(res, statusCode.RESULTNOTFOUND, "Invalid Credentails");
            } else {
        
                var jwtToken = jwt.sign({
                    "_id": checkUser._id
                }, `sUpER@SecReT`);
                response.log("Jwt Token is=========>", jwtToken)
                let result = await USER.findOneAndUpdate({
                    _id: checkUser._id
                }, {
                    $set: {
                        jwtToken: jwtToken,
                    }
                }, {
                    new: true
                });
                return response.responseHandlerWithData(res, statusCode.SUCCESS, "You have successfully logged In ", result);
            }
        } catch (error) {
            return response.responseHandlerWithData(res, statusCode.ERROR, "Internal server error", error);
        }
    },

    //================================================User Details========================================//

    userDetails: async (req, res) => {
        try {
            let userId = req.query.tokenUser._id
            let result = await USER.findOne({ "_id": userId })
            console.log('=======userDetails==========',result)
            return response.responseHandlerWithData(res, statusCode.SUCCESS, "User Data fetched successfully", result);
        } catch (error) {
            return response.responseHandlerWithData(res, statusCode.ERROR, "Internal server error", error);
        }
    },

    //================================================update profile=======================================//

    updateUser: async (req, res) => {
        try {
            console.log("Request For User Update Profile is=============>", req.body)
            let userId = req.query.tokenUser._id
            let userUpdatableData = {}
            if (req.body.firstName) {
                userUpdatableData.firstName = req.body.firstName
            }
            if (req.body.lastName) {
                userUpdatableData.lastName = req.body.lastName
            }
            if (req.body.phone) {
                userUpdatableData.phoneNumber = req.body.phone
            }
            console.log("===========userUpdatableData=====",userUpdatableData)
            let result = await USER.findOneAndUpdate({ _id: userId }, { $set: userUpdatableData }, { new: true, lean: true })

            return response.responseHandlerWithData(res, statusCode.SUCCESS, "Profile has been updated successfully", result);
        } catch (error) {
            return response.responseHandlerWithData(res, statusCode.ERROR, "Internal server error", error);
        }
    },

    //================================================Admin Logout=========================================//

    userLogout: async (req, res) => {
        try {
            console.log('====================req',req.query)
            let userId = req.query.tokenUser._id
            let checkUser = await USER.findOne({ "_id": userId })
            if (!checkUser) {
                return response.responseHandlerWithMessage(res, statusCode.INVALIDREQUEST, "Invalid Token");
            }
            let result = await USER.findOneAndUpdate({ "_id": userId }, { $set: { jwtToken: "" } }, { new: true })
            return response.responseHandlerWithMessage(res, statusCode.SUCCESS, "Logout successfully");
        } catch (error) {
            return response.responseHandlerWithData(res, statusCode.ERROR, "Internal server error", error);
        }
    },
}
