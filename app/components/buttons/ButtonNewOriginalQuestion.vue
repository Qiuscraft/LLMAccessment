<template>
  <el-button size="large" primary @click="dialogOverflowVisible = true">
    新建数据
  </el-button>

  <el-dialog
      v-model="dialogOverflowVisible"
      title="新建数据"
      width="500"
      draggable
      overflow
      :before-close="handleClose"
  >
    <div>问题标题<el-input v-model="title" style="width: 240px; margin-left: 20px" size="large" placeholder="问题标题（可为空）" /></div>
    <div>问题描述<el-input v-model="content" style="width: 240px; margin-left: 20px" type="textarea" autosize placeholder="问题描述（必填）" /></div>
    <div>问题版本<el-input v-model="version" style="width: 240px; margin-left: 20px" size="large" placeholder="问题版本" /></div>
    <template #footer>
      <div class="dialog-footer">
        <el-button size="large" :disabled="buttonDisabled" @click="handleClose">取消</el-button>
        <el-button type="primary" size="large" :disabled="buttonDisabled" @click="handleConfirm">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
const dialogOverflowVisible = ref(false);

const handleClose = (done: () => void) => {
  ElMessageBox.confirm('你确认要取消吗？',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
      draggable: true,
    })
    .then(() => {
      dialogOverflowVisible.value = false;
      done && done()
    })
    .catch(() => {
      // catch error
    })
};

const title = ref('');
const content = ref('');
const version = ref('1');

const buttonDisabled = ref(false);

const handleConfirm = async () => {
  if (!content.value) {
    ElMessage.error('问题描述不能为空');
    return;
  }
  if (!version.value) {
    ElMessage.error('问题版本不能为空');
    return;
  }
  buttonDisabled.value = true;
  try {
    const response = await $fetch('/api/original-question/new', {
      method: 'POST',
      body: {
        version: version.value,
        title: title.value,
        content: content.value
      }
    });
    dialogOverflowVisible.value = false;
    title.value = '';
    content.value = '';
    ElMessage.success('创建成功');
  } catch (error) {
    ElMessage.error(error.message || '创建失败');
  } finally {
    buttonDisabled.value = false;
  }
}
</script>

<style scoped>

</style>

