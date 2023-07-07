const { checkUser } = require('../controllers/authorization');
const { newUser, userLogin, getAll, updateAdmin, getOne, updateUser, deleteUser } = require('../controllers/userController');

const router = require('express').Router();

router.route('/api').get((req, res) => {
    res.json('WELCOME TO MY AUTHENTICATION API HOMEPAGE')
})

router.route('/signup').post(newUser)

router.route('/login').post(userLogin)

// in real world you are not to allow get all without being an admin
router.route('/getall').get(getAll)

router.route('/:adminId/getall').get(checkUser, getAll)

router.route('/:adminId/getone/:userId').get(checkUser, getOne)

router.route('/:adminId/updateadmin/:userId').patch(checkUser,updateAdmin)

router.route('/:adminId/updateuser/:userId').patch(checkUser,updateUser)

router.route('/:adminId/deleteuser/:userId').delete(checkUser,deleteUser)



module.exports = router