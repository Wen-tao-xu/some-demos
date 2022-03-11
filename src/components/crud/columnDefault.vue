<template>
  <div class="column-default">
    <el-table-column width="1px"></el-table-column>
    <!-- 折叠面板  -->
    <el-table-column
      type="expand"
      :width="crud.option.expandWidth || config.expandWidth"
      fixed="left"
      align="center"
      v-if="crud.option.expand"
    >
      <template slot-scope="{ row }">
        <slot :row="row" :index="row.$index" name="expand"></slot>
      </template>
    </el-table-column>
    <!-- 选择框 -->
    <el-table-column
      v-if="crud.option.selection"
      fixed="left"
      type="selection"
      :selectable="crud.option.selectable"
      :reserve-selection="vaildData(crud.option.reserveSelection)"
      :width="crud.option.selectionWidth || config.selectionWidth"
      align="center"
    ></el-table-column>
    <!-- 序号 -->
    <el-table-column
      v-if="crud.option.index"
      :fixed="true"
      :label="crud.option.indexLabel || config.indexLabel"
      type="index"
      :width="crud.option.indexWidth || config.indexWidth"
      :index="indexMethod"
      align="center"
    ></el-table-column>
  </div>
</template>

<script>
import config from './config.js'
import { vaildData } from '@/utils/validate'

export default {
  name: 'columnDefault',
  inject: ['crud'],
  data() {
    return {
      config: config,
      vaildData,
    }
  },
  methods: {
    indexMethod(index) {
      return (
        index +
        1 +
        ((this.crud.page.currentPage || 1) - 1) *
          (this.crud.page.pageSize || 10)
      )
    },
  },
}
</script>

<style></style>
