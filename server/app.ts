import fs from 'fs/promises';
import path from 'path';
import express from 'express';
import Router from 'express-promise-router';
import { config } from 'dotenv';
import multer from 'multer';
import { json, urlencoded } from 'body-parser';
import { logger, setupLogs } from './utilities/setupLogs';
import { buildFileFromParts, fileExists, getFiles, getFileInfo, clearDirectory } from './utilities/fileUtilities';
import { uuid } from 'uuidv4';

//Load .env variables into process.env
config();

//Initialize Server
const app = express();
const router = Router();

//Initialize Middleware
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(express.static('dist')); //This would be used in production to serve up our frontend build
setupLogs(app);
app.use(router);

const tempDirectory = process.env.TEMP_DIRECTORY as string;
clearDirectory(tempDirectory); //Delete any temporary files that got abandoned on server restart

const upload = multer({ dest: tempDirectory });
const uploadDirectory = process.env.UPLOAD_DIRECTORY as string;
fs.mkdir(uploadDirectory).catch(() => { /* Ignore error if directory already exists */ });

router.get('/file/list',async (req,res) => {
  const fileInfo = await getFileInfo(uploadDirectory);
  res.status(200).json({ data: fileInfo });
});

router.delete('/file',async (req,res) => {
  if(!req.query.fileName) {
    res.status(400).send();
    return;
  }

  const targetPath = path.join(uploadDirectory,req.query.fileName as string);
  if(!await fileExists(targetPath))
  {
    res.status(404).send();
    return;
  }
  
  try {
    await fs.unlink(targetPath);
  }
  catch(e) {
    /* ignore error as that could happen with possible race condition */
  }

  res.status(200).send();
});

router.get('/file/download',async (req,res) => {
  const fileName = req.query.fileName as string;
  if(!fileName) {
    res.status(400).end();
    return;
  }

  //We don't want someone to be able to navigate to different directories and
  //be able to download any file from the server.
  if(fileName.includes('/') || fileName.includes('\\')) {
    res.status(400).end();
    return;
  }

  const targetPath = path.join(uploadDirectory,fileName);

  //If file doesn't exist return 404
  if(!await fileExists(targetPath)) {
    res.status(404).end();
    return;
  }

  res.download(targetPath);
});

router.get('/file/newid',async (req,res) => {
  res.status(200).json({ uuid: uuid() });
});

router.post('/file/data', upload.single('data'), async (req,res) => {
  if(!req.body?.fileName?.endsWith('.tgz') || !req.body.fileId || !req.body.chunkNumber) {
    res.status(400).end();
    return;
  }

  const targetPath = path.join(tempDirectory,req.body.fileId + `_${parseInt(req.body.chunkNumber).toString().padStart(15,'0')}`);
  await fs.rename(req.file.path,targetPath);
  res.status(200).end();
});

router.post('/file/complete', async (req, res) => {

  if(!req.body?.fileName?.endsWith('.tgz') || !req.body.fileId || !req.body.fileName || !req.body.chunkCount) {
    console.log(`invalid file`);
    res.status(400).end();
    return;
  }

  //If there is a collision we want the newer file to overwrite the old one
  const targetPath = path.join(uploadDirectory,req.body.fileName);

  //move the file to the permanent directory
  const fileChunks = await getFiles(tempDirectory,req.body.fileId);
  if(fileChunks.length !== parseInt(req.body.chunkCount)) {
    res.status(400).end();
    return;
  }

  await buildFileFromParts(fileChunks,targetPath);
  res.status(200).end();
});

//Initialize server
const PORT = parseInt(process.env.PORT as string);
app.listen(PORT, () => {
  console.log(`Express with Typescript! http://localhost:${PORT}`);
});