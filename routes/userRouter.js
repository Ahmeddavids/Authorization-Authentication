const { checkUser, superAuth, authenticate } = require('../middleware/authorization');
const { userSignUp, userLogin,  signOut, verifyEmail, resendVerificationEmail, forgotPassword, changePassword, resetPassword } = require('../controllers/userController');
const {getAll, updateAdmin, getOne, updateUser, deleteUser,} = require('../controllers/userCRUD')

const router = require('express').Router();

router.route('/api').get((req, res) => {
    res.json('WELCOME TO MY AUTHENTICATION API HOMEPAGE')
})

router.route('/sign-up').post(userSignUp)

router.route('/log-in').post(userLogin)

router.route('/log-out/:userId').post(authenticate, signOut)

router.route( "/users/verify-email/:token" )
    .get( verifyEmail );

router.route( "/users/resend-verification-email" )
    .post( resendVerificationEmail );
    
router.route('/users/change-password/:token')
.post(changePassword);

router.route('/users/reset-password/:token')
.post(resetPassword);

router.route('/users/forgot-password')
.post(forgotPassword);

router.route('/delete-self/:userId').delete(authenticate, deleteUser)

router.route('/get-all')
.get(getAll)
// in real world, you are not to allow (get all) without being an admin

router.route('/:adminId/get-all')
.get(checkUser, getAll)

router.route('/:adminId/get-one/:userId')
.get(checkUser, getOne)

router.route('/:adminId/update-admin/:userId')
.patch(superAuth,updateAdmin)

router.route('/:adminId/update-user/:userId')
.patch(checkUser,updateUser)

router.route('/update-user/:userId')
.patch(updateUser)

router.route('/:adminId/delete-user/:userId')
.delete(checkUser,deleteUser)



module.exports = router