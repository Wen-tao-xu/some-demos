<template>
  <div class="juwan-crud">
    <!-- 搜索组件 -->
    <header-search
      ref="headerSearch"
      v-if="vaildData(option.searchShow, config.searchShow)"
      :search.sync="search"
      :options="columnOption"
    >
      <template slot-scope="scope" v-for="item in searchSlot" :slot="item">
        <slot v-bind="scope" :name="item"></slot>
      </template>
    </header-search>
    <!-- 表格顶部功能 -->
    <el-row
      class="header-menu"
      type="flex"
      justify="space-between"
      align="middle"
    >
      <el-col :span="12" class="menu-left">
        <slot name="menuLeft"></slot>
      </el-col>
      <el-col :span="12" class="menu-right">
        <slot name="menuRight"></slot>
      </el-col>
    </el-row>
    <!-- 表格主体 -->
    <div class="table-wrap">
      <el-table
        ref="table"
        :row-key="handleGetRowKeys"
        :height="option.height"
        :max-heigh="option.maxHeight"
        :stripe="option.stripe"
        :border="option.border"
        :empty-text="option.emptyText || '暂无数据'"
        :data="data"
        :show-header="vaildData(option.showHeader, config.showHeader)"
        :row-class-name="rowClassName"
        v-loading="tableLoading"
        @selection-change="selectionChange"
        @select="select"
        @select-all="selectAll"
        @sort-change="sortChange"
        @cell-click="cellClick"
      >
        <column :columnOption="columnOption" v-show="data.length">
          <column-default ref="columnDefault" slot="header">
            <template slot-scope="{ row, index }" slot="expand">
              <slot :row="row" :index="index" name="expand"></slot>
            </template>
          </column-default>
          <template v-for="item in mainSlot" slot-scope="scope" :slot="item">
            <slot v-bind="scope" :name="item"></slot>
          </template>
          <column-menu slot="footer">
            <template v-slot:menu="scope">
              <slot name="menu" v-bind="scope"></slot>
            </template>
          </column-menu>
        </column>
        <template v-slot:empty>
          <slot
            name="empty"
            v-show="!data.length"
            v-if="option.emptySlot"
          ></slot>
          <el-empty
            v-else
            :image-size="100"
            :description="option.emptyText || '暂无数据'"
          ></el-empty>
        </template>
      </el-table>
    </div>
    <!-- 分页 -->
    <table-page ref="tablePage" :page="page">
      <template slot="page">
        <slot name="page"></slot>
      </template>
    </table-page>
  </div>
</template>

<script>
import headerSearch from './headerSearch.vue'
import tablePage from './tablePage.vue'
import column from './column.vue'
import columnDefault from './columnDefault.vue'
import columnMenu from './columnMenu.vue'
import slot from './slot.js'
import { vaildData } from '@/utils/validate'
import config from './config.js'

export default {
  name: 'jwCrud',
  mixins: [slot],
  provide() {
    return {
      crud: this,
    }
  },
  components: {
    headerSearch,
    tablePage,
    column,
    columnDefault,
    columnMenu,
  },
  props: {
    // 显示的数据
    data: {
      type: Array,
      required: true,
      default: () => [],
    },
    // 组件配置属性
    option: {
      type: Object,
      require: true,
      default: () => {
        return {}
      },
    },
    // 分页配置选项
    page: {
      type: Object,
      default() {
        return {}
      },
    },
    // 搜索内容
    search: {
      type: Object,
      default() {
        return {}
      },
    },
    // 表格loading状态
    tableLoading: {
      type: Boolean,
      default: false,
    },
    // 行样式
    rowClassName: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      tableSelect: [],
      vaildData,
      config,
    }
  },
  computed: {
    rowKey() {
      return this.option.rowKey || 'id'
    },
    columnOption() {
      return this.option.column || []
    },
    searchSlot() {
      return this.getSlotList(['Search'], this.$scopedSlots, this.columnOption)
    },
    mainSlot() {
      let result = []
      this.columnOption.forEach((item) => {
        if (this.$scopedSlots[item.prop]) result.push(item.prop)
      })
      return this.getSlotList(
        ['Header', 'Form'],
        this.$scopedSlots,
        this.columnOption
      ).concat(result)
    },
  },
  methods: {
    handleGetRowKeys(row) {
      const rowKey = row[this.rowKey]
      return rowKey
    },
    // 选中实例
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.table.toggleRowSelection(row)
        })
      } else {
        this.$refs.table.clearSelection()
      }
    },
    toggleRowSelection(row, selected) {
      this.$refs.table.toggleRowSelection(row, selected)
    },
    // 选择回调
    selectionChange(val) {
      this.tableSelect = val
      this.$emit('selection-change', this.tableSelect)
    },
    // 单个选择回调
    select(selection, row) {
      this.$emit('select', selection, row)
    },
    // 点击勾选全选 Checkbox
    selectAll(selection) {
      this.$emit('select-all', selection)
    },
    // 排序回调
    sortChange(sort) {
      this.$emit('sort-change', sort)
    },
    // 重新初始化搜索区域
    searchAreaInit(bol) {
      this.$refs.headerSearch.$refs.searchExpand.init(bol)
    },
    cellClick(row, column, cell, event) {
      this.$emit('cell-click', row, column, cell, event)
    },
  },
}
</script>

<style lang="scss" scoped>
.table-wrap {
  border: 1px solid #ebeef5;
  border-bottom: none;
  & ::v-deep thead th {
    background-color: #fafafa;
  }
  & ::v-deep .el-table__body-wrapper {
    /*滚动条样式*/
    &::-webkit-scrollbar {
      /*高宽分别对应横竖滚动条的尺寸*/
      width: 6px;
      height: 10px;
    }
    &::-webkit-scrollbar-thumb {
      /*滚动条里面小方块*/
      border-radius: 5px;
      background: #d8d8d8;
    }
    &::-webkit-scrollbar-track {
      /*滚动条里面轨道*/
      border-radius: 0;
    }
    &::-webkit-scrollbar-thumb:hover {
      background: #c8c8c8;
    }
  }
  &::v-deep .el-table__empty-block {
    width: auto !important;
  }
}
</style>
