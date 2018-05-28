const App = getApp()
import { getRunList } from "./api/api.js"
Page({
  data: {
    runlist:[]
  },
  onLoad: function (options) {
  },
  onShow: function () {
    let that = this
    getRunList(function(re){
      that.setData({ runlist : re.data})
    })
  },
  //查看个人资料
  gotowho: function (e) {
    if (!App.globalData.userInfo.token) {
      wx.navigateTo({
        url: '/pages/login/index',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    }else{
      var id = e.currentTarget.dataset.id;
      var name = e.currentTarget.dataset.name;
      wx.navigateTo({
        url: `../user/who?id=${id}&title=${name}的主页`
      })
    }
  },
  //单击开始跑步按钮
  gotorun: function () {
    if (!App.globalData.userInfo.token) {
      wx.navigateTo({
        url: '/pages/login/index',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else {     
      wx.navigateTo({
        url: `./run`
      })
    }
  }
})