<template>
    <div>
        <DataTable :value="fileInfo" responsiveLayout="scroll" :loading="isLoading">
            <Column field="fileName" header="File Name" />
            <Column field="fileSize" header="File Size" />
            <Column field="uploadDate" header="UploadDate" />
            <Column>
                <template #body="slotProps">
                    <Button type="button" icon="pi pi-download" class="p-button-primary" style="margin-right: .5em" @click="onDownload(slotProps.data.fileName)" />
                    <Button type="button" icon="pi pi-trash" class="p-button-danger" @click="onDelete(slotProps.data.fileName)" />
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<script lang="ts">
import 'vuex';
import { Component, Vue } from 'vue-property-decorator';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import ConfirmDialog from 'primevue/confirmdialog';
import FileService, { FileInfo } from '../services/fileService';

@Component({ components: { DataTable, Column, Button, ConfirmDialog } })
export default class FileList extends Vue {
    private fileService = new FileService();
    private fileInfo: FileInfo[] = [];
    isLoading = false;

    created() {
        this.$store.subscribe((mutation,state) => {
            switch(mutation.type) {
                case 'fileList':
                    this.fileInfo = state.fileList;
                    break;
                case 'loadingFileList':
                    this.isLoading = state.loadingFileList;
                    break;
                default:
                    break;
            }
        });
    }

    mounted() {
        //We should subscribe to vuex changes
        this.$store.dispatch('updateFileList');
    }

    onDownload(fileName: string) {
        const link = document.createElement('a');
        link.setAttribute('download',fileName);
        link.href = this.fileService.downloadUrl(fileName);
        link.click();
    }

    async onDelete(fileName: string) {
        this.$confirm.require({
                message: `Are you sure you want to delete '${fileName}' file?`,
                header: 'Confirmation',
                icon: 'pi pi-exclamation-triangle',
                accept: async () => {
                    this.$store.commit('loadingFileList',true);
                    try
                    {
                        await this.fileService.delete(fileName);
                        this.$store.dispatch('updateFileList');
                    }
                    finally {
                        this.$store.commit('loadingFileList',false);
                    }
                },
                reject: () => {
                    //callback to execute when user rejects the action
                }
            });
    }
}
</script>

<style lang="scss">
.p-datatable .p-datatable-loading-overlay {
    width: 100%;
    height: 100%;
}
</style>