/*! For license information please see main.70848725.js.LICENSE.txt */
  display: flex;
  flex-direction: column;
  align-items: center;
`,LT=Ht.div`
  min-width: 200px;
  height: 700px;
  border: 3px solid #fff;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`,zT=Ht.div`
  position: absolute;

  left: ${e=>{let{x:t}=e;return t+"px"}};
  top: ${e=>{let{y:t}=e;return t+"px"}};
  width: ${e=>{let{width:t}=e;return t+"px"}};
  height: ${e=>{let{height:t}=e;return t+"px"}};

  border: 4px solid #1ac71a;
  background-color: transparent;
  z-index: 20;

  &::before {
    content: "${e=>{let{classType:t,score:n}=e;return`${t} ${n.toFixed(1)}%`}}";
    color: #1ac71a;
    font-weight: 500;
    font-size: 17px;
    position: absolute;
    top: -1.5em;
    left: -5px;
  }
`,WT=Ht.button`
  padding: 7px 10px;
  border: 2px solid transparent;
  background-color: #fff;
  color: #ce5813;
  font-size: 16px;
  font-weight: 500;
  outline: none;
  margin-top: 2em;
  cursor: pointer;
  transition: all 260ms ease-in-out;

  &:hover {
    background-color: transparent;
    border: 2px solid #fff;
    color: #fff;
  }
`,$T=Ht.input`
  display: none;
`,VT=Ht.img`
  height: 100%;
`;function UT(t){const n=(0,e.useRef)(),r=(0,e.useRef)(),[a,o]=(0,e.useState)(!1),[i,s]=(0,e.useState)(null),[u,l]=(0,e.useState)([]),c=!u||0===u.length,d=async(e,t)=>{const n=await OT.load({}),a=await n.detect(e,6),o=((e,t)=>e&&t&&r?e.map((e=>{const{bbox:n}=e,a=n[0],o=n[1],i=n[2],s=n[3],u=r.current.width,l=r.current.height,c=a*u/t.width,d=o*l/t.height,p=i*u/t.width,h=s*l/t.height;return{...e,bbox:[c,d,p,h]}})):e||[])(a,t);l(o),console.log("Predictions: ",a)};return(0,PT.jsxs)(BT,{children:[(0,PT.jsxs)(LT,{children:[i&&(0,PT.jsx)(VT,{src:i,ref:r}),!c&&u.map(((e,t)=>(0,PT.jsx)(zT,{x:e.bbox[0],y:e.bbox[1],width:e.bbox[2],height:e.bbox[3],classType:e.class,score:100*e.score},t)))]}),(0,PT.jsx)($T,{type:"file",ref:n,onChange:async e=>{o(!0);const t=e.target.files[0],n=await(e=>new Promise(((t,n)=>{const r=new FileReader;r.onload=()=>t(r.result),r.onerror=()=>n(r.error),r.readAsDataURL(e)})))(t);s(n);const r=document.createElement("img");r.src=n,r.onload=async()=>{const e={width:r.width,height:r.height};await d(r,e),o(!1)}}}),(0,PT.jsx)(WT,{onClick:()=>{n.current&&n.current.click()},children:a?"Recognizing...":"Select Image"})]})}const HT=()=>{const[t,n]=(0,e.useState)([]),r=(0,e.useRef)(null),a=(0,e.useRef)(),[o,i]=(0,e.useState)(!1),[s,u]=(0,e.useState)([]),[l,c]=(0,e.useState)(!1);(0,e.useEffect)((()=>{(async()=>{const e="/httpz//chinacowboy.github.io/image-detector/models";await ny.tinyFaceDetector.loadFromUri(e),await ny.faceLandmark68Net.loadFromUri(e),await ny.faceRecognitionNet.loadFromUri(e),await ny.faceExpressionNet.loadFromUri(e),i(!0)})()}),[]);return(0,PT.jsxs)("div",{children:[(0,PT.jsx)("div",{style:{textAlign:"center",padding:"10px"},children:l&&o?(0,PT.jsx)("button",{onClick:()=>{r.current.pause(),r.current.srcObject.getTracks()[0].stop(),c(!1)},style:{cursor:"pointer",backgroundColor:"green",color:"white",padding:"15px",fontSize:"25px",border:"none",borderRadius:"10px"},children:"Close Webcam"}):(0,PT.jsx)("button",{onClick:()=>{c(!0),navigator.mediaDevices.getUserMedia({video:{width:300}}).then((e=>{let t=r.current;t.srcObject=e,t.play()})).catch((e=>{console.error("error:",e)}))},style:{cursor:"pointer",backgroundColor:"green",color:"white",padding:"15px",fontSize:"25px",border:"none",borderRadius:"10px"},children:"Open Webcam"})}),l?o?(0,PT.jsxs)("div",{className:"face-recognition-container",style:{display:"flex",justifyContent:"center",padding:"10px"},children:[(0,PT.jsx)("video",{ref:r,muted:!0,onPlay:()=>{setInterval((async()=>{if(a&&a.current){a.current.innerHTML=og(r.current);const n={width:640,height:480};!function(e,t,n){void 0===n&&(n=!1);var r=n?rg(t):t,a=r.width,o=r.height;e.width=a,e.height=o}(a.current,n);const o=await(e=r.current,t=new Pv,void 0===t&&(t=new wv),new wy(e,t)).withFaceLandmarks().withFaceExpressions();u(o);const i=ky(o,n);a&&a.current&&a.current.getContext("2d").clearRect(0,0,n.width,n.height),a&&a.current&&(tg(a.current,i),Gg(a.current,i),Wg(a.current,i))}var e,t}),100)},width:640,height:480,style:{borderRadius:"10px"},className:"video-stream"}),(0,PT.jsx)("canvas",{ref:a,style:{position:"absolute"}})]}):(0,PT.jsx)("p",{children:"Loading models..."}):(0,PT.jsx)(PT.Fragment,{}),(0,PT.jsx)("button",{onClick:()=>{const e=r.current;if(e){const r=document.createElement("canvas");r.width=e.videoWidth,r.height=e.videoHeight;if(r.getContext("2d").drawImage(e,0,0,r.width,r.height),s.length>0){const e=ky(s,{width:r.width,height:r.height});tg(r,e),Gg(r,e),Wg(r,e)}const a=r.toDataURL("image/jpeg");n([...t,a]);const o=atob(a.split(",")[1]),i=a.split(",")[0].split(":")[1].split(";")[0],u=new ArrayBuffer(o.length),l=new Uint8Array(u);for(let e=0;e<o.length;e++)l[e]=o.charCodeAt(e);const c=new Blob([u],{type:i}),d=new FormData;d.append("image",c,"capture.jpg"),fetch("http://localhost:5000/upload",{method:"POST",body:d}).then((e=>{if(!e.ok)throw new Error("Failed to upload image.");return e.json()})).then((e=>{console.log("Image saved successfully",e)})).catch((e=>{console.error("Error saving image:",e)}))}},className:"capture-button",style:{cursor:"pointer",backgroundColor:"green",color:"white",padding:"15px",fontSize:"25px",border:"none",borderRadius:"10px"},children:" Capture Image"}),(0,PT.jsx)("div",{className:"captured-images-container",children:t.map(((e,t)=>(0,PT.jsx)("img",{src:e,alt:`Captured ${t}`,className:"captured-image"},t)))})]})},GT=Ht.div`
  width: 100%;
  height: 100%;
  background-color: #2d60a0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #951010;
`;const jT=function(){return(0,PT.jsxs)(GT,{children:[(0,PT.jsx)(HT,{}),(0,PT.jsx)(UT,{})]})},qT=e=>{e&&e instanceof Function&&n.e(453).then(n.bind(n,6453)).then((t=>{let{getCLS:n,getFID:r,getFCP:a,getLCP:o,getTTFB:i}=t;n(e),r(e),a(e),o(e),i(e)}))};t.createRoot(document.getElementById("root")).render((0,PT.jsx)(e.StrictMode,{children:(0,PT.jsx)(jT,{})})),qT()})()})();
//# sourceMappingURL=main.70848725.js.map