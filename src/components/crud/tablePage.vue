<template>
  <div
    class="table-page"
    v-if="vaildData(crud.option.pageShow, config.pageShow)"
  >
    <slot name="page"></slot>
    <el-pagination
      @size-change="sizeChange"
      @prev-click="prevClick"
      @next-click="nextClick"
      @current-change="currentChange"
      :hide-on-single-page="defaultPage.hideOnSinglePage"
      :layout="defaultPage.layout"
      :total="defaultPage.total"
      :page-size="defaultPage.pageSize"
      :page-sizes="defaultPage.pageSizes"
      :pager-count="defaultPage.pagerCount"
      :current-page.sync="defaultPage.currentPage"
      :background="defaultPage.background"
    >
    </el-pagination>
  </div>
</template>

<script>
import pagination from '@/config/pagination'
import config from './config.js'
import { vaildData } from '@/utils/validate'

export default {
  name: 'tablePage',
  inject: ['crud'],
  props: {
    page: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  data() {
    return {
      config,
      vaildData,
      defaultPage: this.deepClone(pagination),
    }
  },
  watch: {
    page: {
      handler() {
        this.pageInit()
      },
      deep: true,
    },
    //如果当前页面删除没数据了调用第一页
    'defaultPage.total'(val) {
      if (
        this.defaultPage.total ===
          (this.defaultPage.currentPage - 1) * this.defaultPage.pageSize &&
        this.defaultPage.total != 0
      ) {
        this.defaultPage.currentPage = this.defaultPage.currentPage - 1
        this.crud.$emit('on-load', this.defaultPage)
        this.crud.$emit('current-change', this.defaultPage.currentPage)
        this.updateValue()
      }
    },
  },
  created() {
    this.pageInit()
    this.crud.$emit('on-load', this.defaultPage)
  },
  methods: {
    pageInit() {
      this.defaultPage = Object.assign(this.defaultPage, this.page, {
        total: Number(this.page.total || this.defaultPage.total),
        pagerCount: Number(this.page.pagerCount || this.defaultPage.pagerCount),
        currentPage: Number(
          this.page.currentPage || this.defaultPage.currentPage
        ),
        pageSize: Number(this.page.pageSize || this.defaultPage.pageSize),
      })
      this.updateValue()
    },
    updateValue() {
      this.crud.$emit('update:page', this.defaultPage)
    },
    //下一页事件
    nextClick(val) {
      this.crud.$emit('next-click', val)
    },
    //上一页事件
    prevClick(val) {
      this.crud.$emit('prev-click', val)
    },
    // 页大小回调
    sizeChange(val) {
      this.defaultPage.currentPage = 1
      this.defaultPage.pageSize = val
      this.updateValue()
      this.crud.$emit('on-load', this.defaultPage)
      this.crud.$emit('size-change', val)
    },
    // 页码回调
    currentChange(val) {
      this.updateValue()
      this.crud.$emit('on-load', this.defaultPage)
      this.crud.$emit('current-change', val)
    },
  },
}
</script>

<style lang="scss" scoped>
.table-page {
  display: flex;
  justify-content: flex-end;
  &::v-deep .el-pagination {
    padding-top: 15px;
  }
}
</style>
