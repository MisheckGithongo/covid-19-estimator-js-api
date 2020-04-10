
exports.onCovid19 = (req, res) => {
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
    const returnData = {
      data: input,
      impact: {
        currentlyInfected: input.reportedCases * 10,
        infectionsByRequestedTime: input.reportedCases * 10 * sets,
        severeCasesByRequestedTime: Math.floor(0.15 * (input.reportedCases * 10 * sets)),
        hospitalBedsByRequestedTime: (Math.floor(0.35 * input.totalHospitalBeds))
      - (Math.floor(0.15 * (input.reportedCases * 10 * sets))),
        casesForICUByRequestedTime: Math.floor(0.05 * (input.reportedCases * 10 * sets)),
        casesForVentilatorsByRequestedTime: Math.floor(0.02 * (input.reportedCases * 10 * sets)),
        // eslint-disable-next-line max-len
        dollarsInFlight: ((input.reportedCases * 10 * sets) * (input.region.avgDailyIncomePopulation)
       * (input.region.avgDailyIncomeInUSD) * days).toFixed(2)
      },
      severeImpact: {
        currentlyInfected: input.reportedCases * 50,
        infectionsByRequestedTime: input.reportedCases * 50 * sets,
        severeCasesByRequestedTime: 0.15 * (input.reportedCases * 50 * sets),
        hospitalBedsByRequestedTime: (Math.floor(0.35 * input.totalHospitalBeds))
      - (Math.floor(0.15 * (input.reportedCases * 50 * sets))),
        casesForICUByRequestedTime: Math.floor(0.05 * (input.reportedCases * 50 * sets)),
        casesForVentilatorsByRequestedTime: Math.floor(0.02 * (input.reportedCases * 50 * sets)),
        // eslint-disable-next-line max-len
        dollarsInFlight: ((input.reportedCases * 50 * sets) * (input.region.avgDailyIncomePopulation)
       * (input.region.avgDailyIncomeInUSD) * days).toFixed(2)
      }
    };
    res.status(201).json(returnData);
  }
};
