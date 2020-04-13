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
      res.type('application/text');
      res.status(200).send(returnData);
      res.on('finish', () => {
        const durationInMilliseconds = helper.getDurationInMilliseconds(start);
        const log = `${req.method}     ${req.originalUrl}    ${res.statusCode}   ${durationInMilliseconds.toLocaleString()}ms \n`;
        fs.appendFile('logs.txt', log, (err2) => {
        // Catch this!
          if (err2) throw err;
        });
      });
    }
  });
};
