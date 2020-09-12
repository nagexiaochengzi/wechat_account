//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: (res) => {
      
      },
    })

    wx.cloud.init({
      traceUser: true,
    })
  },
  globalData: {},
  formatNumber: function (n) {
    return n >= 10 ? n : '0' + n
  },
})
