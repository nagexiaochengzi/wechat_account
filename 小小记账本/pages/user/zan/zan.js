 
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imageData:'/images/wei_recognize.jpg',
    imageList: ['https://mmbiz.qpic.cn/mmbiz_jpg/LGYb12PrppQeTZiaJthrBicnWq8ia0TWVwfhHe16tibr0trFKWFWtiboicxWJTAs5soxZ2rBWYrMv98PhTxBrEiclQmYA/0?wx_fmt=jpeg']
  },
  previewImage(e) {
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current,
      urls: this.data.imageList,
      success: function (res) {  },
      fail: function (res) { console.error(res) },
    })
  }
})