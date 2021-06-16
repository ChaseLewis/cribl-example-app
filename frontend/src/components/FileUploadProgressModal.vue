<template>
    <Dialog :closable="false" :modal="true" :visible.sync="visible" class="progress-modal">
        <template #header>
            <h3>Uploading File</h3>
        </template>

        <ProgressBar :value="value" :mode="value >= 100 ? 'indeterminate' : 'determinate'" />
        <div v-if="value >= 100">
            Finalizing Upload...
        </div>
    </Dialog>
</template>

<script lang="ts">
import 'vuex';
import { Component, Vue } from 'vue-property-decorator';
import ProgressBar from 'primevue/progressbar';
import Dialog from 'primevue/dialog';

@Component({
    components: { 
        ProgressBar,
        Dialog
    }
})
export default class FileUploadProgressModal extends Vue {
    value = 0;
    visible = false;
    created() {
        this.$store.subscribe((mutation,state) => {
            if(mutation.type == 'fileProgress'){
                this.value = state.fileProgress;
            }
        });
        this.$store.subscribe((mutation,state) => {
            if(mutation.type == 'fileProgressShow') {
                this.visible = state.fileProgressShow;
            }
        });
    }
}
</script>

<style lang="scss">
.progress-modal {
    width: 80vw;
    max-width: 800px;
}
</style>