const jsonxml = require('jsontoxml');
const fs = require('fs');
const helper = require('./helper');

exports.onCovid19Xml = (req, res) => {
  const start = process.hrtime();
  // eslint-disable-next-line max-len
  if (!req.body.region || !req.body.region.name || !req.body.region.avgAge || !req.body.region.avgDailyIncomeInUSD || !req.body.region.avgDailyIncomePopulation || !req.body.periodType || !req.body.timeToElapse || !req.body.reportedCases || !req.body.population || !req.body.totalHospitalBeds) {
    res.status(400).json({ Message: 'Invalid Input' });
  } else {
    const input = req.body;
    let days;
    let sets;
    let factor;
    if (input.periodType === 'days') {
      days = input.timeToElapse;
      factor = Math.floor(days / 3);
      sets = 2 ** factor;
    } else if (input.periodType === 'weeks') {
      days = input.timeToElapse * 7;
      factor = Math.floor((days) / 3);
      sets = 2 ** factor;
    } else if (input.periodType === 'months') {
      days = input.timeToElapse * 30;
      factor = Math.floor((days) / 3);
      sets = 2 ** factor;
    }
    const signChecker = (num) => {
      if (num > 0) {
        return Math.floor(num);
      }
      if (num < 0) {
        return Math.ceil(num);
      }
      return null;
    };
    const returnData = {
      data: input,
      impact: {
        currentlyInfected: input.reportedCases * 10,
        infectionsByRequestedTime: input.reportedCases * 10 * sets,
        severeCasesByRequestedTime: Math.floor(0.15 * (input.reportedCases * 10 * sets)),
        hospitalBedsByRequestedTime: signChecker((0.35 * input.totalHospitalBeds)
      - Math.floor(0.15 * (input.reportedCases * 10 * sets))),
        casesForICUByRequestedTime: Math.floor(0.05 * (input.reportedCases * 10 * sets)),
        casesForVentilatorsByRequestedTime: Math.floor(0.02 * (input.reportedCases * 10 * sets)),
        dollarsInFlight: Math.floor((input.reportedCases * 10 * sets
         * input.region.avgDailyIncomePopulation
       * input.region.avgDailyIncomeInUSD) / days)
      },
      severeImpact: {
        currentlyInfected: input.reportedCases * 50,
        infectionsByRequestedTime: input.reportedCases * 50 * sets,
        severeCasesByRequestedTime: 0.15 * (input.reportedCases * 50 * sets),
        hospitalBedsByRequestedTime: signChecker((0.35 * input.totalHospitalBeds)
      - Math.floor(0.15 * (input.reportedCases * 50 * sets))),
        casesForICUByRequestedTime: Math.floor(0.05 * (input.reportedCases * 50 * sets)),
        casesForVentilatorsByRequestedTime: Math.floor(0.02 * (input.reportedCases * 50 * sets)),
        dollarsInFlight: Math.floor((input.reportedCases * 50 * sets
        * input.region.avgDailyIncomePopulation
       * input.region.avgDailyIncomeInUSD) / days)
      }
    };
    const xml = jsonxml(returnData);
    res.type('application/xml');
    res.status(201).send(xml);
    res.on('finish', () => {
      const durationInMilliseconds = helper.getDurationInMilliseconds(start);
      const durationInt = Math.floor(durationInMilliseconds).toLocaleString();
      let time;
      if (durationInt.length <= 1) {
        time = `0${durationInt}`;
      } else {
        time = durationInt;
      }
      const log = `${req.method}    ${req.originalUrl}     ${res.statusCode}   ${time}ms\n`;
      fs.appendFile('logs.txt', log, (err) => {
      // Catch this!
        if (err) throw err;
      });
    });
  }
};
