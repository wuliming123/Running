const App = getApp()
import { NumAboutMe, ZanAboutMe } from './api/api.js'
Page({
  data: {
    userInfo: null,
    sum:0,
    pl:0,
    hf:0,
  },
  onLoad:function(re){
    if (!App.globalData.userInfo.token) {
      wx.navigateTo({
        url: '/pages/login/index',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
  },
  //预览头像
  previewImg: function () {
    wx.previewImage({
      urls: [this.data.userInfo.avatarUrl]
    })
  },
  onShow: function () {
    if (App.globalData.userInfo.token) {
      //如果用户已经登录
      let that = this
      let data = {
        "token": App.globalData.userInfo.token,
        'id': App.globalData.userInfo.id,
      }
      NumAboutMe(data,function(res){
        that.setData({sum : res.data.sum,pl:res.data.pl,hf:res.data.hf})
        if (res.data.zan!=0){//发现有新的人给我发布的帖子点赞
            ZanAboutMe(data, function (res) {
              wx.setStorageSync('zan', res.data)
            })
          }
      });
      this.setData({ userInfo: App.globalData.userInfo })
    }
  },
  //检查登录状况
  checklogin:function(e){
    if (!App.globalData.userInfo.token) {
      wx.navigateTo({
        url: '/pages/login/index',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    }else{
      wx.navigateTo({
        url: e.currentTarget.dataset.url,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
  },
  //授权管理
  setting:function(){
    wx.openSetting({
      success: (res) => {
      }
    })
  }
})
