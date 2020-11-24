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

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
