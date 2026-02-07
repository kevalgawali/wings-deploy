const express = require('express');
const viewerRegister = require('../components/viewerRegister');
const router = express.Router();

router.use(express.json());

// Register a viewer
router.post('/register', viewerRegister);

module.exports = router;
