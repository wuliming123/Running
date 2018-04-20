const Api = require("./api/api.js")
const App = getApp()
Page({
  data: {
    objUsers: [],
    userid:''
  },
  onLoad: function (options) { 
    let that = this
    wx.setNavigationBarTitle({
      title: options.title//页面标题为路由参数
    })
    that.setData({ userid: options.userid})
  },
  onShow:function(){
    let that = this
    let data = {
      "token": App.globalData.userInfo.token,
      'id': App.globalData.userInfo.id,
      'userid': that.data.userid
    }
    Api.GetFensi(data, function (res) {
      if (res.code) {
        that.setData({ objUsers: res.data })
      }
    })
  }
})