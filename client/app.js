const Api = require("./utils/api.js");
App({
  onLaunch: function () {
    let that = this;
    wx.checkSession({//小程序初始化先判断用户是否登录    
      success: function () {
        try {
          if (!(that.globalData.userInfo=wx.getStorageSync('userInfo'))) {
            that.login() //重新登录
          }
        } catch (e) {
          that.login() //重新登录
        }
      },
      fail: function () {
        that.login() //登录态过期,重新登录
      }
    })
  },
  login: function () {
    let that = this;
    return new Promise(function (resolve, reject) {
      wx.login({
        success: function (res) {
          console.log('吴黎明:wx.login得到code码', res);
          if(res.code){
            wx.getUserInfo({
              withCredentials: true,
              lang:"zh_CN",
              success: function (userinfo) {
                let data = {"code": res.code,"encryptedData": userinfo.encryptedData,"iv": userinfo.iv}
                Api.Login(data, function (re) {//调用后台登录api
                  if(re.code){
                    that.globalData.userInfo=re.data
                    wx.setStorageSync('userInfo', re.data)
                  }
                  resolve(re);
                })
              },
              fail:function(error){
                wx.showModal({
                  content: '未授权无法使用',
                  showCancel: false,
                  success: function (re) {
                    if (re.confirm){
                     that.openSetting()
                    }
                  }
                })
              }
            })
          }else{
            reject('没有获取到code');
          }
        }
      })
    })
  },
  globalData: {
    userInfo: null
  },
  //跳转设置页面授权
  openSetting: function () {
    var that = this
    if (wx.openSetting) {
      wx.openSetting({
        success: function (res) {
          that.login()//尝试再次登录
        }
      })
    } else {
      wx.showModal({
        title: '授权提示',
        content: '小程序需要您的微信授权才能使用哦~ 错过授权页面的处理方法：删除小程序->重新搜索进入->点击授权按钮'
      })
    }
  }
})