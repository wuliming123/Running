import { upRunData } from "./api/api.js"
const App = getApp()
var countTooGetLocation = 0;
var total_micro_second = 0;
var starRun = 0;
var totalSecond = 0;
var oriMeters = 0.0;
/* 毫秒级倒计时 */
function count_down(that) {

  if (starRun == 0) {
    return;
  }

  if (countTooGetLocation >= 100) {
    var time = date_format(total_micro_second);
    that.updateTime(time);
  }

  if (countTooGetLocation >= 5000) { //1000为1s
    that.getLocation();
    countTooGetLocation = 0;
  }


  // setTimeout
  setTimeout(function () {
    countTooGetLocation += 10;
    total_micro_second += 10;
    count_down(that);
  }
    , 10
  )
}
// 时间格式化输出，如03:25:19 86。每10ms都会调用一次
function date_format(micro_second) {
  // 秒数
  var second = Math.floor(micro_second / 1000);
  // 小时位
  var hr = Math.floor(second / 3600);
  // 分钟位
  var min = fill_zero_prefix(Math.floor((second - hr * 3600) / 60));
  // 秒位
  var sec = fill_zero_prefix((second - hr * 3600 - min * 60));// equal to => var sec = second % 60;


  return hr + ":" + min + ":" + sec + " ";
}
function getDistance(lat1, lng1, lat2, lng2) {
  var dis = 0;
  var radLat1 = toRadians(lat1);
  var radLat2 = toRadians(lat2);
  var deltaLat = radLat1 - radLat2;
  var deltaLng = toRadians(lng1) - toRadians(lng2);
  var dis = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(deltaLat / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(deltaLng / 2), 2)));
  return dis * 6378137;

  function toRadians(d) { return d * Math.PI / 180; }
}
function fill_zero_prefix(num) {
  return num < 10 ? "0" + num : num
}
Page({
  data: {
    latitude: 0,
    longitude: 0,
    covers: [],
    meters: "0.00",
    time: "0:00:00",
    startRun: false,
    stopRun:true
  },
  onLoad: function (options) {
    wx.startWifi({
      success: function (res) {
        console.log(res.errMsg)
      },
      fail: function(res){
        console.log(res);
      }  
    })
    var that = this
    wx.getLocation({
      success: function (res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
      },
      fail:function(){
        wx.showModal({
          title: '提示',
          content: '请允许应用获取地理位置，否则本功能不可用：我 -> 授权管理',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              wx.navigateBack({})
            }
          }
        })
        
      }
    })
    count_down(this);

  },
  /****
   * 点击开始跑步
   */
  starRun: function () {
    var that = this
    that.setData({
      startRun: true,
      stopRun: false,
    })
    if (starRun == 1) {
      return;
    }
    starRun = 1;
    count_down(that);
    that.getLocation();
  },
  //结束跑步
  stopingRun: function () {
    starRun = 0;
    count_down(this);
    let tarray = this.data.time.split(":")
    let upmeters = parseFloat(this.data.meters)
    let uptime = 60.0 * parseFloat(tarray[0]) + parseFloat(tarray[1]) + parseFloat(tarray[2])/60.0
    if (uptime >= 5 && upmeters >= 0.5){
      let data = { userid: App.globalData.userInfo.id, runtime: uptime, kilometer:upmeters}
      upRunData(data,function(re){//上传运动数据
        if (re.code){
          wx.showModal({
            title: '提示',
            content: '已经上传了本次运动数据',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.navigateBack({})
              }
            }
          })
        }
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '跑步时长小于5分钟或运动里程少于500米，系统没有记录本次运动数据。',
        showCancel:false,
        success: function (res) {
          if (res.confirm) {
            wx.navigateBack({})
          }
        }
      })
    }
  },
  updateTime: function (time) {
    var data = this.data;
    data.time = time;
    this.data = data;
    this.setData({
      time: time,
    })

  },
  getLocation: function () {
    var that = this
    var lat, lng
    wx.getLocation({
      type: 'gcj02', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
      success: function (res) {
        lat = res.latitude
        lng = res.longitude
        var newCover = {
          latitude: res.latitude,
          longitude: res.longitude
        };
        var oriCovers = that.data.covers;
        var len = oriCovers.length;
        var lastCover;
        if (len == 0) {
        oriCovers.push(newCover);
        }
        len = oriCovers.length;
        var lastCover = oriCovers[len - 1];
        var newMeters = getDistance(lastCover.latitude, lastCover.longitude, res.latitude, res.longitude) / 1000;
        if (newMeters < 0.0015) {
          newMeters = 0.0;
        }
        oriMeters = oriMeters + newMeters;
        var meters = new Number(oriMeters);
        var showMeters = meters.toFixed(2);
        oriCovers.push(newCover);
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          covers: oriCovers,
          meters: showMeters,
        });
      },
    })
  }
})