// const Host = 'http://localhost/wxrunapi/';
// const Host = 'https://itliming.cn/wxrunapi/';
const Host = "http://localhost/running/server/public/index.php/wxrunapi/";

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



module.exports = {
  generalPost: generalPost
}