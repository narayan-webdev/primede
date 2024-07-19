import multer, { diskStorage } from 'multer';
import { extname as _extname } from 'path';
import fs from 'fs';
import { randomBytes } from 'crypto';



const storage = diskStorage({
    destination: 'public/uploads',
    filename: (req, file, cb) => {

        const originalname = file.originalname.split(" ").join("_")
        const uniqueSuffix = randomBytes(16).toString('hex');
        const extname = _extname(originalname);
        const filename = `${originalname}-${uniqueSuffix}${extname}`;
        cb(null, filename);
    },
});

const upload = multer({ storage: storage });

export default upload;