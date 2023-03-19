const express = require('express');
const apiRouter = express.Router();


apiRouter.get('/user', (req, res) => {
    res.json({
        data: [],
        message: 'Users fetched successfully'
    }).status(200);
})

module.exports = apiRouter;