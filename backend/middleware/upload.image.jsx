const multer = require('multer');
const path = require('../uploads');

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory where files will be stored
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname); 
    const uniqueName = `${timestamp}${ext}`;
    cb(null, uniqueName);
  },
});

// Multer middleware
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
      const allowedMimeTypes = ["image/jpeg", "image/jpg"];
      if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error("Invalid file type. Only JPEG images are allowed."));
      }
    },
  }).single("image");

module.exports = upload;