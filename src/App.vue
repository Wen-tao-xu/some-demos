<!--
 * @Author: xwt
 * @Date: 2020-09-27 10:21:55
 * @LastEditors: xwt
 * @LastEditTime: 2020-11-24 16:42:38
 * @Description: Do not edit
 * @FilePath: \some-demos\src\App.vue
-->
<template>
  <div id="app">
    <el-select class="fixed" v-model="selection" placeholder="请选择">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
    </el-select>
    <flowChart />
  </div>
</template>

<script>
import flowChart from '@/components/flowChart'
export default {
  name: 'App',
  components: {
    flowChart,
  },
  data() {
    return {
      selection: 'flow-chart',
      options: [
        {
          value: 'flow-chart',
          label: '流程图'
        },
      ]
    }
  }
}
</script>

<style>
body,
html {
  margin: 0;
  position: relative;
  height: 100%;
  -webkit-font-smoothing: antialiased;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
  min-height: 100%;
  position: relative;
}
.fixed {
  position: fixed !important;
  top: 10px;
  left: 20px;
  z-index: 100;
}
</style>
