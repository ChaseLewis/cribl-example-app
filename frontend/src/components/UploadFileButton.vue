<template>
    <div>
        <Button label="Upload" icon="pi pi-plus" iconPos="left" @click="onClick"/>
        <input ref="fileInput" type="file" style="display: none" @change="onFileChange" />
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Button from 'primevue/button';
import FileService from '../services/fileService';
/* eslint-disable no-unused-vars */
import ConfirmService from 'primevue/confirmationservice';
import ToastService from 'primevue/toast'; 
/* eslint-enable no-unused-vars */

@Component({
    components: { Button }
})
export default class UploadFileButton extends Vue {

    isLoading = false;
    private fileService = new FileService();
    get fileInput(): HTMLInputElement {
        return this.$refs.fileInput as HTMLInputElement;
    }

    onClick() {
        this.fileInput.click();
    }

    onFileProgress(fileName: string,bytesUploaded: number,fileSize: number) {
        this.$store.commit('fileProgress',Math.floor((bytesUploaded/fileSize)*100));
    }

    async onFileChange() {

        if(this.isLoading || !this.fileInput.files || this.fileInput.files.length == 0)
            return;

        const file = this.fileInput.files[0];
        if(!file.name.endsWith('.tgz'))
        {
            this.$toast.add({ severity: 'error', summary: 'Cannot upload file', detail: 'Cannot upload non .tgz files.', life: 3000  });
            return;
        }

        try
        {
            this.isLoading = true;
            this.$store.commit('fileProgress',0);
            this.$store.commit('fileProgressShow',true);
            //We should pop an item onto a processingQueue that handles the actual upload progress
            await this.fileService.upload(file,this.onFileProgress);
            this.$store.dispatch('updateFileList');
        }
        catch(e) {
            console.error(e);
            this.$toast.add({ severity: 'error', summary: 'Cannot upload file', detail: 'Unknown error when uploading file', life: 3000  });
        }
        finally {
            //Clear the input after we are done
            this.fileInput.value = '';
            this.isLoading = false;
            this.$store.commit('fileProgressShow',false);
        }
    }
}
</script>