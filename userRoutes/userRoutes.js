const express = require('express');
const userController = require('../userControllers/userController')
const router = express.Router();
const authHandler = require('../authHandler/auth')

router.post('/userLogin', userController.userLogin);
router.post('/userSignup',userController.userSignup);


router.use(authHandler.authUser);
router.get('/userDetails', userController.userDetails);
router.post('/updateUser',userController.updateUser);
router.get('/userLogout', userController.userLogout);

module.exports = router;
