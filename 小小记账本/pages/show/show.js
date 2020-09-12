const app = getApp()
const billKey = 'billKey'
var sliderWidth = 96 // 需要设置slider的宽度，用于计算中间位置
Page({
  /**
   * 页面的初始数据
   */
  data: {
    outMoney: '',
    inMoney: '',
    accountOutData: '',
    accountInData: '',
    inLength: 0,
    outLength: 0,
    tabs: ['支出', '收入'],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    startDate: '2018-01-01',
    endDate: '2028-12-31',
    outDate: '2018-01-01',
    outTime: '08:00',
    inDate: '2018-01-01',
    inTime: '08:00',
    consumptionArea: ['食物', '住宿', '交通', '娱乐', '购物', '其他'],
    consumptionAreaimg: [
      '/images/icon/food.png',
      '/images/icon/hotel.png',
      '/images/icon/car.png',
      '/images/icon/yule.png',
      '/images/icon/shopping.png',
      '/images/icon/other.png',
    ],
    consumAreaIndex: 0,
    consumAreaBranch: [
      ['早餐', '中餐', '晚餐', '烟酒', '水果', '零食', '其他食物'],
      ['酒店', '青旅', '民宿', '其他酒店'],
      ['汽车', '飞机', '火车', '轮船', '其他交通'],
      ['旅游', 'K歌', '其他娱乐'],
      ['衣服', '电器', '化妆品', '其他购物'],
      ['其他消费'],
    ],
    consumAreaBranchIndex: 0,
    incomeArea: ['转账', '工资', '年终奖', '兼职', '红包', '其他'],
    incomeAreaimg: [
      '/images/icon/zhuan.png',
      '/images/icon/gongzi.png',
      '/images/icon/nianzhong.png',
      '/images/icon/jianzhi.png',
      '/images/icon/hongbao.png',
      '/images/icon/other.png',
    ],
    incomeAreaIndex: 0,
    billUnit: {
      id: 0,
      bType: 0, //0支出，1收入
      money: 0,
      date: '',
      time: '',
      areaType: '',
      textArea: '',
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft:
            (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset:
            (res.windowWidth / that.data.tabs.length) * that.data.activeIndex,
        })
      },
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.updateChangeTabData()
  },
  /**
   * 通过切换tab键，更新相关数据。
   */
  updateChangeTabData: function () {
    var nowData = new Date()
    var strDate =
      nowData.getFullYear() +
      '-' +
      app.formatNumber(nowData.getMonth() + 1) +
      '-' +
      app.formatNumber(nowData.getDate())
    var strTime =
      app.formatNumber(nowData.getHours()) +
      ':' +
      app.formatNumber(nowData.getMinutes())
    var activeIndex = new Number(this.data.activeIndex).valueOf()
    switch (activeIndex) {
      case 0: {
        this.setData({
          outDate: strDate,
          outTime: strTime,
        })
        break
      }
      case 1: {
        this.setData({
          inDate: strDate,
          inTime: strTime,
        })
        break
      }
      default:
        break
    }
  },
  bindDateChange: function (e) {
    var activeIndex = new Number(this.data.activeIndex).valueOf()
    switch (activeIndex) {
      case 0: {
        this.setData({
          outDate: e.detail.value,
        })
        break
      }
      case 1: {
        this.setData({
          inDate: e.detail.value,
        })
        break
      }
      default:
        break
    }
  },
  bindTimeChange: function (e) {
    var activeIndex = new Number(this.data.activeIndex).valueOf()
    switch (activeIndex) {
      case 0: {
        this.setData({
          outTime: e.detail.value,
        })
        break
      }
      case 1: {
        this.setData({
          inTime: e.detail.value,
        })
        break
      }
      default:
        break
    }
  },
  bindAreaChange: function (e) {
    this.setData({
      consumAreaIndex: e.detail.value,
    })
  },
  bindAreaBranchChange: function (e) {
    this.setData({
      consumAreaBranchIndex: e.detail.value,
    })
  },
  bindIncomeAreaChange: function (e) {
    this.setData({
      incomeAreaIndex: e.detail.value,
    })
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id,
    })
    this.updateChangeTabData() //位置不能变动
  },
  addRecordBill: function (e) {
    var activeIndex = new Number(this.data.activeIndex).valueOf()
    var money =
      activeIndex == 0 ? e.detail.value.outMoney : e.detail.value.inMoney
    var numMoney = Number(money).valueOf()
    if (numMoney <= 0) {
      wx.showToast({
        title: '金额不能小于0',
        icon: 'loading',
      })
      return
    } else if (numMoney > 0) {
      switch (activeIndex) {
        case 0: {
          var textArea = e.detail.value.outTextareaData
          var consumAreaIndex = this.data.consumAreaIndex
          var consumAreaBranchIndex = this.data.consumAreaBranchIndex
          var customArea =
            this.data.consumptionArea[consumAreaIndex] +
            '=>' +
            this.data.consumAreaBranch[consumAreaIndex][consumAreaBranchIndex]
          //将数据保存到磁盘
          var billUnit = this.data.billUnit
          billUnit.id = new Date().getTime()
          billUnit.bType = 0
          billUnit.money = numMoney
          billUnit.date = this.data.outDate
          billUnit.time = this.data.outTime
          billUnit.areaType = customArea
          billUnit.textArea = textArea
          this.saveBillInfo(billUnit, activeIndex)
          break
        }
        case 1: {
          var textArea = e.detail.value.inTextareaData
          var incomeAreaIndex = this.data.incomeAreaIndex
          var incomeArea = this.data.incomeArea[incomeAreaIndex]
          //将数据保存到磁盘
          var billUnit = this.data.billUnit
          billUnit.id = new Date().getTime()
          billUnit.bType = 1
          billUnit.money = numMoney
          billUnit.date = this.data.inDate
          billUnit.time = this.data.inTime
          billUnit.areaType = incomeArea
          billUnit.textArea = textArea
          this.saveBillInfo(billUnit, activeIndex)
          break
        }
        default:
          console.error('发生异常')
          break
      }
    } else {
      wx.showToast({
        title: '金额无效',
        icon: 'loading',
      })
      return
    }
  },
  saveBillInfo: function (data, index) {
    try {
      var appThis = this
      var activeIndex = index
      var strKey = new String(data.id)
      //console.warn(strKey);
      //wx.setStorageSync(strKey, data);
      wx.setStorage({
        key: strKey,
        data: data,
        success: function (e) {
          wx.showToast({
            title: '已保存',
            icon: 'success',
          })
          appThis.updateChangeTabData()
          switch (activeIndex) {
            case 0: {
              appThis.setData({
                outMoney: '',
                consumAreaIndex: 0,
                consumAreaBranchIndex: 0,
                accountOutData: '',
              })
              break
            }
            case 1: {
              appThis.setData({
                inMoney: '',
                incomeAreaIndex: 0,
                accountInData: '',
              })
              break
            }
            default:
              break
          }
        },
        fail: function (e) {
          wx.showToast({
            title: '保存失败',
            icon: 'loading',
          })
          console.error(e)
        },
      })
    } catch (e) {
      wx.showToast({
        title: '保存失败',
        icon: 'loading',
      })
      console.error(e)
    }
  },

  accountOutLength: function (e) {
    this.setData({
      outLength: e.detail.value.length,
    })
  },
  accountInLength: function (e) {
    this.setData({
      inLength: e.detail.value.length,
    })
  },
})
