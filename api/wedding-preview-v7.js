const zlib = require('zlib');

const W = 1200, H = 630;
const C = {
  bg: [244,231,241,255], card: [251,247,251,255], purple: [77,37,95,255],
  gold: [176,138,80,255], muted: [109,91,114,255], border: [169,134,187,255],
  pale: [218,197,224,255], white: [255,255,255,255]
};
const FONT = {
 A:['01110','10001','10001','11111','10001','10001','10001'],
 B:['11110','10001','10001','11110','10001','10001','11110'],
 C:['01111','10000','10000','10000','10000','10000','01111'],
 D:['11110','10001','10001','10001','10001','10001','11110'],
 E:['11111','10000','10000','11110','10000','10000','11111'],
 F:['11111','10000','10000','11110','10000','10000','10000'],
 G:['01111','10000','10000','10111','10001','10001','01111'],
 H:['10001','10001','10001','11111','10001','10001','10001'],
 I:['11111','00100','00100','00100','00100','00100','11111'],
 J:['00111','00010','00010','00010','10010','10010','01100'],
 K:['10001','10010','10100','11000','10100','10010','10001'],
 L:['10000','10000','10000','10000','10000','10000','11111'],
 M:['10001','11011','10101','10101','10001','10001','10001'],
 N:['10001','11001','10101','10011','10001','10001','10001'],
 O:['01110','10001','10001','10001','10001','10001','01110'],
 P:['11110','10001','10001','11110','10000','10000','10000'],
 Q:['01110','10001','10001','10001','10101','10010','01101'],
 R:['11110','10001','10001','11110','10100','10010','10001'],
 S:['01111','10000','10000','01110','00001','00001','11110'],
 T:['11111','00100','00100','00100','00100','00100','00100'],
 U:['10001','10001','10001','10001','10001','10001','01110'],
 V:['10001','10001','10001','10001','10001','01010','00100'],
 W:['10001','10001','10001','10101','10101','11011','10001'],
 X:['10001','10001','01010','00100','01010','10001','10001'],
 Y:['10001','10001','01010','00100','00100','00100','00100'],
 Z:['11111','00001','00010','00100','01000','10000','11111'],
 '0':['01110','10001','10011','10101','11001','10001','01110'],
 '1':['00100','01100','00100','00100','00100','00100','01110'],
 '2':['01110','10001','00001','00010','00100','01000','11111'],
 '3':['11110','00001','00001','01110','00001','00001','11110'],
 '4':['00010','00110','01010','10010','11111','00010','00010'],
 '5':['11111','10000','10000','11110','00001','00001','11110'],
 '6':['01110','10000','10000','11110','10001','10001','01110'],
 '7':['11111','00001','00010','00100','01000','01000','01000'],
 '8':['01110','10001','10001','01110','10001','10001','01110'],
 '9':['01110','10001','10001','01111','00001','00001','01110'],
 '&':['01000','10100','10100','01000','10101','10010','01101'],
 '-':['00000','00000','00000','11111','00000','00000','00000'],
 '.':['00000','00000','00000','00000','00000','00110','00110'],
 ':':['00000','00110','00110','00000','00110','00110','00000'],
 ' ':['00000','00000','00000','00000','00000','00000','00000']
};
function buildPng() {
  const stride = W*4+1;
  const raw = Buffer.alloc(stride*H);
  for (let y=0;y<H;y++){ raw[y*stride]=0; for(let x=0;x<W;x++) px(raw,stride,x,y,C.bg); }
  fill(raw,stride,55,35,1090,560,C.card);
  frame(raw,stride,55,35,1090,560,C.white,4);
  frame(raw,stride,88,58,1024,514,C.border,2);
  frame(raw,stride,112,80,976,470,C.pale,2);
  [[140,110,1,1],[1060,110,-1,1],[140,520,1,-1],[1060,520,-1,-1]].forEach(([x,y,sx,sy])=>{
    line(raw,stride,x,y,x+55*sx,y,C.border,2); line(raw,stride,x,y,x,y+38*sy,C.border,2);
  });
  text(raw,stride,'WEDDING INVITATION',180,7,C.gold);
  text(raw,stride,'AHMED & ILHAM',250,9,C.purple);
  line(raw,stride,355,370,515,370,C.pale,2); line(raw,stride,685,370,845,370,C.pale,2);
  text(raw,stride,'09 SEPTEMBER 2026',395,7,C.purple);
  text(raw,stride,'7:00 PM',455,6,C.muted);
  text(raw,stride,'CHATEAU M',505,6,C.purple);
  return png(raw,stride);
}
function px(raw,stride,x,y,c){ if(x<0||x>=W||y<0||y>=H)return; let i=y*stride+1+x*4; raw[i]=c[0];raw[i+1]=c[1];raw[i+2]=c[2];raw[i+3]=c[3]; }
function fill(raw,stride,x,y,w,h,c){ for(let yy=y;yy<y+h;yy++) for(let xx=x;xx<x+w;xx++) px(raw,stride,xx,yy,c); }
function line(raw,stride,x1,y1,x2,y2,c,t=1){ if(y1===y2){fill(raw,stride,Math.min(x1,x2),y1,Math.abs(x2-x1)+1,t,c)} else if(x1===x2){fill(raw,stride,x1,Math.min(y1,y2),t,Math.abs(y2-y1)+1,c)} }
function frame(raw,stride,x,y,w,h,c,t){ fill(raw,stride,x,y,w,t,c);fill(raw,stride,x,y+h-t,w,t,c);fill(raw,stride,x,y,t,h,c);fill(raw,stride,x+w-t,y,t,h,c); }
function text(raw,stride,s,y,scale,c){ s=s.toUpperCase(); const charW=5*scale, gap=2*scale; const total=s.length*charW+(s.length-1)*gap; let x=Math.floor((W-total)/2); for(const ch of s){ const g=FONT[ch]||FONT[' ']; for(let r=0;r<7;r++)for(let col=0;col<5;col++)if(g[r][col]==='1')fill(raw,stride,x+col*scale,y+r*scale,scale,scale,c); x+=charW+gap; } }
function crc32(buf){ let c=0xffffffff; for(const b of buf){ c^=b; for(let k=0;k<8;k++) c=(c>>>1)^((c&1)?0xedb88320:0); } return (c^0xffffffff)>>>0; }
function chunk(type,data){ const t=Buffer.from(type); const out=Buffer.alloc(12+data.length); out.writeUInt32BE(data.length,0); t.copy(out,4); data.copy(out,8); out.writeUInt32BE(crc32(Buffer.concat([t,data])),8+data.length); return out; }
function png(raw){ const sig=Buffer.from([137,80,78,71,13,10,26,10]); const ihdr=Buffer.alloc(13); ihdr.writeUInt32BE(W,0);ihdr.writeUInt32BE(H,4);ihdr[8]=8;ihdr[9]=6;ihdr[10]=0;ihdr[11]=0;ihdr[12]=0; return Buffer.concat([sig,chunk('IHDR',ihdr),chunk('IDAT',zlib.deflateSync(raw,{level:9})),chunk('IEND',Buffer.alloc(0))]); }
module.exports = (req,res)=>{ const img=buildPng(); res.setHeader('Content-Type','image/png'); res.setHeader('Content-Length',String(img.length)); res.setHeader('Cache-Control','public, max-age=0, s-maxage=31536000, immutable'); res.statusCode=200; res.end(img); };
