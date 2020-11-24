<!--
 * @Author: xwt
 * @Date: 2020-09-27 17:38:09
 * @LastEditors: xwt
 * @LastEditTime: 2020-09-30 15:09:52
 * @Description: Do not edit
 * @FilePath: \flow-chart\src\components\flowChart\fcAddBar.vue
-->
<template>
  <div class="add-bar-wrap">
    <button class="add-bar" @click="showToolList">+</button>
    <div class="tool-tip" v-show="isShow" @click="onHandleMenu">
      <div class="tool-item" data-type="dealNode">添加节点</div>
      <div class="tool-item" data-type="condition">添加分支</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'fcAddBtn',
  data() {
    return {
      isShow: false,
    }
  },
  methods: {
    showToolList() {
      this.isShow = !this.isShow
    },
    onHandleMenu(e) {
      let handleType = e.target.dataset.type
      if (handleType) {
        this.$emit('onHandleMenu', handleType)
      }
      this.isShow = !this.isShow
    },
  },
}
</script>

<style scoped>
.add-bar-wrap {
  width: 100%;
  padding: 30px 0;
  display: flex;
  justify-content: center;
  flex-shrink: 0;
  flex-grow: 1;
  position: relative;
}
.add-bar {
  width: 30px;
  height: 30px;
  background-color: #fff;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  cursor: pointer;
  z-index: 1;
  position: relative;
  outline: none;
  border: none;
  color: #f5bc21;
  transition: all 0.2s ease;
}
.add-bar:hover {
  background-color: #f5bc21;
  color: #fff;
}
.tool-tip {
  position: absolute;
  top: 30px;
  left: 58%;
  z-index: 100;
  width: 200px;
  box-sizing: border-box;
  font-size: 14px;
  text-align: left;
  padding: 10px 0;
  color: #2b3441;
  background-color: #fff;
  background-clip: padding-box;
  border-radius: 4px;
  box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.12),
    0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05);
}
.tool-item {
  padding: 7px 10px 7px 15px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.tool-item:hover {
  background: #ebebf0;
}
</style>