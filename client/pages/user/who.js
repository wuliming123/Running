import { DelGuanzhuUser, AddGuanzhuUser, GetUserInfo, ShowHisPlan, GetRunData } from './api/api.js'
const App = getApp()
var sliderWidth = 96 // 需要设置slider的宽度，用于计算中间位置
Page({
  data: {
    tabs: ["资料", "动态", "Run"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    who: null,
    phone:'',
    age:'',
    birth:'',
    statusxianghuguanzhu:null,//页面加载后把是否为相互关注状态存储起来。
    hisArticleList:[],
    hisRunData: []
  },
  //单击相互关注按钮,调用接口取消关注此人
  tapXianghuGuanzhu: function () {
    var that = this
    //我的信息：token和id，取消关注的人的id叫userid
    let data = { 
      "token": App.globalData.userInfo.token,
      'id': App.globalData.userInfo.id,
      'userid': that.data.who.id 
    }
    DelGuanzhuUser(data, function (res) {
      if (res.code) {
        let up = `who.xianghuguanzhu`
        let us = `who.yiguanzhu`
        that.setData({ [up]: false})
        that.setData({ [us]: false})
      }
    })
  },
  //单击关注按钮,调用接口关注此人
  tapGuanzhu:function(){
    var that = this;
    // 被我关注人的id为：this.data.who.id
    let data = { 
      "token": App.globalData.userInfo.token,
      'id': App.globalData.userInfo.id,
      'userid': that.data.who.id
    }
    AddGuanzhuUser(data, function (res) {
      if (res.code) {
        if (that.data.statusxianghuguanzhu) {
          let up = `who.xianghuguanzhu`
          let ua = `who.yiguanzhu`
          that.setData({[up]:true})
          that.setData({[ua]: true})
        } else {
          let ua = `who.yiguanzhu`
          that.setData({ [ua]: true })
        }
      }
    })
  },
  //单击已关注按钮,调用接口取消关注此人
  tapQuxiaoGuanzhu: function () {
    var that = this
    //我的信息：token和id，取消关注的人的id叫userid
    let data = { 
      "token": App.globalData.userInfo.token,
      'id': App.globalData.userInfo.id, 
      'userid': that.data.who.id
    }
    DelGuanzhuUser(data, function (res) {
      if (res.code) {
        let up = `who.xianghuguanzhu`
        let ua = `who.yiguanzhu`
        that.setData({[up]: false})
        that.setData({[ua]: false})
      }
    })
  },
  onLoad: function (options) {
    
    if (options.id == App.globalData.userInfo.id){
      wx.switchTab({
        url: "/pages/user/me",
      })
    }
    var that = this;
    that.setData({who:options})
    //资料选项卡获取用户资料
    wx.setNavigationBarTitle({
      title: options.title//页面标题为路由参数
    })
    let data = { 
      "token": App.globalData.userInfo.token,
      'id': App.globalData.userInfo.id,
      'userid': options.id
    }
    GetUserInfo(data,function(res){
      if (res.code) {
        that.setData({ who: res.data })
        //进入本页面获取用户数据，并把用户有些数据状态起来
        if (res.data.dateOfBirth){
          let dateOfBirth = new Date(res.data.dateOfBirth * 1000)
          let age = new Date().getFullYear() - dateOfBirth.getFullYear() + "岁"
          let m = dateOfBirth.getMonth() + 1
          let d = dateOfBirth.getDate()
          let birth = `${m<10?'0'+m:m}月${d<10?'0'+d:d}日`
          that.setData({ age: age, birth: birth})//通过出生日期时间戳，获取用户的年龄
        }
        if (res.data.phone) {
          that.setData({ phone: res.data.phone.substr(0, 3)+"*****" + res.data.phone.substr(-3) })
        }
        that.setData({ statusxianghuguanzhu: res.data.xianghuguanzhu })
      }
    })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });

    let data1 = { userid: options.id }
    GetRunData(data1, function (re) {
      that.setData({ hisRunData: re.data })
    })
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  //预览头像
  previewImg: function () {
    wx.previewImage({
      urls: [this.data.who.avatarUrl]
    })
  },
  onShow: function () {
    let that = this
    let data = { id: App.globalData.userInfo.id, token: App.globalData.userInfo.token ,userid:that.data.who.id}
    ShowHisPlan(data, function (re) {
      that.setData({ hisArticleList: re.data })
    })
  },
  onPullDownRefresh: function () {
  },
  onShareAppMessage: function () {
  }
})