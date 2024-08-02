    <script setup lang="ts">
    import {PROVIDE_DIALOG_VM} from '@/constant'
    const provideDialogVm = inject(PROVIDE_DIALOG_VM,{exit:()=>{},confirm:()=>{}})
    const cancel=()=>{
      unref(provideDialogVm)?.exit()
    }
    const confirm=()=>{
      unref(provideDialogVm)?.confirm()
    }
    </script>
<template>
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="../assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
    <a href="https://element-plus.org/" target="_blank">
      <img src="/element-plus-logo-small.svg" class="logo element-plus" alt="Element Plus logo" />
    </a>
    <el-button @click="cancel">Cancel</el-button>
    <el-button type="primary" @click="confirm">Confirm</el-button>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
.logo.element-plus:hover {
  filter: drop-shadow(0 0 2em #409effaa);
}
</style>
