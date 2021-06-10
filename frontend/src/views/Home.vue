<template>
  <div class="home">
    <vue-dropzone
      id="file"
      ref="dropZone"
      :options="dropzoneOptions"
      @vdropzone-file-added="onFileAdded"
      @vdropzone-success="onUploadSuccess"
      @vdropzone-error="onUploadFailure"
      @vdropzone-complete="onUploadComplete"
    />
    <Toast position="bottom-left" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Dropzone, { DropzoneOptions } from 'dropzone';
import Toast from 'primevue/toast';
/* eslint-disable no-unused-vars */
import ToastService from 'primevue/toastservice';
/* eslint-enable no-unused-vars */

//@ts-expect-error vue2-dropzone doesn't have typescript bindings so error expected
import vueDropzone from 'vue2-dropzone';

@Component({
  components: { 
    vueDropzone,
    Toast
  }
})
export default class Home extends Vue {
  dropzoneOptions: DropzoneOptions = {
    url: '/upload',
    chunking: true,
    chunkSize: 5000000,
    maxFiles: 1
  }

  get dropZone(): Dropzone {
    return this.$refs.dropZone as any as Dropzone;
  }

  onFileAdded(file: Dropzone.DropzoneFile): void {
    console.log('file added');
    console.log(file);
    if(!file.name.endsWith('.tgz'))
    {
      this.dropZone.removeAllFiles();
      this.$toast.add({ severity: 'error', summary: 'Cannot Upload' , detail: 'File must be a .tgz file', life: 3000 });
    }
  }

  onUploadSuccess(file: Dropzone.DropzoneFile): void {
    console.log('file success');
    console.log(file);
    this.$toast.add({severity:'success', summary: 'Upload Success', detail: file.name, life: 3000});
  }

  onUploadFailure(file: Dropzone.DropzoneFile): void {
    console.log('file failure');
    console.log(file);
    this.$toast.add({severity:'error', summary: 'Upload Error', detail: file.name, life: 3000});
  }

  onUploadComplete(file: Dropzone.DropzoneFile): void {
    this.dropZone.removeFile(file);
  }
}
</script>
