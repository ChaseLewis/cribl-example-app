<template>
  <div class="home">
    <div class="p-grid">
      <div class="p-col-fixed" style="width: 120px;">
        <upload-file-button />
      </div>
      <div class="p-col-fixed" style="width: 120px;">
        <refresh-file-list-button />
      </div>
    </div>
    <file-list />
    <file-upload-progress-modal />
    <Toast position="bottom-left" />
    <ConfirmDialog />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import FileList from '../components/FileList.vue';
import UploadFileButton from '../components/UploadFileButton.vue';
import RefreshFileListButton from '../components/RefreshFileListButton.vue';
import FileUploadProgressModal from '../components/FileUploadProgressModal.vue';
import Toast from 'primevue/toast';
import ConfirmDialog from 'primevue/confirmdialog'
/* eslint-disable no-unused-vars */
import ToastService from 'primevue/toastservice';
/* eslint-enable no-unused-vars */

@Component({
  components: { 
    Toast,
    FileList,
    UploadFileButton,
    RefreshFileListButton,
    FileUploadProgressModal,
    ConfirmDialog
  }
})
export default class Home extends Vue {

}
</script>