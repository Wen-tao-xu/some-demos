<template>
  <div class="expand" v-if="showSearchBtn">
    <div ref="form" class="form-wrap">
      <div
        class="form"
        :class="{
          inline: isInline,
        }"
      >
        <div ref="content" style="flex: 1">
          <slot />
        </div>
        <div class="search-btn-wrap">
          <slot name="searchButton" v-bind="{ size: 'small' }">
            <el-button type="primary" size="small" @click="searchChange"
              >查询</el-button
            >
            <el-button size="small" @click="searchReset">清空</el-button>
          </slot>
        </div>
      </div>
    </div>
    <div class="expand-search" v-if="scrollHeight > lineHeight">
      <el-button type="text" style="padding: 0" @click="handleMoreSearchOption"
        >{{ showMoreSearchOption ? '收起' : '更多查询条件' }}
        <i
          :class="[
            showMoreSearchOption ? 'el-icon-arrow-up' : 'el-icon-arrow-down',
          ]"
        ></i
      ></el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'searchExpand',
  props: {
    isInline: {
      type: Boolean,
      default: false,
    },
    showSearchBtn: {
      type: Boolean,
      default: true,
    },
    isSimple: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showMoreSearchOption: false,
      lineHeight: 50,
      scrollHeight: 0,
    }
  },
  mounted() {
    this.init(true)
  },
  methods: {
    init(bol) {
      let dom = this.$refs.form
      if (!dom || this.isSimple) return
      this.scrollHeight = dom.childNodes[0]?.scrollHeight
      dom.style.height = bol ? `${this.lineHeight}px` : `${this.scrollHeight}px`
      this.showMoreSearchOption = !bol
    },
    // 更多查询条件
    handleMoreSearchOption(bol) {
      if (typeof bol === 'boolean') {
        this.showMoreSearchOption = bol
      } else {
        this.showMoreSearchOption = !this.showMoreSearchOption
      }
      this.init(!this.showMoreSearchOption)
    },
    // 搜索回调
    searchChange() {
      this.$emit('search-change')
    },
    // 搜索清空
    searchReset() {
      this.$emit('search-reset')
    },
  },
}
</script>

<style scoped>
.form-wrap {
  overflow: hidden;
  transition: 0.2s height ease-in-out;
}
.form {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.search-btn-wrap {
  display: flex;
  align-items: flex-start;
}
.inline {
  justify-content: flex-start;
}
.expand-search {
  margin-bottom: 15px;
}
</style>
