Page({
  data: {
    userInfo: [],
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
    try {
      let userInfo = wx.getStorageSync('userInfo')
      if (userInfo) {
        this.setData({
          userInfo: userInfo
        })
      }
    } catch (e) {
      console.log(e);
    }
  },
})
