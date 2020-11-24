<!--
 * @Author: xwt
 * @Date: 2020-09-27 16:20:32
 * @LastEditors: xwt
 * @LastEditTime: 2020-10-10 11:01:03
 * @Description: Do not edit
 * @FilePath: \flow-chart\src\components\flowChart\fcConditionNode.vue
-->
<template>
  <div class="condition-node fc-row">
    <div class="top-left-cover-line" v-if="isRowBeginNode"></div>
    <div class="top-right-cover-line" v-if="isRowEndNode"></div>
    <div class="condition-node-box">
      <div class="line"></div>
      <div class="node-content">
        <p>分支节点</p>
        <i class="del-btn" @click="onDeleteNode">X</i>
      </div>
      <fcAddBar @onHandleMenu="onHandleMenu" />
    </div>
    <div class="fc-row" v-if="data.children && data.children.length">
      <component
        :is="getComponent(item.type)"
        v-for="(item, i) in data.children"
        :key="i"
        :data="item"
        :index="i"
        :parentData="data.children"
      ></component>
    </div>
    <div class="bottom-left-cover-line" v-if="isRowBeginNode"></div>
    <div class="bottom-right-cover-line" v-if="isRowEndNode"></div>
  </div>
</template>

<script>
import fcAddBar from './fcAddBar'
import { getComponent } from './utils'
export default {
  name: 'fcConditionNode',
  components: {
    fcAddBar,
    fcDealNode: () => import('./fcDealNode'),
    fcBranch: () => import('./fcBranch'),
  },
  props: {
    isRowBeginNode: {
      type: Boolean,
      default: false,
      required: true,
    },
    isRowEndNode: {
      type: Boolean,
      default: false,
      required: true,
    },
    data: {
      type: Object,
      default: () => {},
      required: true,
    },
    parentData: {
      type: Array,
      default: () => [],
    },
    parentIndex: {
      type: Number,
      default: 0,
    },
    children: {
      type: Array,
      default: () => [],
    },
    childrenIndex: {
      type: Number,
      default: 0,
      required: true,
    },
  },
  methods: {
    onDeleteNode() {
      if (this.children.length > 2) {
        this.children.splice(this.childrenIndex, 1)
      } else {
        this.parentData.splice(this.parentIndex, 1)
      }
    },
    onHandleMenu(type) {
      let obj = { type }
      if (type === 'condition') {
        obj.children = [{ type }, { type }]
      }
      if (!this.data.children) {
        this.$set(this.data, 'children', [])
      }
      this.data.children.unshift(obj)
    },
    getComponent(type) {
      return getComponent(type)
    },
  },
}
</script>

<style scoped>
.condition-node-box {
  padding: 30px 50px 0;
  position: relative;
  flex-grow: 1;
}
</style>