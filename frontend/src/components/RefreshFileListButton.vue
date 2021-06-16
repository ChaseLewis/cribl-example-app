<template>
    <Button label="Refresh" icon="pi pi-refresh" iconPos="left" @click="onClick"/>
</template>

<script lang="ts">
import 'vuex';
import { Component, Vue } from 'vue-property-decorator';
import Button from 'primevue/button';

@Component({
    components: { Button }
})
export default class RefreshFileListButton extends Vue {

    isLoading = false;

    async onClick() {
        if(this.isLoading)
            return;
    
        this.isLoading = true;
        try {
            this.$store.dispatch('updateFileList');
        }
        finally {
            this.isLoading = false;
        }
    }
}
</script>