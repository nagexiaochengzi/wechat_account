 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasAddBill: false,
    inputShowed: false,
    inputVal: "",
    billUnitArray: [],
    pullBottom: false,
    startPullDownRef: false,
    showSize: 10,
    currentSize: 0,
    articles: [],
    imageBox: '/images/icon/k11.png',
    inImage: "/images/icon/k10.png",
    outImage: "/images/icon/k11.png",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      showSize: 10
    });
  },
  onReachBottom: function () {
    var currentSize = this.data.currentSize;
    var showSize = this.data.showSize;
    if (currentSize >= showSize) {
      //表示有更多的数据
      var newShowSize = showSize + 10;
      this.data.showSize = newShowSize;
      this.setData({
        pullBottom: true,
      })
      this.onShowBillData(this.data.inputVal);
      this.setData({
        pullBottom: false,
        showSize: newShowSize,
      })
    }
  },
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading();
    if (!this.startPullDownRef) {
      this.startPullDownRef = true;
      this.onShowBillData(this.data.inputVal);
      this.startPullDownRef = false;
    }
    wx.stopPullDownRefresh();
    wx.hideNavigationBarLoading();
  },
  onShowBillData: function(data) {
    var showSize = this.data.showSize;
    var currentSize = 0;
    var inputValue = data;
    var regExp = new RegExp(inputValue);
    var billUnitArray = new Array();
    try {
      var res = wx.getStorageInfoSync();
      for (let j = 0, i = res.keys.length - 1; j < showSize && i >= 0; --i) {
        if (res.keys[i] == "logs") {
          continue;
        }
        var resValue = wx.getStorageSync(res.keys[i]);
        var bType = resValue.bType == 0 ? "支出" : "收入";
        var searchStr = bType + " " + resValue.date + " " + resValue.time + ' ' + resValue.money;
        searchStr += resValue.areaType + " " + resValue.textArea;
        if (searchStr.match(regExp)) {
          var billUnit = { id: 0, image: '', title: "", time: "", detail: "" };
          billUnit.id = new Number(resValue.id);
          billUnit.time = resValue.date + " " + resValue.time;
          billUnit.detail = resValue.areaType + "," + resValue.textArea;
          switch (resValue.bType) {
            case 0: {//支出
              billUnit.title = "支出:" + resValue.money + "元";
              billUnit.image = this.data.outImage;
              break;
            }
            case 1: {//收入
              billUnit.title = "收入:" + resValue.money + "元";
              billUnit.image = this.data.inImage;
              break;
            }
            default: console.error("发生异常"); break;
          }
          billUnitArray.push(billUnit);
          currentSize += 1;
          ++j;
        }
      }
    } catch (e) {
      console.error(e);
    }
    this.setData({
      billUnitArray: billUnitArray,
      currentSize: currentSize,
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var hasAddBill = this.data.hasAddBill;
    var billUnitArray = this.data.billUnitArray;
    var res = wx.getStorageInfoSync();
    if (res.keys.length > 1) {
      hasAddBill = true;
    } else {
      hasAddBill = false;
    }
    this.setData({
      hasAddBill: hasAddBill,
      billUnitArray: billUnitArray,
    })
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    wx.showLoading({
      title: '正在努力搜索',
    })
    this.onShowBillData(e.detail.value);
    this.setData({
      inputVal: e.detail.value,
    });
    wx.hideLoading();
  },
  bindTouchmove: function (e) {
    var appThis = this;
    var numValue = e.currentTarget.dataset.key;
    var keyValue = new String(numValue);
    wx.showModal({
      title: '是否删除',
      content: '点击确认将删除本条账单',
      success: res => {
        if (res.confirm) {
          wx.removeStorage({
            key: keyValue,
            success: function (res) {
              wx.showToast({
                title: '成功删除',
                icon: 'success'
              })
              for (let i = 0; i < appThis.data.billUnitArray.length; ++i) {
                var billUnit = appThis.data.billUnitArray[i];
                if (billUnit.id == numValue) {
                  appThis.data.billUnitArray.splice(i, 1);
                  break;
                }
              }
              appThis.setData({
                billUnitArray: appThis.data.billUnitArray,
              })
            },
            fail: function (res) {
              wx.showToast({
                title: '删除失败',
                icon: 'loading'
              })
            }
          })
        }
      }
    })
  },
  switchToTally: function () {
    wx.switchTab({
      url: '/pages/show/show',
    })
  },
  clearFindData: function() {
    var appThis = this;
    var billUnitArray = this.data.billUnitArray;
    wx.showModal({
      title: '是否删除？',
      content: '点击确认清空所有匹配账单',
      success: res => {
        if(res.confirm) {
          wx.showLoading({
            title: '正在删除....',
          })
          for (let i = 0; i < billUnitArray.length; ++i) {
            var keyValue = new String(billUnitArray[i].id);
            try {
              wx.removeStorageSync(keyValue);
            } catch(e) {
              console.error(e);
              continue;
            }
          }
          billUnitArray = [];
          appThis.setData({
            billUnitArray: billUnitArray,
            showSize:10,
            currentSize:0
          })
          wx.showToast({
            title: '删除成功',
            icon: 'success',
          })
        }
      }
    })
  },
  clearAllData: function() {
    var appThis = this;
    wx.showModal({
      title: '是否清空',
      content: '点击确认将清空所有账单',
      success: res => {
        if(res.confirm) { 
          try {
            wx.clearStorageSync();
            wx.setStorageSync("logs", "");
            wx.showToast({
              title: '删除成功',
              icon: 'success',
            })
            appThis.setData({
              hasAddBill:false,
              billUnitArray: [],
              showSize: 10,
              currentSize: 0
            })
          } catch(e) {
            wx.showToast({
              title: '删除失败',
              icon: 'loading',
            })
          }
        }
      }
    })
  }
})