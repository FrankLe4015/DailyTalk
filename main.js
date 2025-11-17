// ====================== 基础设置 ======================
const cv = document.getElementById("cv");
const ctx = cv.getContext("2d");

const W = 1500, H = 1500;

// ====================== 载入 PNG ======================
const logoImg = new Image();
logoImg.src = "./logo.png";

const quoteImg = new Image();
quoteImg.src = "./引号.png";

// ====================== 元素默认位置 ======================
const pos = {
  date:   { x: 120,  y: 240 },
  main:   { x: 160,  y: 350 },
  author: { x: 1100, y: 950 },
  source: { x: 160,  y: 1020 },
  logo:   { x: W/2 - 80, y: 120 },
  quote:  { x: 980,  y: 300 },
  wm:     { x: 950,  y: 1400 }
};

const step = 15; // 每次遥控移动 15px

// ====================== 遥控器移动 ======================
function move(target, dir) {
  if (dir === "up")    pos[target].y -= step;
  if (dir === "down")  pos[target].y += step;
  if (dir === "left")  pos[target].x -= step;
  if (dir === "right") pos[target].x += step;
  render();
}

// ====================== 自动生成引号颜色 ======================
function getQuoteColor(bg) {
  const c = tinycolor(bg).toHsl();
  c.l = Math.min(0.9, c.l + 0.32);
  c.s = c.s * 0.25;
  return tinycolor(c).setAlpha(0.28).toRgbString();
}

// ====================== 自动换行（逐字） ======================
function drawParagraph(text, x, y, maxWidth, font, lh, align) {
  ctx.font = font;
  ctx.textAlign = align;

  const chars = text.split("");
  let line = "";
  let yy = y;

  chars.forEach(ch => {
    const test = line + ch;
    if (ctx.measureText(test).width > maxWidth && line !== "") {
      ctx.fillText(line, x, yy);
      yy += parseInt(font) * lh;
      line = ch;
    } else {
      line = test;
    }
  });

  ctx.fillText(line, x, yy);
  return yy + parseInt(font) * lh;
}

// ====================== 主渲染函数 ======================
function render() {
  const bg = document.getElementById("theme").value;

  // 清空背景
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // ====================== 日期 ======================
  ctx.font = `53px ZhuShiHei`;
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.textAlign = "left";
  ctx.fillText(
    document.getElementById("dateText").value,
    pos.date.x,
    pos.date.y
  );

  // ====================== Logo ======================
  if (logoImg.complete && logoImg.naturalWidth > 0) {
    ctx.drawImage(logoImg, pos.logo.x, pos.logo.y, 160, 160);
  }

  // ====================== 引号（保持比例） ======================
  if (quoteImg.complete && quoteImg.naturalWidth > 0) {
    const scale = 0.45;
    const qw = quoteImg.width * scale;
    const qh = quoteImg.height * scale;
    ctx.globalAlpha = 0.3;
    ctx.drawImage(quoteImg, pos.quote.x, pos.quote.y, qw, qh);
    ctx.globalAlpha = 1;
  }

  // ====================== 正文 ======================
  const mainFontSize = parseInt(document.getElementById("mainFont").value);
  const lh = parseFloat(document.getElementById("mainLine").value);
  const align = document.getElementById("mainAlign").value;

  const nextY = drawParagraph(
    document.getElementById("mainText").value,
    pos.main.x,
    pos.main.y,
    1180,
    `${mainFontSize}px "Noto Serif TC"`,
    lh,
    align
  );

  // ====================== 作者 ======================
  ctx.font = `44px "Noto Serif TC"`;
  ctx.textAlign = "right";
  ctx.fillStyle = "#fff";
  ctx.fillText(
    document.getElementById("authorText").value,
    pos.author.x,
    pos.author.y
  );

  // ====================== 出处 ======================
  ctx.font = `32px "Noto Serif TC"`;
  ctx.textAlign = "left";
  drawParagraph(
    document.getElementById("sourceText").value,
    pos.source.x,
    pos.source.y,
    1180,
    `32px "Noto Serif TC"`,
    1.3,
    "left"
  );

  // ====================== 水印 ======================
  const wmAlpha = document.getElementById("wmAlpha").value / 100;
  const wmSize  = document.getElementById("wmSize").value;

  ctx.globalAlpha = wmAlpha;
  ctx.font = `${wmSize}px ZhuShiHei`;
  ctx.fillText("中国数字时代  cdt.media", pos.wm.x, pos.wm.y);
  ctx.globalAlpha = 1;
}

// ====================== 下载 PNG ======================
document.getElementById("saveBtn").addEventListener("click", () => {
  const a = document.createElement("a");
  a.href = cv.toDataURL("image/png");
  a.download = "DailyTalk.png";
  a.click();
});

// ====================== 初始化 ======================
document.getElementById("dateText").value =
  "每日一语 " +
  new Date().toISOString().slice(0, 10).replace(/-/g, ".");

render();
