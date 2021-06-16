import { time } from 'console';
import fs from 'fs/promises';
import path from 'path';

export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  }
  catch(e) {
    return false;
  }
}

export async function buildFileFromParts(parts: string[],target: string): Promise<void> {

    if(await fileExists(target)) {
      await fs.unlink(target);
    }

    //This fails randomly sometimes ....
    const file = await fs.open(target,'w+');
    try {
      for(const part of parts) {
        const data = await fs.readFile(part); //Each part is guaranteed to be only 1MB or so.
        await fs.writeFile(file,data);
      }
    }
    finally{
      file.close();
      for(const part of parts) {
        await fs.unlink(part);
      }
    }
}

export async function clearDirectory(dirPath: string) {
  if(!await fileExists(dirPath))
    return;
    
  const files = await fs.readdir(dirPath);
  for(const file of files){
    await fs.unlink(path.join(dirPath,file));
  }
}

export async function getFileInfo(dirPath: string) {
  const results = [];
  const files = await fs.readdir(dirPath);
  for(const file of files) { 
    const filePath = path.join(dirPath,file);
    const stat = await fs.stat(filePath);

    if(stat.isFile())
    {
        const fileSize = stat.size / (1024*1024);
        let isoString = stat.birthtime.toISOString();
        isoString = isoString.substr(0,isoString.length-5).replace('T',' ');
        results.push({ fileName: file, fileSize: `${fileSize.toFixed(2)} MB`, uploadDate: isoString });
    }
  }

  return results;
}

export async function getFiles(dirPath: string,guid?: string): Promise<string[]> {
  const results = [];
  const files = await fs.readdir(dirPath);
  for(const file of files) { 
    //if file matches
    const filePath = path.join(dirPath,file);
    const stat = await fs.stat(filePath);
    if(stat.isFile())
    {
      if(guid && file.startsWith(guid)){
        results.push(filePath);
      } else if(!guid) {
        results.push(filePath);
      }
    }
  }

  return results;
}