import axios from 'axios';

export interface FileInfo {
    fileName: string;
    uploadDate: string;
}

export interface ListResponse {
    data: FileInfo[];
}

export interface FileIdResponse {
    uuid: string;
}

export default class FileService {

    async list(): Promise<FileInfo[]> {
        const response = await axios.get<ListResponse>('/file/list');
        return response.data.data;
    }
    private async getFileId(): Promise<string> {
        const response = await axios.get<FileIdResponse>('/file/newid');
        return response.data.uuid;
    }

    private async completeUpload(fileId: string, fileName: string,chunkCount: number) {
        await axios.post('/file/complete',{
            fileId,
            fileName,
            chunkCount
        });
    }

    private async uploadChunk(chunkData: Blob, fileId: string, fileName: string, chunkNumber: number) {
        const formData = new FormData();
        formData.append('fileId',fileId);
        formData.append('fileName',fileName);
        formData.append('chunkNumber',chunkNumber.toString());
        formData.append('data',chunkData);
        
        await axios.post('/file/data',formData,
        {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    }

    async upload(file: File,progressCallback?: (fileName: string,bytesUploaded: number,size: number) => void) {
        const maxChunkSize = 5*1024*1024;
        const chunkCount = Math.ceil(file.size / maxChunkSize);
        const fileId = await this.getFileId();

        for(let i = 0;i < chunkCount;i++) {

            const start = i*maxChunkSize;
            let end = (i+1)*maxChunkSize;
            if(end > file.size) {
                end = file.size;
            }

            const chunkData = file.slice(start,end)
            await this.uploadChunk(chunkData,fileId, file.name, i);

            if(progressCallback)
            {
                try
                {
                    progressCallback(file.name,end,file.size);
                }
                catch(e)
                {
                    console.error(e);
                    /* ignore error associated with callback, don't let it interrupt upload */
                }
            }
        }

        await this.completeUpload(fileId, file.name, chunkCount);
    }

    async delete(fileName: string): Promise<void> {
        await axios.delete('/file',{ params: {
            fileName
        }});
    }

    downloadUrl(fileName: string): string {
        //This should be a config. Essentially the dev proxy has issues with GET download url's
        //that wouldn't be an issue in a self hosted server
        return `http://localhost:3000/file/download?fileName=${encodeURI(fileName)}`;
    }
}