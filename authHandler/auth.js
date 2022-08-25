let jwt = require('jsonwebtoken');
const response = require("../utils/httpResponseMessage");
const statusCode = require("../utils/httpResponseCode");
const USER = require('../models/userModel')

module.exports = {
    authUser: async (req, res, next) => {
        try {
            response.log("User Token==========>", req.headers.authorization)
            if (!req.headers.authorization) {
                return response.responseHandlerWithMessage(res, statusCode.DATAMISSING, "Something went wrong");
            }
            jwt.verify(req.headers.authorization,  `sUpER@SecReT`, async (error, result) => {
                if (error) {
                    return response.responseHandlerWithMessage(res, statusCode.TOKENEXPIRE, "Invalid Token");
                }
                console.log({result})
                let checkUser = await USER.findOne({ _id: result._id ,jwtToken:req.headers.authorization})
                if (!checkUser) {
                    response.log("Invalid Token2")
                    return response.responseHandlerWithMessage(res, statusCode.TOKENEXPIRE, "Invalid Token");
                }
                req.query.tokenUser=checkUser
                next();
            })
        } catch (error) {
            
            return response.responseHandlerWithMessage(res, statusCode.ERROR, "Internal server error");
        }
    },
}