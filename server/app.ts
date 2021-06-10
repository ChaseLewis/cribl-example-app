import fs from 'fs/promises';
import path from 'path';
import express from 'express';
import Router from 'express-promise-router';
import { config } from 'dotenv';
import multer from 'multer';
import { json, urlencoded } from 'body-parser';

//Load .env variables into process.env
config();

//Initialize Server
const app = express();
const router = Router();

//Initialize Middleware
app.use(json());
app.use(router);
app.use(urlencoded({ extended: true }));
app.use(express.static('dist')); //This would be used in production to serve up our frontend build

const uploadDirectory = 'uploads'
fs.mkdir(uploadDirectory).catch(() => { /* Ignore error if directory already exists */ });
const upload = multer({ dest: 'tmp/' }); 

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  }
  catch(e) {
    return false;
  }
}

router.get('/list',async (req,res) => {
  const files = await fs.readdir('./uploads');
  res.status(200).json({ files });
});

//Initialize routes
router.post('/upload', upload.single('file'), async (req, res) => {
  if(!req.file.originalname.endsWith('.tgz')) {
    await fs.unlink(req.file.path);
    console.log(`deleted invalid file ${req.file.originalname}`);
    res.status(400).end();
    return;
  }

  //If there is a collision we want this new file to take its place
  const targetPath = path.join(uploadDirectory,req.file.originalname);
  if(await fileExists(targetPath)) {
    await fs.unlink(targetPath);
  }

  await fs.rename(req.file.path,targetPath);
  res.status(200).end();
});

const PORT = parseInt(process.env.PORT as string);
app.listen(PORT, () => {
  console.log(`Express with Typescript! http://localhost:${PORT}`);
});