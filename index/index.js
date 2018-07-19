const app = getApp();
let x,//多边形中心点X坐标
  y,//多边形中心点Y坐标
  r,//多边形中心点半径
  num,//多边形边数
  startX,//多边形绘制起点X坐标
  startY,//多边形绘制起点Y坐标
  startAreaX,//区域多边形绘制起点X坐标
  startAreaY,//区域多边形绘制起点Y坐标
  areaColor,//区域多边形填充区域颜色
  percentColor,//多边形标签百分比的颜色
  dotColor,//区域多边形圆点颜色
  data;//数据

Page({
  data: {

  },
  onLoad: function () {
    let ctx = wx.createCanvasContext('myCanvas');
    let conf = { x: 150, y: 150, r: 50, num: 5, areaColor: "rgba(255,202,129,.7)", percentColor: "#FFCA81", dotColor:"#58D653" };
    let len = 0;
    this.init(conf);
    this.drawAnimationArea(ctx, len)
  },

  init(conf) {
    data = [{ tag: "正太", percent: .17, distance: 16 },
    { tag: "少年", percent: .32, distance: 30 },
    { tag: "大叔", percent: .23, distance: 20 },
    { tag: "萝莉", percent: .82, distance: 20, },
    { tag: "少女", percent: .72, distance: 30 },
    ]
    x = conf && conf.x || 0;
    y = conf && conf.y || 0;
    r = conf && conf.r || 100;
    num = conf && conf.num || 3;
    areaColor = conf.areaColor;
    dotColor = conf.dotColor;
    percentColor = conf.percentColor;
    startX = x + r * Math.cos(2 * Math.PI * 0 / num + Math.PI / 2);
    startY = y + r * Math.sin(2 * Math.PI * 0 / num - Math.PI / 2);
    startAreaX = x + r * Math.cos(2 * Math.PI * 0 / num + Math.PI / 2) * data[0].percent;
    startAreaY = y + r * Math.sin(2 * Math.PI * 0 / num - Math.PI / 2) * data[0].percent;
  },

    drawPolygon(ctx) {
    ctx.moveTo(startX, startY);
    for (let i = 0; i < num; i++) {
      let nextX = x + r * Math.cos(2 * Math.PI * i / num + Math.PI / 2);
      let nextY = y + r * Math.sin(2 * Math.PI * i / num - Math.PI / 2);
      let textX = x + (r + data[i].distance) * Math.cos(2 * Math.PI * i / num + Math.PI / 2);
      let textY = y + (r + data[i].distance) * Math.sin(2 * Math.PI * i / num - Math.PI / 2);
      let textWidth = ctx.measureText(data[i].tag).width;
      let percentWidth = ctx.measureText(data[i].percent * 100 + "%").width;
      let textGapWidth = 6;
      ctx.setFontSize(13);
      ctx.fillStyle = '#fff';
      ctx.setTextBaseline('middle');
      ctx.setTextAlign('center');
      ctx.fillText(data[i].tag, textX - (percentWidth + textGapWidth) / 2, textY);
      ctx.fillStyle = percentColor;
      ctx.fillText(data[i].percent * 100 + "%", textX + textWidth + textGapWidth - (percentWidth + textGapWidth) / 2, textY);
      ctx.lineTo(nextX, nextY);
    }
    ctx.closePath();
    ctx.setStrokeStyle("#fff");
    ctx.setLineWidth(1);
    ctx.setLineJoin('round');
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
    for (let i = 0; i < num; i++) {
      let nextX = x + r * Math.cos(2 * Math.PI * i / num + Math.PI / 2);
      let nextY = y + r * Math.sin(2 * Math.PI * i / num - Math.PI / 2);
      ctx.lineTo(nextX, nextY);
      ctx.moveTo(x, y);
    }
    ctx.closePath();
    ctx.setStrokeStyle("rgba(255,255,255,.5)");
    ctx.setLineWidth(1);
    ctx.stroke();
  },

    drawDot(ctx, len) {
    for (let i = 0; i < num; i++) {
      let nextX = x + len * Math.cos(2 * Math.PI * i / num + Math.PI / 2) * data[i].percent;
      let nextY = y + len * Math.sin(2 * Math.PI * i / num - Math.PI / 2) * data[i].percent;
      ctx.arc(nextX, nextY, 2, 0, 2 * Math.PI);
      ctx.setFillStyle(dotColor);
      ctx.closePath();
      ctx.fill();
    }
  },
    drawArea(ctx, len) {
    ctx.moveTo(startAreaX, startAreaY);
    for (let i = 0; i < num; i++) {
      let nextX = x + len * Math.cos(2 * Math.PI * i / num + Math.PI / 2) * data[i].percent;
      let nextY = y + len * Math.sin(2 * Math.PI * i / num - Math.PI / 2) * data[i].percent;
      ctx.lineTo(nextX, nextY);
    }
    ctx.setFillStyle(areaColor)
    ctx.closePath();
    ctx.fill();
  },

    drawAnimationArea(ctx, len) {
    if (len <= r) {
      this.drawPolygon(ctx)
      this.drawDot(ctx, len);
      this.drawArea(ctx, len);
      ctx.draw(false);
      this._tid = requestAnimationFrame(() => {
        len = len + 1;
        this.drawAnimationArea(ctx, len)
      })
    }
  }
})
