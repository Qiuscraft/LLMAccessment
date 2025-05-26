<script setup lang="ts">
  import {formatMySQLTimestampToRFC3339} from "~/utils/utilTime";

  const tableData = ref();
  const total = ref(0);
  const pageSize = ref(10);
  const pageNumber = ref(1);
  const orderField = ref('id')
  const orderBy = ref('asc');

  async function fetchTableData() {
    try {
      const response = await $fetch('/api/original-question', {
        method: 'GET',
        query: {
          pageNumber: pageNumber.value,
          pageSize: pageSize.value,
          orderField: orderField.value,
          orderBy: orderBy.value,
        }
      });
      tableData.value = response.data;
      total.value = response.total;
      for (const item of tableData.value) {
        item.created_at = formatMySQLTimestampToRFC3339(item.created_at);
        item.updated_at = formatMySQLTimestampToRFC3339(item.updated_at);
        item.version_created_at = formatMySQLTimestampToRFC3339(item.version_created_at);
        if (item.version === item.latest_version) {
          item.currect_latest_version = `${item.version} `;
        } else {
          // 如果当前版本不是最新版本，则显示当前版本和最新版本
          item.currect_latest_version = `${item.version} (${item.latest_version})`;
        }
        if (item.created_at === item.updated_at) {
          item.created_updated_at = item.created_at;
        } else {
          item.created_updated_at = `${item.created_at} (${item.updated_at})`;
        }
      }
    } catch (error) {
      console.error(error);
      ElMessage.error(error.message || '获取数据失败');
    }
  }

  async function handlePageUpdate(newPage: number) {
    pageNumber.value = newPage;
    await fetchTableData();
  }

  async function handleSortChange( data: {prop: string, order: any } ) {
    orderField.value = data.prop;
    orderBy.value = data.order === 'ascending' ? 'asc' : 'desc';
    if (orderField.value === 'created_updated_at') {
      orderField.value = 'created_at'; // 使用 created_at 字段进行排序
    } else if (orderField.value === 'currect_latest_version') {
      orderField.value = 'version';
    }
    await fetchTableData();
  }

  onMounted(async () => {
    await fetchTableData();
  })
</script>

<template>
  <el-table :data="tableData" stripe style="width: 100%" @sort-change="handleSortChange">
    <el-table-column prop="id" label="id" sortable="custom" />
    <el-table-column prop="title" label="标题" sortable="custom" />
    <el-table-column prop="content" label="描述" sortable="custom" />
    <el-table-column prop="created_updated_at" label="创建时间 (更新时间)" sortable="custom" />
    <el-table-column prop="currect_latest_version" label="版本 (最新版本)" sortable="custom" />
    <el-table-column prop="version_created_at" label="版本创建时间" sortable="custom" />
  </el-table>
  <el-pagination layout="total, prev, pager, next, jumper" :total="total" :page-size="pageSize" :current-page="pageNumber"
                 hide-on-single-page @update:current-page="handlePageUpdate" />
</template>

<style scoped>

</style>
