// const Host ='http://localhost/wxrunapi/';
const Host = 'https://itliming.cn/wxrunapi/';


//let upData = $.extend({}, SessionObj, data)//合并两个对象。

const Login = function(data,callback){
  wx.showLoading({
    title: '登录中...',
  })
  wx.request({
    url: `${Host}Login/index`,
    method: "POST",
    header: {
      "content-type": "application/x-www-form-urlencoded"
    },
    data: data,
    success: function (res) {
      wx.hideLoading()
      return typeof callback == "function" && callback(res.data)
    },
    fail: function (error) {
      wx.hideLoading()
      return typeof callback == "function" && callback(false)  
    }
  })
}
const UpHead = function (data, SessionObj,callback){
  wx.showLoading({
    title: '上传中...',
  })
  wx.uploadFile({
    url: `${Host}Index/uphead`,
    filePath: data,
    name: 'file',
    formData: SessionObj,
    success: function (res) {
      wx.hideLoading()
      console.log(res)
      return typeof callback == "function" && callback(JSON.parse(res.data))
    },
    fail: function (error) {
    //  console.log(error)
      wx.hideLoading()
      return typeof callback == "function" && callback(false)  
    }
  })
}


module.exports= {
  Login: Login,
  UpHead: UpHead,
}