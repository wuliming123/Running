const Host = 'https://itliming.cn/wxrunapi/';
const getRunList = function (callback) {
  wx.request({
    url: `${Host}Run/getall`,
    method: "POST",
    header: {
      "content-type": "application/x-www-form-urlencoded"
    },
    data: null,
    success: function (res) {
      return typeof callback == "function" && callback(res.data)
    },
    fail: function (error) {
      return typeof callback == "function" && callback(false)
    }
  })
}
//post普通数据传送
const upRunData = function (data,callback) {
  wx.request({
    url: `${Host}Run/save`,
    method: "POST",
    header: {
      "content-type": "application/x-www-form-urlencoded"
    },
    data: data,
    success: function (res) {
      return typeof callback == "function" && callback(res.data)
    },
    fail: function (error) {
      return typeof callback == "function" && callback(false)
    }
  })
}

module.exports = {
  getRunList: getRunList,
  upRunData: upRunData,
}