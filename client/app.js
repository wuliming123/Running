App({
  onLaunch: function () {
    let that = this;
    that.globalData.userInfo = wx.getStorageSync('userInfo')
  },
  globalData: {
    userInfo: null,
    fresh:0,  //页面刷新
  },
})