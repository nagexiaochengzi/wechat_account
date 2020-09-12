// pages/account/account.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    searchDate: '2018-01-01',
    startDate: '2018-01-01',
    endDate: '2028-12-31',
    windowWidth: 320,
    outBillTotal: [],
    inBillTotal: [],
    searchArea: ['全量报表', '按年报表', '按月报表'],
    searchAreaIndex: 0,
    bill: {
      name: '饮食',
      color: '#257CFF', //画图的填充颜色
      total: 20, //相关类型数据的总和
    },
    inBillMax: 0,
    outBillMax: 0,
    outAllMoney: 0,
    inAllMoney: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var windowWidth = this.data.windowWidth
    try {
      var res = wx.getSystemInfoSync()
      windowWidth = res.windowWidth
      this.setData({
        windowWidth: windowWidth,
      })
    } catch (e) {
      console.error(e)
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var nowDate = new Date()
    var strDate =
      nowDate.getFullYear() +
      '-' +
      app.formatNumber(nowDate.getMonth() + 1) +
      '-' +
      app.formatNumber(nowDate.getDate())
    this.setData({
      searchAreaIndex: 0,
      searchDate: strDate,
    })
    this.onDrawBillAccount()
  },

  onDrawBillAccount: function () {
    wx.showLoading({
      title: '正在努力绘制',
    })
    var inBillMax = this.data.inBillMax
    var outBillMax = this.data.outBillMax
    var outBillTotal = this.data.outBillTotal
    var inBillTotal = this.data.inBillTotal
    var searchAreaIndex = this.data.searchAreaIndex
    outBillTotal = []
    inBillTotal = []
    inBillMax = 0
    outBillMax = 0
    var outAllMoney = 0
    var inAllMoney = 0

    try {
      var searchDate = new String(this.data.searchDate)
      searchDate = searchDate.split('-')
      var res = wx.getStorageInfoSync()
      if (res.keys.length > 1) {
        let food = { name: '食物', color: '#5aa78a', total: 0 } //食物
        let quarter = { name: '住宿', color: '#5facfa', total: 0 } //住宿
        let traffic = { name: '交通', color: '#00ffff', total: 0 } //交通
        let sport = { name: '娱乐', color: '#bb6e6e', total: 0 } //娱乐
        let shopping = { name: '购物', color: '#67d02e', total: 0 } //购物
        let other = { name: '其他', color: '#81add7', total: 0 } //其他
        let transfer = { name: '转账', color: '#ff0000', total: 0 } //转账
        let wage = { name: '工资', color: '#871601', total: 0 } //转账
        let reimburse = { name: '年终奖', color: '#f19716', total: 0 } //转账
        let sideMoney = { name: '兼职', color: '#00b8ec', total: 0 } //转账
        let redMoney = { name: '红包', color: '#02b8ec', total: 0 } //转账
        let inOther = { name: '其他', color: '#81add7', total: 0 } //其他
        for (let i = 0; i < res.keys.length; ++i) {
          if (res.keys[i] == 'logs') {
            continue
          }
          var resValue = wx.getStorageSync(res.keys[i])
          var searchStr = new String(resValue.date)
          var searchArray = searchStr.split('-')
          if (searchAreaIndex != 0) {
            //0总计，1按年，2按月
            if (searchAreaIndex == 1 && searchDate[0] != searchArray[0]) {
              continue
            } else if (
              searchAreaIndex == 2 &&
              (searchDate[0] != searchArray[0] ||
                searchDate[1] != searchArray[1])
            ) {
              continue
            }
          }

          var areaType = resValue.areaType.substr(0, 2)
          switch (resValue.bType) {
            case 0: {
              //支出
              outAllMoney += resValue.money
              switch (areaType) {
                case '食物': {
                  food.total += resValue.money
                  break
                }
                case '住宿': {
                  quarter.total += resValue.money
                  break
                }
                case '交通': {
                  traffic.total += resValue.money
                  break
                }
                case '娱乐': {
                  sport.total += resValue.money
                  break
                }
                case '购物': {
                  shopping.total += resValue.money
                  break
                }
                case '其他': {
                  other.total += resValue.money
                  break
                }
                default:
                  break
              }
              break
            }
            case 1: {
              //收入
              inAllMoney += resValue.money
              switch (areaType) {
                case '转账': {
                  transfer.total += resValue.money
                  break
                }
                case '工资': {
                  wage.total += resValue.money
                  break
                }
                case '年终奖': {
                  reimburse.total += resValue.money
                  break
                }
                case '兼职': {
                  sideMoney.total += resValue.money
                  break
                }
                case '红包': {
                  redMoney.total += resValue.money
                  break
                }
                case '其他': {
                  inOther.total += resValue.money
                  break
                }
                default:
                  break
              }
              break
            }
            default:
              console.error('发生异常')
              break
          }
        }
        outBillTotal.push(food)
        outBillTotal.push(quarter)
        outBillTotal.push(traffic)
        outBillTotal.push(sport)
        outBillTotal.push(shopping)
        outBillTotal.push(other)
        inBillTotal.push(transfer)
        inBillTotal.push(wage)
        inBillTotal.push(reimburse)
        inBillTotal.push(sideMoney)
        inBillTotal.push(redMoney)
        inBillTotal.push(inOther)
        for (let j = 0; j < outBillTotal.length; ++j) {
          let total = outBillTotal[j].total
          outBillMax = outBillMax > total ? outBillMax : total
        }
        for (let k = 0; k < inBillTotal.length; ++k) {
          let total = inBillTotal[k].total
          inBillMax = inBillMax > total ? inBillMax : total
        }
      }
    } catch (e) {
      console.error(e)
    }
    this.setData({
      outBillTotal: outBillTotal,
      inBillTotal: inBillTotal,
      outBillMax: outBillMax,
      inBillMax: inBillMax,
      outAllMoney: outAllMoney,
      inAllMoney: inAllMoney,
    })
    //画图
    var windowWidth = this.data.windowWidth
    var radius = windowWidth / 4
    var minWidth = windowWidth / 2
    if (outBillMax > 0) {
      this.onDrawCircle(
        windowWidth,
        windowWidth,
        minWidth,
        (minWidth * 3) / 4,
        radius,
        'outCanvasIdCircle',
        outBillTotal,
        500,
      )
      this.onDrawRect(
        windowWidth,
        windowWidth,
        0,
        windowWidth,
        'outCanvasIdRect',
        outBillTotal,
        outBillMax,
        500,
      )
    }
    if (inBillMax > 0) {
      this.onDrawCircle(
        windowWidth,
        windowWidth,
        minWidth,
        (minWidth * 3) / 4,
        radius,
        'inCanvasIdCircle',
        inBillTotal,
        100,
      )
      this.onDrawRect(
        windowWidth,
        windowWidth,
        0,
        windowWidth,
        'inCanvasIdRect',
        inBillTotal,
        inBillMax,
        100,
      )
    }
    wx.hideLoading()
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
  /**
   * 根据输入数据画饼图
   * width画布的宽度，height画布的高度,坐标原点(x,y)
   * radius圆饼半径，canvasId画布的ID，billTotal画布的所有数据
   */
  onDrawCircle: function (
    width,
    height,
    x,
    y,
    radius,
    canvasId,
    billTotal,
    uWidth,
  ) {
    var canvasContext = wx.createCanvasContext(canvasId, this)
    var allTotal = 0,
      start = 0
    var rectX = 6,
      space = 6
    var rectWidth = width / billTotal.length
    rectWidth -= 2 * space
    rectWidth = rectWidth > uWidth ? uWidth : rectWidth
    var rectHeight = (height - space - y - radius) / 2
    rectHeight -= 2 * space
    for (let i = 0; i < billTotal.length; ++i) {
      allTotal += billTotal[i].total
    }
    canvasContext.draw(false)
    canvasContext.setFontSize('12px')
    //画圆图，和底部说明文字
    for (let j = 0; j < billTotal.length; ++j) {
      canvasContext.beginPath()
      var eAngle = start + (billTotal[j].total / allTotal) * 2 * Math.PI
      canvasContext.arc(x, y, radius, start, eAngle, false)
      start += (billTotal[j].total * 2 * Math.PI) / allTotal
      canvasContext.lineTo(x, y)
      canvasContext.setFillStyle(billTotal[j].color)
      //5.填充动作
      canvasContext.fill(false)
      canvasContext.fillRect(
        rectX,
        space + y + radius + rectHeight,
        rectWidth / 2,
        rectHeight / 4,
      )
      canvasContext.fillText(
        billTotal[j].name,
        rectX + rectWidth / 2,
        y + radius + 1.3 * rectHeight,
      )
      canvasContext.closePath()
      rectX += rectWidth + space
    }

    //画圆图周边线条和说明文字
    start = 0
    for (let j = 0; j < billTotal.length; ++j) {
      canvasContext.beginPath()
      canvasContext.moveTo(x, y)
      var y1 =
        y +
        (radius + 8) *
          Math.sin(start + (billTotal[j].total * Math.PI) / allTotal)
      var x1 =
        x +
        (radius + 8) *
          Math.cos(start + (billTotal[j].total * Math.PI) / allTotal)
      canvasContext.setStrokeStyle(billTotal[j].color)
      canvasContext.lineTo(x1, y1)
      var z1 = Math.cos(start + (billTotal[j].total * Math.PI) / allTotal)
      if (z1 >= 0) {
        canvasContext.setTextAlign('left')
      } else {
        canvasContext.setTextAlign('right')
      }
      start += (billTotal[j].total * 2 * Math.PI) / allTotal
      canvasContext.lineTo(x1 + 5 * z1, y1)
      canvasContext.stroke()
      var baifen = ((100 * billTotal[j].total) / allTotal).toFixed(2)
      canvasContext.strokeText(
        billTotal[j].name + '(' + baifen + '%)',
        x1 + 5 * z1,
        y1,
      )
      canvasContext.closePath()
    }
    canvasContext.draw(true)
  },
  /**
   * width画布的宽度，height画布的高度,坐标原点(x,y)
   * canvasId画布的ID，billTotal画布的所有数据，billMaxData纵轴最大金额
   */
  onDrawRect: function (
    width,
    height,
    x,
    y,
    canvasId,
    billTotal,
    billMaxData,
    uWidth,
  ) {
    var priceTag = '元'
    if (billMaxData >= 100000 && billMaxData < 100000000) {
      priceTag = '万元'
      billMaxData /= 10000
    } else if (billMaxData >= 100000000) {
      billMaxData /= 10000000
      priceTag = '亿元'
    }
    var canvasContext = wx.createCanvasContext(canvasId, this)
    canvasContext.draw(false)
    canvasContext.setFontSize('12px')
    var xSpace = billMaxData.toLocaleString().length
    xSpace = xSpace > 18 ? xSpace : 18
    var allTotal = 0,
      space = 20,
      start = 0
    const x0 = x + xSpace,
      y0 = y - space
    var yHeight = height - 2 * space,
      xWidth = width - 2 * space
    for (let i = 0; i < 100; ++i) {
      if (billMaxData % 100 == 0) {
        break
      }
      billMaxData += 1
    }
    var unitMax = billMaxData / 10
    //画坐标轴
    canvasContext.beginPath()
    canvasContext.setStrokeStyle('#b5b5b5')
    canvasContext.moveTo(x0, y0)
    canvasContext.lineTo(x0, y0 - yHeight) //画纵轴
    canvasContext.strokeText(priceTag, x0 - 3, space - 3)
    canvasContext.moveTo(x0, y0)
    canvasContext.lineTo(x0 + xWidth, y0) //画横轴
    /////////////////////////////////////////////
    var y00 = new Number(y0),
      bUnitMata = 0,
      x00 = x0 + 10
    canvasContext.setTextAlign('left')
    var ySpace = yHeight / 10
    for (let j = 0; j < 10; ++j) {
      canvasContext.moveTo(x0, y00)
      canvasContext.lineTo(x0 + 5, y00)
      //画纵坐标
      canvasContext.strokeText(
        bUnitMata % 10 == 0 ? bUnitMata : bUnitMata.toFixed(2),
        3,
        y00,
      )
      y00 -= ySpace
      bUnitMata += unitMax
    }
    canvasContext.stroke()
    canvasContext.closePath()
    ////////////////////////////////////////////////////////
    canvasContext.beginPath()
    var xSpace = xWidth / billTotal.length
    xSpace = xSpace > uWidth ? uWidth : xSpace
    for (let k = 0; k < billTotal.length; ++k) {
      //画横坐标
      canvasContext.setFillStyle(billTotal[k].color)
      const xHeight = (billTotal[k].total * yHeight) / billMaxData
      canvasContext.moveTo(x00, y0)
      canvasContext.strokeText(billTotal[k].name, x00, y0 + 10)
      canvasContext.fillRect(x00, y0 - xHeight, xSpace - 10, xHeight)
      x00 += xSpace
    }
    canvasContext.closePath()
    //画图
    canvasContext.draw(true)
  },
  onShareAppMessage: function (e) {
    var filePath = ''
    wx.canvasToTempFilePath(
      {
        canvasId: 'outCanvasIdCircle',
        success: function (res) {
          filePath = res.tempFilePath
          console.warn(res.tempFilePath)
        },
      },
      this,
    )
    return {
      title: '用户支出收入账单报表',
      path: filePath,
      success: function (res) {
        // 转发成功
        console.warn(res)
      },
      fail: function (res) {
        // 转发失败
        console.error(res)
      },
    }
  },
  bindDateChange: function (e) {
    this.setData({
      searchDate: e.detail.value,
    })
    this.onDrawBillAccount()
  },
  bindAreaChange: function (e) {
    console.warn(e.detail.value)
    this.setData({
      searchAreaIndex: e.detail.value,
    })
    this.onDrawBillAccount()
  },
})
