const { checkUser, superAuth, authenticate } = require('../middleware/authorization');
const { userSignUp, userLogin, getAll, updateAdmin, getOne, updateUser, deleteUser, signOut } = require('../controllers/userController');

const router = require('express').Router();

router.route('/api').get((req, res) => {
    res.json('WELCOME TO MY AUTHENTICATION API HOMEPAGE')
})

router.route('/signup').post(userSignUp)

router.route('/login').post(userLogin)

router.route('/logout/:id').post(authenticate, signOut)

router.route('/getall')
.get(getAll)
// in real world, you are not to allow (get all) without being an admin

router.route('/:adminId/getall')
.get(checkUser, getAll)

router.route('/:adminId/getone/:userId')
.get(checkUser, getOne)

router.route('/:adminId/updateadmin/:userId')
.patch(superAuth,updateAdmin)

router.route('/:adminId/updateuser/:userId')
.patch(checkUser,updateUser)

router.route('/updateuser/:userId')
.patch(updateUser)

router.route('/:adminId/deleteuser/:userId')
.delete(checkUser,deleteUser)



module.exports = router