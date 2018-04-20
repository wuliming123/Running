const App = getApp()
Page({
  data: {
    userInfo: null,
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
    this.setData({ userInfo: App.globalData.userInfo })
  },
  /**
  * 用户点击右上角分享
  */
  onShareAppMessage: function () {
  }
})
