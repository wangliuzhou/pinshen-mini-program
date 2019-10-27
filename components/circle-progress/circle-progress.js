// components/circle-progress/circle-progress.js
Component({
  options: {
    multipleSlots: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    bg: {
      type: String,
      value: 'bg'
    },
    draw: {
      type: String,
      value: 'draw'
    },
    progressTxt: {
      type: String,
      value: '1 到 4'
    },


  },
  /**
   * 组件的方法列表
   */
  methods: {
    drawCircleBg: function(id, x, w) {
      this.setData({
        size: 2 * x, // 更新属性和数据的方法与更新页面数据的方法类似
      });
      // 使用 wx.createContext 获取绘图上下文 ctx  绘制背景圆环
      var ctx = wx.createCanvasContext(id, this)
      ctx.setLineWidth(w / 2);
      ctx.setStrokeStyle('#febd2e');
      ctx.setLineCap('round')
      ctx.beginPath(); //开始一个新的路径
      //设置一个原点(x,y)，半径为r的圆的路径到当前路径 此处x=y=r
      var rpx = x * wx.getSystemInfoSync().windowWidth/750
      console.log(rpx)
      ctx.arc(rpx, rpx, rpx - w, 0, 2 * Math.PI, false);
      ctx.stroke(); //对当前路径进行描边
      ctx.draw();
    },
    drawCircle: function(id, x, w, step) {
      // 使用 wx.createContext 获取绘图上下文 context  绘制彩色进度条圆环
      var context = wx.createCanvasContext(id);
      // 设置渐变
      var gradient = context.createLinearGradient(2 * x, x, 0);
      gradient.addColorStop("0", "#2661DD");
      gradient.addColorStop("0.5", "#40ED94");
      gradient.addColorStop("1.0", "#5956CC");
      context.setLineWidth(w);
      context.setStrokeStyle(gradient);
      context.setLineCap('round')
      context.beginPath(); //开始一个新的路径
      // step 从0到2为一周
      context.arc(x, x, x - w, -Math.PI / 2, step * Math.PI - Math.PI / 2, false);
      context.stroke(); //对当前路径进行描边
      context.draw()
    },
    parentWidth:function(elem){
      return elem.parentElement.clientWidth;
    }
  },
  ready: function() {
    console.log("componenet is ready")
    this.drawCircleBg('circle_bg', 75, 4);
  }
})