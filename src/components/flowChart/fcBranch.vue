<!--
 * @Author: xwt
 * @Date: 2020-09-27 11:35:13
 * @LastEditors: xwt
 * @LastEditTime: 2020-10-10 10:59:51
 * @Description: Do not edit
 * @FilePath: \flow-chart\src\components\flowChart\fcBranch.vue
-->
<template>
  <div class="branch fc-row">
    <div class="branch-box">
      <div class="add-branch" @click="addCondition">+</div>
      <div class="col-box" v-for="(item, i) in children" :key="i">
        <fcConditionNode
          :data="item"
          :isRowBeginNode="i == 0"
          :isRowEndNode="i == children.length - 1"
          :parentData="parentData"
          :parentIndex="index"
          :children="children"
          :childrenIndex="i"
        />
      </div>
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
  name: 'fcBranch',
  components: {
    fcConditionNode: () => import('./fcConditionNode'),
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
    parentData: {
      type: Array,
      default: () => [],
      required: true,
    },
    index: {
      type: Number,
      default: 0,
      required: true,
    },
  },
  computed: {
    children() {
      return this.data.children
    },
  },
  methods: {
    addCondition() {
      this.data.children.push({ type: 'condition' })
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
.branch-box {
  min-height: 180px;
  border-bottom: 2px solid #dfdfe8;
  border-top: 2px solid #dfdfe8;
  position: relative;
  display: flex;
}
.add-branch {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #f5bc21;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
  position: absolute;
  left: calc(50% - 10px);
  top: -12px;
  cursor: pointer;
  z-index: 1;
  color: #fff;
}
.condition-node-box {
  padding: 30px 50px 0;
}
</style>