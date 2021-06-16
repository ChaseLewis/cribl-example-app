import { FileInfo } from '@/services/fileService'
import Vue from 'vue'
import Vuex from 'vuex';
import FileService from '@/services/fileService';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    fileList: [] as FileInfo[],
    fileProgressShow: false,
    fileProgress: 0,
    loadingFileList: false
  },
  mutations: {
    fileList: (state,payload) => {
      state.fileList = payload;
    },
    fileProgressShow: (state,payload) => {
      state.fileProgressShow = payload;
    },
    fileProgress: (state,payload) => {
      state.fileProgress = payload;
    },
    loadingFileList: (state,payload) => {
      state.loadingFileList = payload;
    }
  },
  actions: {
    updateFileList: async (ctx) => {
      const fileService = new FileService();
      ctx.commit('loadingFileList',true);
      ctx.commit('fileList',await fileService.list());
      ctx.commit('loadingFileList',false);
    }
  },
  modules: {
  }
})
