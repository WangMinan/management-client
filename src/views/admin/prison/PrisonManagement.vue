<script setup>
</script>

<template>
  <!--面包屑导航-->
  <el-breadcrumb :separator-icon="ArrowRight">
    <el-breadcrumb-item :to="{ path: '/adminHome' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>监所信息管理</el-breadcrumb-item>
    <el-breadcrumb-item>监所管理</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card style="margin-top: 2%">
    <!--搜索框-->
    <el-row class="searchRow">
      <el-col :span = "10">
        <!--          需要绑定@clear以在清空文本框时做状态更新-->
        <el-input placeholder="请输入内容" clearable>
          <template #append>
            <el-button>
              <el-icon class="el-input__icon">
                <Search />
              </el-icon>
            </el-button>
          </template>
        </el-input>
      </el-col>
      <!--按钮区-->
      <el-col :span="6" class="btnCol">
        <el-button type="primary">
          <el-icon><Edit/></el-icon>
          添加监所
        </el-button>
        <el-button type="danger">
          <el-icon><Delete/></el-icon>
          删除监所
        </el-button>
      </el-col>
    </el-row>
    <!--表格-->
    <el-table></el-table>
    <el-pagination
      v-model:current-page="currentPage4"
      v-model:page-size="pageSize4"
      :page-sizes="[100, 200, 300, 400]"
      :small="small"
      :disabled="disabled"
      :background="background"
      layout="total, sizes, prev, pager, next, jumper"
      :total="400"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </el-card>
</template>

<style lang="less" scoped>
.searchRow{
  display: flex;
  justify-content: space-between;
  .btnCol{
    display: flex;
    justify-content: flex-end;
  }
}
.el-table{
  margin-top: 2%;
}
.el-pagination{
  margin-top: 2%;
}
</style>
