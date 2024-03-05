/* eslint-disable @typescript-eslint/no-explicit-any */
import multer from 'multer';
import path from 'path';

// Configuration for multer
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(
      null,
      `file/user-${path.extname(file.originalname)}-${Date.now()}.${ext}`
    );
  },
});

// Multer filter for images
const multerFilter = (req: any, file: any, cb: any) => {
  const allowedFileTypes = ['jpg', 'jpeg', 'gif', 'png'];
  const fileType = file.mimetype.split('/')[1];
  if (allowedFileTypes.includes(fileType)) {
    cb(null, true);
  } else {
    cb(new Error('Violated file requirements'));
  }
};

const uploader = multer({
  storage: multerStorage,
  limits: { fileSize: 1000000 * 5 },
  fileFilter: multerFilter,
}).single('file');

export default uploader;