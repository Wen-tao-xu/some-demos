/*
 * @Author: xwt
 * @Date: 2020-11-24 16:10:01
 * @LastEditors: xwt
 * @LastEditTime: 2020-11-24 16:22:49
 * @Description: Do not edit
 * @FilePath: \some-demos\src\main.js
 */
import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);

//复制粘贴指令
Vue.directive('paste', {
  bind(el, binding) {
    el.addEventListener('paste', function (event) {
      //这里直接监听元素的粘贴事件
      binding.value(event)
    })
  },
})

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
