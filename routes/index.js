const express = require('express');

const onCovid19Controller = require('../controllers/onCovid19');
const onCovid19XmlController = require('../controllers/onCovid19Xml');

const router = express.Router();

router.post('/on-covid-19', onCovid19Controller.onCovid19);
router.post('/on-covid-19/json', onCovid19Controller.onCovid19);
router.post('/on-covid-19/xml', onCovid19XmlController.onCovid19Xml);


module.exports = router;
