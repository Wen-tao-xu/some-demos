<!--
 * @Author: xwt
 * @Date: 2020-09-27 10:24:24
 * @LastEditors: xwt
 * @LastEditTime: 2020-10-10 11:01:11
 * @Description: Do not edit
 * @FilePath: \flow-chart\src\components\flowChart\index.vue
-->
<template>
  <div class="fc-wrap">
    <div class="fc-container fc-row">
      <component
        :is="getComponent(item.type)"
        v-for="(item, index) in flowChart"
        :key="index"
        :data="item"
        :index="index"
        :parentData="flowChart"
        :showDeleteBtn="index !== 0"
      ></component>
      <div class="end-node">结束</div>
    </div>
  </div>
</template>

<script>
import { getComponent } from './utils'
export default {
  name: 'flowChart',
  components: {
    fcDealNode: () => import('./fcDealNode'),
    fcBranch: () => import('./fcBranch'),
  },
  data() {
    return {
      flowChart: [{ type: 'dealNode' }],
    }
  },
  methods: {
    getComponent(type) {
      return getComponent(type)
    },
  },
}
</script>

<style scoped>
@import url('./style/index.css');
.fc-wrap {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  background-color: #f5f5f7;
  position: relative;
}
.fc-container {
  position: relative;
  padding: 50px 20px;
  box-sizing: border-box;
  /* transform: scale(0.5); */
  transform-origin: 0 0 0;
  min-width: min-content;
}
.end-node {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 50px;
  height: 50px;
  background: linear-gradient(-120deg, #dfdfe8 1%, #afafb8);
  box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.2);
  border-radius: 100%;
  color: #fff;
}
</style>