Page({
  /**
   * 页面的初始数据
   */
  data: {
    key: '',
    change_detail: '',
    change_money: 0,
    billUnitArray: [],
    yuanshiArray: [],
    yuanshi2: {
      areaType: '',
      bType: 0,
      date: '',
      id: 0,
      money: 0,
      textArea: '',
      time: '',
    },
    billUnit2: {
      id: 0,
      title: '',
      time: '',
      detail: '',
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      key: options.myid,
    })
  },

  onReady: function () {},
  onShowBillData: function () {
    wx.showLoading({
      title: '正在努力加载',
    })
    var billUnitArray = new Array()
    var yuanshiArray = new Array()
    try {
      var res = wx.getStorageInfoSync()
      for (let i = res.keys.length - 1; i >= 0; --i) {
        if (res.keys[i] == 'logs') {
          continue
        }
        var billUnit = {
          id: 0,
          title: '',
          time: '',
          detail: '',
        }
        var yuanshi = {
          areaType: '',
          bType: 0,
          date: '',
          id: 0,
          money: 0,
          textArea: '',
          time: '',
        }
        var resValue = wx.getStorageSync(res.keys[i])
        billUnit.id = new Number(resValue.id)
        billUnit.time = resValue.date + ' ' + resValue.time
        billUnit.detail = resValue.areaType + ':' + resValue.textArea
        yuanshi.id = new Number(resValue.id)
        yuanshi.time = resValue.time
        yuanshi.date = resValue.date
        yuanshi.areaType = resValue.areaType
        yuanshi.textArea = resValue.textArea
        yuanshi.bType = resValue.bType
        switch (resValue.bType) {
          case 0: {
            //支出
            billUnit.title = '支出:' + resValue.money + '元'
            yuanshi.money = resValue.money
            break
          }
          case 1: {
            //收入
            billUnit.title = '收入:' + resValue.money + '元'
            yuanshi.money = resValue.money
            break
          }
          default:
            console.error('发生异常')
            break
        }
        billUnitArray.push(billUnit)
        yuanshiArray.push(yuanshi)
      }
      this.setData({
        billUnitArray: billUnitArray,
        yuanshiArray: yuanshiArray,
        billUnit2: billUnitArray[this.data.key],
        yuanshi2: yuanshiArray[this.data.key],
      })
    } catch (e) {
      console.error(e)
    }
    wx.hideLoading()
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.onShowBillData()
  },

  /**
   * 弹窗
   */
  showDialogBtn: function () {
    this.setData({
      showModal: true,
    })
  },
  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function () {},
  /**
   * 隐藏模态对话框
   */
  hideModal: function () {
    this.setData({
      showModal: false,
    })
  },
  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function () {
    this.hideModal()
  },
  /**
   * 对话框确认按钮点击事件
   */
  change_money: function (e) {
    this.data.change_money = parseInt(e.detail.value)
  },
  change_detail: function (e) {
    this.data.change_detail = e.detail.value
  },
  onConfirm: function (e) {
    this.data.yuanshi2.money = this.data.change_money
    this.data.yuanshi2.textArea = this.data.change_detail
    var strKey = new String(this.data.billUnitArray[this.data.key].id)
    wx.setStorageSync(strKey, this.data.yuanshi2)
    console.log(this.data.yuanshi2)
    wx.showToast({
      title: '提交成功',
      icon: 'success',
      duration: 3000,
      success: function () {
        setTimeout(function () {
          //要延时执行的代码
          wx.switchTab({
            url: '/pages/index/index',
          })
        }, 1500) //延迟时间
      },
    })
    this.hideModal()
  },
})
