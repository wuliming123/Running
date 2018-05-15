// const Host = 'http://localhost/wxrunapi/';
const Host = 'https://itliming.cn/wxrunapi/';
// const Host = "http://localhost/running/server/public/index.php/wxrunapi/";

//post普通数据传送
const generalPost = function ( model ,data, callback) {
  wx.showLoading({
    title: '加载中...',
    mask: true
  })
  wx.request({
    url: `${Host}Home/${model}`,
    method: "POST",
    header: {
      "content-type": "application/x-www-form-urlencoded"
    },
    data: data,
    success: function (res) {
      if (res.data.code) {
        wx.hideLoading()
      } else {
        wx.showLoading({
          title: '加载失败...',
          mask: true
        })
      }
      return typeof callback == "function" && callback(res.data)
    },
    fail: function (error) {
      return typeof callback == "function" && callback(false)
    }
  })
}

//修改资料页面的头像上传
const upPic = function (data, SessionObj, callback) {
  wx.showLoading({
    title: '上传中...',
  })
  wx.uploadFile({
    url: `${Host}Home/upPic`,
    filePath: data,
    name: 'file',
    formData: SessionObj,
    success: function (res) {
      wx.hideLoading()
      return typeof callback == "function" && callback(JSON.parse(res.data))
    },
    fail: function (error) {
      //  console.log(error)
      wx.hideLoading()
      return typeof callback == "function" && callback(false)
    }
  })
}

//登录验证
const login = function(){
  if (!wx.getStorageSync('userInfo')) {
    wx.navigateTo({
      url: '/pages/login/index',
      success: function (res) {},
      fail: function (res) { },
      complete: function (res) { },
    })
  }
}

module.exports = {
  generalPost: generalPost,
  upPic:upPic,
  login:login
}