const userModel = require('../models/userModel')



// get all users
const getAll = async (req, res) => {
    try {
        const allUser = await userModel.find().populate('records');

        if (allUser.length === null) {
            res.status(200).json({
                message: `There are no user in this database`,

            })
        } else {
            res.status(200).json({
                message: `These are the users in this database and they are ${allUser.length} in number`,
                data: allUser
            })
        }
    } catch (error) {
        res.status(500).json({
            Error: error.message
        })
    }
}


// get one user
const getOne = async (req, res) => {
    try {

        const user = await userModel.findById(req.params.userId).populate('records');

        if (!user) {
            res.status(404).json({
                message: `User with id: ${req.params.userId} not found`,

            })
        } else {
            res.status(200).json({
                message: 'Find user details below',
                data: user
            })
        }
    } catch (error) {
        res.status(500).json({
            Error: error.message
        })
    }
}



// Update a user to an admin
const updateAdmin = async (req, res) => {
    try {
        const userId = req.params.userId;

        const makeAdmin = await userModel.findByIdAndUpdate(userId, { isAdmin: true }, { new: true })

        if (!userId) {
            res.status(404).json({
                message: `User with id: ${userId} not found`
            })
        } else {
            res.status(200).json({
                message: 'User is now an Admin',
                data: makeAdmin
            })
        }
    } catch (error) {
        res.status(500).json({
            Error: error.message
        })
    }
}


// to update a user information as an admin
const updateUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const { username, email } = req.body;

        const user = await userModel.findById(userId)

        const usernameExists = await userModel.findOne({ username })
        
        if (!user) {
            return res.status(200).json({
                message: `User with id: ${userId} not found`,

            })
        }

        if (usernameExists) {
            return res.status(400).json({
                message: `Username already exist.`
            })
        }

        const emailExists = await userModel.findOne({ email })
        
        if (emailExists) {
            return res.status(400).json({
                message: `Email already exist.`
            })
        }


        const data = {
            username: username || user.username,
            email: email || user.email
        }
        const update = await userModel.findByIdAndUpdate(userId, data, { new: true })

        res.status(200).json({
            message: 'User updated successfully',
            data: update
        })

    } catch (error) {
        res.status(500).json({
            Error: error.message
        })
    }
}


// delete a user as an admin
const deleteUser = async (req, res) => {
    try {
        const userId = req.params.userId
        const user = await userModel.findById(userId);
        if (!user) {
            res.status(200).json({
                message: `User with id: ${userId} not found`,

            })
        } else if (user.isSuperAdmin) {
            res.status(400).json({
                failed: 'You are not Authorized to perform this action'
            })
        } else {
            const deletedUser = await userModel.findByIdAndDelete(userId)
            res.status(200).json({
                message: 'User deleted successfully',
                data: deletedUser
            })
        }
    } catch (error) {
        res.status(500).json({
            Error: error.message
        })
    }
}




module.exports = {
    getAll,
    getOne,
    updateAdmin,
    updateUser,
    deleteUser,
}