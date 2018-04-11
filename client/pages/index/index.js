var app = getApp()
Page({
  data: {
    userInfo:[],
    motto: "首页",
    // 轮播图
    swiperPic: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    testPic:9,
    testM:5
  },
  onLoad:function(re){
 
  },
  onShow:function(){
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
  }
})