const recordModel = require( '../models/recordModel' );
const userModel = require('../models/userModel');


// Create record 
const createRecord = async ( req, res ) => {
    try {
        const id = req.user.userId;

         // Find the details of the current signed-in user 
         const user = await userModel.findById(id);

         if(!user) {
            return res.status(404).json({
                error: "User not found"
            })
         }

        const { math, english, biology } = req.body;

        // Create a new record
        const record = new recordModel({
            math,
            english,
            biology,
            createdBy: user._id
        });

        // Save the record to the database
        const newRecord = await record.save();


        //   Update the records field by pushing the new  record created into the Records array
        user.records.push(newRecord);

        //   save the updated user details into the database
        await user.save();;

        res.status(201).json({
            message: "Record created successfully",
            data: newRecord
        })
    } catch (error) {
        res.status(500).json({
            Error: error.message
        })
    }
    
}


// Get all records of a specific user
const getRecords = async ( req, res ) => {
    try {
        const {userId} = req.user;

        const records = await recordModel.find({ createdBy: userId });

        if (records.length === null) {
            return res.status(200).json({
                message: 'There are no records in this database',
            })
        }
        res.status(200).json({
            message: `These are all the records in the database and they are: ${records.length}`,
            data: records
        })
    } catch (error) {
        res.status(500).json({
            Error: error.message
        })
    }
}


// Get all records of in the database
const getAllRecords = async ( req, res ) => {
    try {
        const records = await recordModel.find();

        if (records.length === null) {
            return res.status(200).json({
                message: 'There are no records in this database',
            })
        }
        res.status(200).json({
            message: `These are all the records in the database and they are: ${records.length}`,
            data: records
        })
    } catch (error) {
        res.status(500).json({
            Error: error.message
        })
    }
}


// Get one record
const getRecord = async (req, res) => {
    try {
        const { userId } = req.user;
        const recordId = req.params.id;

        const record = await recordModel.findOne({ _id: recordId, createdBy: userId });

        if (!record) {
            return res.status(404).json({
                message: 'Record not found for the specified user',
            });
        }

        res.status(200).json({
            message: 'Record found:',
            data: record,
        });
    } catch (error) {
        res.status(500).json({
            Error: error.message,
        });
    }
};



// Update a record
const updateRecord = async ( req, res ) => {
    try {
        const { userId } = req.user;
        const recordId = req.params.id;

        const record = await recordModel.findOne({ _id: recordId, createdBy: userId });

        if (!record) {
            return res.status(404).json({
                message: 'Record not found for the specified user',
            });
        }

        record.math = req.body.math || record.math;
        record.english = req.body.english || record.english;
        record.biology = req.body.biology || record.biology;

        // Save the updated record to the database
        await record.save();

        res.status(200).json({
            message: 'Record updated successfully'
        });

    } catch (error) {
        res.status(500).json({
            Error: error.message
        })
    }
};


// Delete a record
const deleteRecord = async ( req, res ) => {
    try {
        const { userId } = req.user;
        const recordId = req.params.id;

        const record = await recordModel.findOne({ _id: recordId, createdBy: userId });

        if (!record) {
            return res.status(404).json({
                message: 'Record not found for the specified user',
            });
        }


        // Find the details of the current signed-in user 
        const user = await userModel.findById(record.createdBy);

        // Remove the record from the user's records array
        user.records = user.records.filter((recdId) => recdId.toString() !== recordId);

        await user.save();

        // Delete the record from the database
        await recordModel.findByIdAndDelete(recordId);

        res.status(200).json({
            message: "Record successfully deleted"
        });


    } catch (error) {
        res.status(500).json({
            Error: error.message
        })
    }
};

module.exports = {
    createRecord,
    getAllRecords,
    getRecords,
    getRecord,
    updateRecord,
    deleteRecord
}