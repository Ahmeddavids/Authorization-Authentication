const userModel = require('../models/userModel')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// user sign up
const userSignUp = async (req, res) => {
    try {
        const { username, email, password } = req.body

        const usernameExists = await userModel.findOne({ username })
        
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


        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(password, salt)
        const data = {
            username,
            email,
            password: hashedPassword
        }
        const user = await userModel.create(data);
        const token = jwt.sign({
            id: user._id,
            password: user.password,
            isAdmin: user.isAdmin,
            isSuperAdmin: user.isSuperAdmin
        },
            process.env.SECRETEKEY, { expiresIn: "7 days" })

        user.token = token

        user.save()

        if (!user) {
            res.status(400).json({
                message: 'user not created'
            })
        } else {
            res.status(201).json({
                message: 'User created successfully',
                data: user
            })
        }
    } catch (error) {
        res.status(500).json({
            Error: error.message
        })
    }
}


// User login
const userLogin = async (req, res) => {
    try {
        const { username, password, email } = req.body
        const checkUser = await userModel.findOne({ $or: [{ username }, { email }] })
        if (!checkUser) {
            return res.status(404).json({
                Failed: 'Username/Email not found or incorrect'
            })
        }
        const checkPassword = bcrypt.compareSync(password, checkUser.password)
        if (!checkPassword) {
            return res.status(404).json({
                Message: 'Login Unsuccessful',
                Failed: 'Invalid password'
            })
        }
        const token = jwt.sign({
            id: checkUser._id,
            password: checkUser.password,
            isAdmin: checkUser.isAdmin,
            isSuperAdmin: checkUser.isSuperAdmin

        },
            process.env.SECRETEKEY, { expiresIn: "7 days" })

        checkUser.token = token

        checkUser.save()

        res.status(200).json({
            message: 'Login successful',
            data: 
                {id: checkUser._id, 
                username: checkUser.username, 
                token: checkUser.token}
            
        })

    } catch (error) {
        res.status(500).json({
            Error: error.message
        })
    }
}


// get all users
const getAll = async (req, res) => {
    try {
        const allUser = await userModel.find();

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

        const user = await userModel.findById(req.params.userId);

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



// to update to an admin
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


const signOut = async (req, res) => {
    try {
      const userId = req.user.id;
  
      // Update the user's token to null
      const user = await userModel.findByIdAndUpdate(userId, { token: null }, { new: true });
  
      if (!user) {
        return res.status(404).json({
          message: 'User not found',
        });
      }
      res.status(200).json({
        message: 'User logged out successfully',
      });
    } catch (error) {
      res.status(500).json({
        Error: error.message,
      });
    }
  };
  







module.exports = {
    userSignUp,
    userLogin,
    getAll,
    getOne,
    updateAdmin,
    updateUser,
    deleteUser,
    signOut
}