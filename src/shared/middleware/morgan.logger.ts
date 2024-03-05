import fs from 'fs';
import path from 'path';
import appRoot from 'app-root-path';
import morgan from 'morgan';

function morganLogger() {
  const LOGS_FOLDER = `${appRoot}/logs`;

  if (!fs.existsSync(LOGS_FOLDER)) {
    fs.mkdirSync(LOGS_FOLDER);
  }

  const accessLogStream = fs.createWriteStream(path.join(LOGS_FOLDER, 'app-access.log'), { flags: 'a' });

  return morgan('combined', { stream: accessLogStream });
}

export default morganLogger;