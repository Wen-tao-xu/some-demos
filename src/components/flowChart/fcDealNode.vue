<!--
 * @Author: xwt
 * @Date: 2020-09-27 11:34:12
 * @LastEditors: xwt
 * @LastEditTime: 2020-10-10 11:00:55
 * @Description: Do not edit
 * @FilePath: \flow-chart\src\components\flowChart\fcDealNode.vue
-->
<template>
  <div class="deal-node fc-row">
    <div class="node-content audit-background">
      <p>普通节点</p>
      <i class="del-btn" @click="onDeleteNode" v-if="showDeleteBtn">X</i>
    </div>
    <div class="line-in-middle">
      <div class="line"></div>
      <fcAddBar @onHandleMenu="onHandleMenu" />
    </div>
  </div>
</template>

<script>
import fcAddBar from './fcAddBar'
export default {
  name: 'fcDealnode',
  components: {
    fcAddBar,
  },
  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      },
      required: true,
    },
    index: {
      type: Number,
      default: 0,
      required: true,
    },
    parentData: {
      type: Array,
      default: () => [],
      required: true,
    },
    showDeleteBtn: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {}
  },
  methods: {
    onDeleteNode() {
      this.parentData.splice(this.index, 1)
    },
    onHandleMenu(type) {
      let obj = { type }
      if (type === 'condition') {
        obj.children = [{ type }, { type }]
      }
      this.parentData.splice(this.index + 1, 0, obj)
    },
  },
}
</script>

<style scoped>
.deal-node-wrap {
  display: flex;
  align-items: center;
  flex-direction: column;
}
</style>