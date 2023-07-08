const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');


// To authenticate a user token in the database
const authentication = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.params.adminId)
        const userToken = user.token

        if(!userToken) {
            return res.status(400).json({
                message: 'Token not found'
            })
        }

        await jwt.verify(userToken, process.env.SECRETEKEY, (err, payLoad) => {

            if (err) {
                return res.json(err.message)
            } else {
                req.user = payLoad
                next()
            }
        })

    } catch (error) {
        res.status(500).json({
            Error: error.message
        })
    }
}


// to check if user is an admin
// const checkUser = (req, res, next) => {
//     authentication(req, res, async () => {
//         const adminId = req.params.id
//         const user = await userModel.findById(adminId)
//         if(user.isAdmin || user.isSuperAdmin) {
//             next()
//         } else {
//             res.status(400).json({
//                 message: 'You are not authorized to perform this action'
//             })
//         }
//     })
// }


// Another method to check
const checkUser = (req, res, next) => {
    authentication(req, res, async () => {
        if(req.user.isAdmin || req.user.isSuperAdmin) {
            next()
        } else {
            res.status(400).json({
                message: 'You are not authorized to perform this action'
            })
        }
    })
}




const superAuth = (req, res, next) => {
    authentication(req, res, async () => {
        if(req.user.isSuperAdmin) {
            next()
        } else {
            res.status(400).json({
                message: 'You are not authorized to perform this action'
            })
        }
    })
}




module.exports = {
    checkUser,
    superAuth
}