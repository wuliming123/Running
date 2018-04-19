const Api = require("./utils/api.js");
//app.js
App({
  onLaunch: function () {
    var that = this;
    //小程序初始化先判断用户是否登录    
    wx.checkSession({
      success: function () {
        try {
          let value =  wx.getStorageSync('userInfo')
          if (value) {
          
          }else{
            that.login() //重新登录
          }
        } catch (e) {
          that.login() //重新登录
        }
       
      },
      fail: function () {
        // console.log("登录态过期");
        that.login() //登录态过期,重新登录
      }
    })

  },
  login: function () {
    var that = this;
    wx.login({
      success: function (res) {
        // console.log('吴黎明:wx.login得到code码', res);
        wx.getUserInfo({
          withCredentials: true,
          lang:"zh_CN",
          success: function (userinfo) {
          //  console.log('吴黎明：wx.getUserInfo', userinfo)
            let data = {"code": res.code,"encryptedData": userinfo.encryptedData,"iv": userinfo.iv}
            //调用登录api
            Api.Login(data,function(re){
              if(re){
                console.log('服务器返回数据', re)
                that.setInfo(re.data)
              }else{
                wx.showLoading({
                  title: '登录失败',
                })
              }
            })
            

          },
          fail:function(error){
            wx.showLoading({
              title: '删除后再进入',
            })
          }
        })
      }
    })
  },

  setInfo: function (data) {   //将用户信息缓存保存
    wx.setStorageSync('userInfo', data)
  },
})