<script setup lang="ts">
import { ElMessage } from 'element-plus';
import { dialogService } from '~/service/ui-dialog/index';
import { CustomComponentInstance } from '~/service/ui-dialog/type';
defineProps<{ msg: string }>();

const count = ref(0);
const loading = ref(false);

const option = ref([
  {
    width: 50,

    type: 'index',
  },
  {
    prop: 'createdAt',
    label: 'Time',
    format: 'MM/DD/YYYY HH:mm:ss A',
  },
  {
    prop: 'changedBy',
    label: 'User',
    copy: true,
  },
  {
    prop: 'action',
    label: 'Action',
  },
]);
const tableData = ref({
  data: [
    {
      createdAt: '2022-01-01 10:00:00',
      changedBy: 'liuxiaowei',
      action: 'action1',
    },
    {
      createdAt: '2022-01-01 10:00:00',
      changedBy: 'liuxiaowei',
      action: 'action2',
    },
    {
      createdAt: '2022-01-01 10:00:00',
      changedBy: 'liuxiaowei',
      action: 'action3',
    },
  ],
});
const input = ref('element-plus');
const proxy = getCurrentInstance();
const dialogVisible = ref(false);

const curDate = ref('');

const toast = () => {
  ElMessage.success('Hello');
};
const openDialog = async () => {
  const result1 = await dialogService({
    targetVM: proxy,
    title: 'Tips123',
    // content: 'Tips message',
    width: '300px',
    asyncComponent: defineAsyncComponent(
      () => import('~/components/Logos.vue')
    ),
  });

  console.log(result1);
};
</script>

<template>
  <h1 color="$ep-color-primary">{{ msg }}</h1>

  <p>
    See
    <a href="https://element-plus.org" target="_blank">element-plus</a> for more
    information.
  </p>

  <!-- example components -->
  <div class="mb-4">
    <el-button size="large" @click="toast">El Message</el-button>
    <el-button size="large" @click="openDialog">El Dialog Service</el-button>
    <el-button size="large" @click="dialogVisible = true">El Dialog</el-button>
  </div>

  <div>
    <BasicTable
      max-height="500px"
      :loading="loading"
      :option="option"
      :data="tableData"
    >
      <template #default="{ row, item }">
        <div v-if="item.prop === 'action'">123</div>
      </template>
    </BasicTable>
  </div>

  <div class="my-2 text-center flex flex-wrap justify-center items-center">
    <el-button @click="count++">count is: {{ count }}</el-button>
    <el-button type="primary" @click="count++">count is: {{ count }}</el-button>
    <el-button type="success" @click="count++">count is: {{ count }}</el-button>
    <el-button type="warning" @click="count++">count is: {{ count }}</el-button>
    <el-button type="danger" @click="count++">count is: {{ count }}</el-button>
    <el-button type="info" @click="count++">count is: {{ count }}</el-button>
  </div>
  <el-dialog v-model="dialogVisible" append-to-body title="Tips" width="500">
    <span>This is a message</span>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="dialogVisible = false">
          Confirm
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style>
.ep-button {
  margin: 4px;
}

.ep-button + .ep-button {
  margin-left: 0;
  margin: 4px;
}
</style>
