<template>
  <div
    class="header-search"
    :style="{
      paddingBottom: searchOption.length ? '10px' : 0,
    }"
  >
    <search-expand
      ref="searchExpand"
      :isInline="searchOption.length <= 2"
      :showSearchBtn="searchOption.length > 0"
      @search-change="searchChange"
      @search-reset="searchReset"
    >
      <dynamicForm :search="search" :searchOption="searchOption">
        <template
          slot-scope="scope"
          v-for="slotName in crud.searchSlot"
          :slot="slotName"
        >
          <slot v-bind="scope" :name="slotName"></slot>
        </template>
      </dynamicForm>
    </search-expand>
  </div>
</template>

<script>
import dynamicForm from './dynamicForm.vue'
import searchExpand from './searchExpand.vue'
export default {
  name: 'headerSearch',
  inject: ['crud'],
  components: {
    dynamicForm,
    searchExpand,
  },
  props: {
    search: {
      type: Object,
      default: () => {
        return {}
      },
      required: true,
    },
    options: {
      type: Array,
      default: () => {
        return []
      },
      required: true,
    },
  },
  data() {
    return {
      scrollHeight: 0,
    }
  },
  computed: {
    searchOption() {
      let result = []
      this.options.forEach((el) => {
        if (el.search && !el.expandSearch) {
          result.push({
            ...el,
            type: this.getSearchType(el),
            placeholder: this.getPlaceholder(el),
          })
        }
      })
      return result
    },
  },
  watch: {
    searchOption() {
      this.$nextTick(() => {
        this.$refs.searchExpand.init(true)
      })
    },
  },
  methods: {
    // 搜索回调
    searchChange() {
      this.$emit('search-change', this.getSearchForm())
      this.crud.$emit('search-change', this.getSearchForm())
    },
    // 搜索清空
    searchReset() {
      Object.keys(this.search).forEach((key) => {
        this.search[key] = null
      })
    },
    getSearchForm() {
      let form = this.deepClone(this.search)
      for (let key in form) {
        if (form[key] === null || form[key === '']) {
          delete form[key]
        }
      }
      return form
    },
    getSearchType(column) {
      const type = column.type || 'input'
      let result = type
      if (['radio', 'checkbox', 'switch'].includes(type)) {
        result = 'select'
      }
      return result
    },
    getPlaceholder(column) {
      let placeholder = column.placeholder
      let type = column.type || 'input'
      if (['select', 'cascader'].includes(type)) {
        placeholder = '请选择'
      } else {
        placeholder = '请输入'
      }
      return placeholder
    },
  },
}
</script>

<style lang="scss" scoped>
.header-search {
  padding-bottom: 10px;
  // ::v-deep .el-form--inline .el-form-item {
  //   margin-right: 24px;
  //   margin-bottom: 14px;
  // }
}
</style>
