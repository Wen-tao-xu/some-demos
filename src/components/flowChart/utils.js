/*
 * @Author: xwt
 * @Date: 2020-09-29 16:54:31
 * @LastEditors: xwt
 * @LastEditTime: 2020-09-29 16:56:54
 * @Description: Do not edit 
 * @FilePath: \flow-chart\src\components\flowChart\utils.js
 */
export const getComponent = (type) => {
  let result = 'fcDealNode'
  if(type === 'condition') {
    result = 'fcBranch'
  }
  return result
}