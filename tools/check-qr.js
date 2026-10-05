const fs=require('fs'),zlib=require('zlib'),jsQR=require('jsqr');
function decode(file){const b=fs.readFileSync(file);let p=8,w=0,h=0,ct=0,idat=[];
 while(p<b.length){const len=b.readUInt32BE(p),t=b.toString('ascii',p+4,p+8),d=b.slice(p+8,p+8+len);
  if(t==='IHDR'){w=d.readUInt32BE(0);h=d.readUInt32BE(4);ct=d[9];}
  else if(t==='IDAT')idat.push(d);else if(t==='IEND')break;p+=12+len;}
 const chan={0:1,2:3,3:1,4:2,6:4}[ct];const raw=zlib.inflateSync(Buffer.concat(idat));
 const stride=w*chan,out=Buffer.alloc(h*stride);let rp=0;
 for(let y=0;y<h;y++){const f=raw[rp++],line=raw.slice(rp,rp+stride);rp+=stride;
  const cur=out.slice(y*stride,(y+1)*stride),prev=y>0?out.slice((y-1)*stride,y*stride):Buffer.alloc(stride);
  for(let i=0;i<stride;i++){const a=i>=chan?cur[i-chan]:0,bb=prev[i],c=i>=chan?prev[i-chan]:0;let v=line[i];
   if(f===1)v+=a;else if(f===2)v+=bb;else if(f===3)v+=(a+bb)>>1;
   else if(f===4){const pa=Math.abs(bb-c),pb=Math.abs(a-c),pc=Math.abs(a+bb-2*c);v+=(pa<=pb&&pa<=pc)?a:(pb<=pc?bb:c);}
   cur[i]=v&255;}}
 const rgba=new Uint8ClampedArray(w*h*4);
 for(let i=0;i<w*h;i++){const o=i*chan;
  let r,g,bl,al=255;
  if(ct===0){r=g=bl=out[o];} else if(ct===4){r=g=bl=out[o];al=out[o+1];}
  else {r=out[o];g=out[o+1];bl=out[o+2]; if(ct===6)al=out[o+3];}
  rgba[i*4]=r;rgba[i*4+1]=g;rgba[i*4+2]=bl;rgba[i*4+3]=al;}
 return {w,h,rgba};
}
const EXPECT='https://ai-page.sandbox.purplemaia.org/';
let fail=0;
for(const f of process.argv.slice(2)){
  const {w,h,rgba}=decode(f);
  const r=jsQR(rgba,w,h);
  const got=r&&r.data;
  const okk = got===EXPECT;
  if(!okk)fail++;
  console.log((okk?'  ok  ':'  FAIL ')+f.padEnd(22)+(got?('-> '+got):'-> NOT READABLE'));
}
console.log(fail?'\n'+fail+' failed':'\nall scanned back correctly');
process.exit(fail?1:0);
