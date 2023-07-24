const express = require('express');

const router = express.Router();
const recordController = require('../controllers/recordController');
const {authenticate} = require('../middleware/authorization')

router.post('/records/:userId', authenticate, recordController.createRecord);

router.get('/all-records', recordController.getAllRecords);

// Get all records of a specific user
router.get('/user-records/:userId', authenticate, recordController.getRecords);

router.get('/:userId/user-record/:id', authenticate, recordController.getRecord);

router.patch('/:userId/user-record/:id', authenticate, recordController.updateRecord);

router.delete('/:userId/user-record/:id', authenticate, recordController.deleteRecord);




module.exports = router