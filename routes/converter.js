const express = require('express')
const router = express.Router()
const {getCatagories,convert} = require('../controllers/converter')

router.route('/catagories').get(getCatagories)
router.route('/convert').get(convert)
// router.route('/convertT').get(convertTemperature)

module.exports = router