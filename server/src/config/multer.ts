import crypto from 'crypto';

import path from 'path';
import multer from 'multer';

const config = {
  storage: multer.diskStorage({
    destination: path.resolve(__dirname, '..', '..', 'uploads'),
    filename: (req, file, callback) => {
      const hash = crypto.randomBytes(6).toString('hex');
      const filename = `${hash}-${file.originalname}`;

      callback(null, filename);
    },
  }),
};

export default config;
