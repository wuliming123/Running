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
  },
  //预览头像
  previewImg: function () {
    wx.previewImage({
      urls: [this.data.userInfo.avatarUrl]
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
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
  },
  /**
  * 用户点击右上角分享
  */
  onShareAppMessage: function () {
  },
  setting:function(){
    wx.openSetting({
      success: (res) => {
           
      }
    })
  }

})
