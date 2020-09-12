var base64 = require('../../images/base64')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    showSearchBar: true,
    pullBottom: false,
    inputShowed: false,
    inputVal: '',
    startPullDownRef: false,
    showSize: 10,
    currentSize: 0,
    icon20: '',
    icon60: '',
    articles: [],
    imageBox: '/images/icon/k11.png',
    inImage: '/images/icon/k10.png',
    outImage: '/images/icon/k11.png',
    billUnitArray: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      icon20: base64.icon20,
      icon60: base64.icon60,
      showSize: 10,
    })
  },
  onReachBottom: function () {
    var currentSize = this.data.currentSize
    var showSize = this.data.showSize
    if (currentSize >= showSize) {
      //表示有更多的数据
      var newShowSize = showSize + 10
      this.data.showSize = newShowSize
      this.setData({
        pullBottom: true,
      })
      this.onShowBillData()
      this.setData({
        pullBottom: false,
        showSize: newShowSize,
      })
    }
  },
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading()
    if (!this.startPullDownRef) {
      this.startPullDownRef = true
      this.onShowBillData()
      this.startPullDownRef = false
    }

    wx.stopPullDownRefresh()

    wx.hideNavigationBarLoading()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},
  onShowBillData: function () {
    wx.showLoading({
      title: '正在努力加载',
    })
    var showSize = this.data.showSize
    var currentSize = 0
    var billUnitArray = new Array()
    try {
      var res = wx.getStorageInfoSync()
      for (let j = 0, i = res.keys.length - 1; j < showSize && i >= 0; --i) {
        if (res.keys[i] == 'logs') {
          continue
        }
        var billUnit = {
          id: 0,
          image: '',
          title: '',
          time: '',
          detail: '',
          dd: '',
        }
        var resValue = wx.getStorageSync(res.keys[i])
        billUnit.id = new Number(resValue.id)
        billUnit.time = resValue.date + ' ' + resValue.time
        billUnit.detail = resValue.areaType + ':' + resValue.textArea
        billUnit.dd = resValue.textArea
        switch (resValue.bType) {
          case 0: {
            //支出
            billUnit.title = '支出:' + resValue.money + '元'
            billUnit.image = this.data.outImage
            break
          }
          case 1: {
            //收入
            billUnit.title = '收入:' + resValue.money + '元'
            billUnit.image = this.data.inImage
            break
          }
          default:
            console.error('发生异常')
            break
        }
        billUnitArray.push(billUnit)
        currentSize += 1
        ++j
      }
      this.setData({
        billUnitArray: billUnitArray,
        currentSize: currentSize,
      })
    } catch (e) {
      console.error(e)
    }
    setTimeout(function () {
      wx.hideLoading()
    }, 500)
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.onShowBillData()
  },
  bindTouchmove: function (e) {
    var appThis = this
    var billUnitArray = appThis.data.billUnitArray
    var numValue = new String(billUnitArray[e.currentTarget.dataset.index].id)
    var keyValue = new String(numValue)
    wx.showModal({
      title: '是否删除',
      content: '点击确认将删除本条账单',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorage({
            key: keyValue,
            success: function (res) {
              wx.showToast({
                title: '成功删除',
                icon: 'success',
              })
              billUnitArray.splice(numValue, 1)
              appThis.setData({
                billUnitArray,
              })
              appThis.onShow()
            },
            fail: function (res) {
              wx.showToast({
                title: '删除失败',
                icon: 'loading',
              })
            },
          })
        }
      },
    })
  },
  switchToTally: function () {
    wx.switchTab({
      url: '/pages/show/show',
    })
  },
  showInput: function () {
    this.setData({
      inputShowed: true,
    })
  },
  hideInput: function () {
    this.setData({
      showSize: 10,
      currentSize: 0,
      inputVal: '',
      inputShowed: false,
    })
    this.onShowBillData()
  },
  clearInput: function () {
    this.setData({
      inputVal: '',
      showSize: 10,
      currentSize: 0,
    })
    this.onShowBillData()
  },
  inputTyping: function (e) {
    wx.showLoading({
      title: '正在努力搜索',
    })
    var currentSize = 0
    var inputValue = e.detail.value
    var regExp = new RegExp(inputValue)
    var billUnitArray = new Array()
    try {
      var res = wx.getStorageInfoSync()
      for (
        let j = 0, i = res.keys.length - 1;
        j < this.data.showSize && i >= 0;
        --i
      ) {
        if (res.keys[i] == 'logs') {
          continue
        }
        var resValue = wx.getStorageSync(res.keys[i])
        var bType = resValue.bType == 0 ? '支出' : '收入'
        var searchStr =
          bType +
          ' ' +
          resValue.date +
          ' ' +
          resValue.time +
          ' ' +
          resValue.money
        searchStr += resValue.areaType + ' ' + resValue.textArea
        if (searchStr.match(regExp)) {
          var billUnit = { id: 0, image: '', title: '', time: '', detail: '' }
          billUnit.id = new Number(resValue.id)
          billUnit.time = resValue.date + ' ' + resValue.time
          billUnit.detail = resValue.areaType + ',' + resValue.textArea
          switch (resValue.bType) {
            case 0: {
              //支出
              billUnit.title = '支出:' + resValue.money + '元'
              billUnit.image = this.data.outImage
              break
            }
            case 1: {
              //收入
              billUnit.title = '收入:' + resValue.money + '元'
              billUnit.image = this.data.inImage
              break
            }
            default:
              console.error('发生异常')
              break
          }
          billUnitArray.push(billUnit)
          currentSize += 1
          ++j
        }
      }
    } catch (e) {
      console.error(e)
    }
    this.setData({
      inputVal: e.detail.value,
      billUnitArray: billUnitArray,
      currentSize: currentSize,
    })
    wx.hideLoading()
  },
})
