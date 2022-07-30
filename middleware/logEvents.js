const { format } = require("date-fns");
const { v4: uuid } = require("uuid");

const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");

async function logEvents(msg, logName) {
  const dateTime = format(new Date(), "ddMMyyyy\tHH:mm:ss");
  const id = uuid();
  const log = `\n${dateTime}\tid: ${id}\n${msg}\n`;

  try {
    if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
      await fsPromises.mkdir(path.join(__dirname, "..", "logs"));
    }

    await fsPromises.appendFile(
      path.join(__dirname, "..", "logs", logName),
      log
    );
  } catch (err) {
    console.error(err);
  }
}

const logger = (req, res, next) => {
  logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, "reqLog.txt");
  next();
};

module.exports = { logEvents, logger };
