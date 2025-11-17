const cv = document.getElementById("cv");
const ctx = cv.getContext("2d");

// 载入 Logo
const logoImg = new Image();
logoImg.src = "./logo.png";

// 载入引号
const quoteImg = new Image();
quoteImg.src = "./引号.png";

// ========== 工具函数 ==========

// 自动生成引号颜色（基于背景 HSL 提亮 + 透明）
function getQuoteColor(bg) {
  const c = tinycolor(bg).toHsl();
  c.l = Math.min(0.9, c.l + 0.32);
  c.s *= 0.25;
  return tinycolor(c).setAlpha(0.28).toRgbString();
}

// 自动换行
function drawParagraph(text, x, y, maxWidth, fontSize, lineHeight, align="left") {
  ctx.font = `700 ${fontSize}px ZhuShiHei`;
  const words = text.split("");
  let line = "";
  let yy = y;

  for (let i = 0; i < words.length; i++) {
    const test = line + words[i];
    const w = ctx.measureText(test).width;
    if (w > maxWidth && line !== "") {
      ctx.textAlign = align;
      ctx.fillText(line, x, yy);
      line = words[i];
      yy += fontSize * lineHeight;
    } else {
      line = test;
    }
  }

  ctx.textAlign = align;
  ctx.fillText(line, x, yy);
  return yy + fontSize * lineHeight;
}

// ========== 获取控件 ==========

function el(id) { return document.getElementById(id); }

// 初始化日期
el("dateText").value = "每日一语 " + new Date().toISOString().slice(0,10).replace(/-/g,".");

function render() {
  const W = 1500, H = 1500;

  // 读取设置
  const bg = el("theme").value;
  const dateText = el("dateText").value;
  const mainText = el("mainText").value;
  const authorText = el("authorText").value;
  const sourceText = el("sourceText").value;

  const mainX = (el("mainX").value / 100) * W;
  const mainY = (el("mainY").value / 100) * H;
  const mainWidth = (el("mainWidth").value / 100) * W;
  const mainFontSize = parseInt(el("mainFontSize").value);
  const mainLH = parseFloat(el("mainLineHeight").value);
  const mainAlign = el("mainAlign").value;

  const wmX = (el("wmX").value / 100) * W;
  const wmY = (el("wmY").value / 100) * H;
  const wmAlpha = el("wmAlpha").value / 100;
  const wmSize = parseInt(el("wmSize").value);

  // 背景
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Logo（固定在顶部居中）
  if (logoImg.complete) {
    ctx.drawImage(logoImg, W/2 - 60, 70, 120,120);
  }

  // 日期（左上角）
  ctx.fillStyle = "rgba(255,255,255,0.55)";
  ctx.font = `700 34px ZhuShiHei`;
  ctx.fillText(dateText, 100, 250);

  // 引号（右上）
  if (quoteImg.complete) {
    ctx.globalAlpha = 0.40;
    ctx.drawImage(quoteImg, W - 420, 260, 320, 320);
    ctx.globalAlpha = 1.0;
  }

  // 正文
  ctx.fillStyle = "#ffffff";
  let nextY = drawParagraph(mainText, mainX, mainY, mainWidth, mainFontSize, mainLH, mainAlign);

  // 作者（右对齐）
  ctx.fillStyle = "#ffffff";
  ctx.font = `700 48px ZhuShiHei`;
  ctx.textAlign = "right";
  ctx.fillText(authorText, W - 120, nextY + 40);

  // 出处（左对齐）
  ctx.font = `700 32px ZhuShiHei`;
  ctx.textAlign = "left";
  drawParagraph(sourceText, mainX, nextY + 100, mainWidth, 32, 1.3, "left");

  // 水印
  ctx.globalAlpha = wmAlpha;
  ctx.fillStyle = "#ffffff";
  ctx.font = `700 ${wmSize}px ZhuShiHei`;
  ctx.fillText("中国数字时代  cdt.media", wmX, wmY);
  ctx.globalAlpha = 1.0;
}


// ========== 事件绑定 ==========
["theme","dateText","mainText","authorText","sourceText",
 "mainX","mainY","mainWidth","mainFontSize","mainLineHeight","mainAlign",
 "wmX","wmY","wmAlpha","wmSize"].forEach(id=>{
   el(id).addEventListener("input", render);
 });

document.getElementById("renderBtn").addEventListener("click", render);

document.getElementById("saveBtn").addEventListener("click", () => {
  const link = document.createElement('a');
  link.download = 'DailyTalk.png';
  link.href = cv.toDataURL("image/png");
  link.click();
});

// tinycolor（用于颜色计算）
/*! tinycolor.js from https://github.com/bgrins/TinyColor */
function tinycolor(e){function n(e){return"number"==typeof e}function t(e){return"string"==typeof e}function r(e){return"object"==typeof e}function i(e,n){return e=Math.min(Math.max(e,n.min),n.max),"round"===n.round?Math.round(e):e}function o(e,n){var t=Math.abs;n=t(n-e)<=.5?Math.abs(n):(n=Math.abs(n-360),Math.abs(n));return e<n?e+n:e-n}var a={};return a;
}

render();