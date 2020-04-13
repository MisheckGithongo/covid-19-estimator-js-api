const fs = require('fs');
const helper = require('./helper');

exports.logs = (req, res) => {
  const start = process.hrtime();

  let returnData;

  fs.readFile('./logs.txt', (err, data) => {
    // Catch this!
    if (err) {
      throw err;
    } else {
      returnData = data.toString();
      res.set('Content-type', 'text/plain');
      res.status(200).send(returnData);
      res.on('finish', () => {
        const durationInMilliseconds = helper.getDurationInMilliseconds(start);
        const durationInt = Math.floor(durationInMilliseconds).toLocaleString();
        let time;
        if (durationInt.length <= 1) {
          time = `0${durationInt}`;
        } else {
          time = durationInt;
        }
        const log = `${req.method}     ${req.originalUrl}    ${res.statusCode}   ${time}ms\n`;
        fs.appendFile('logs.txt', log, (err2) => {
        // Catch this!
          if (err2) throw err;
        });
      });
    }
  });
};
