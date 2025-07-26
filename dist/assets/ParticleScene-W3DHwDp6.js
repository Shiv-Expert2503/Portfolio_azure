import{r as P,C as g,V as A,u as v,j as f,A as j}from"./index-8Nn74d9k.js";const F=(c,s=2)=>{const a=[];for(let t=0;t<c;t++){const e=(Math.random()-.5)*2.5,r=Math.sin(e*Math.PI*s)*.5,i=(Math.random()-.5)*.5;a.push(e,r,i)}return new Float32Array(a)},C=c=>{const s=[];let o=1,t=1,e=1;const r=10,i=28,l=8/3;for(let n=0;n<c;n++){const u=r*(t-o)*.01,d=(o*(i-e)-t)*.01,p=(o*t-l*e)*.01;o+=u,t+=d,e+=p,s.push(o*.03,t*.03,e*.03)}return new Float32Array(s)},E=c=>{const s=[];let o=.1,t=0,e=0;const r=.95,i=.7,l=.6,n=3.5,u=.25,d=.1;for(let p=0;p<c;p++){const m=((e-i)*o-n*t)*.01,y=(n*o+(e-i)*t)*.01,M=(l+r*e-e*e*e/3-(o*o+t*t)*(1+u*e)+d*e*(o*o*o))*.01;o+=m,t+=y,e+=M,s.push(o*.15,t*.15,e*.15)}return new Float32Array(s)},I=c=>{const s=[];for(let t=0;t<c;t++){const e=Math.floor(Math.random()*360),r=e*71*Math.PI/180,i=.4*Math.sin(6*e*Math.PI/180),l=i*Math.cos(r),n=i*Math.sin(r),u=(Math.random()-.5)*.3;s.push(l,n,u)}return new Float32Array(s)},R=c=>{const s=[],h=[[0,.8,0],[-.6928000000000001,-.4,0],[.6928000000000001,-.4,0]];let o=0,t=0,e=0;for(let r=0;r<c;r++){const i=h[Math.floor(Math.random()*3)];o=(o+i[0])/2,t=(t+i[1])/2,e=(e+i[2])/2+(Math.random()-.5)*.1,s.push(o,t,e)}return new Float32Array(s)},D=c=>{const s=[];for(let h=0;h<c;h++){const o=(Math.random()-.5)*1.5,t=(Math.random()-.5)*1.5,e=Math.sqrt((o-.3)*(o-.3)+t*t),r=Math.sqrt((o+.3)*(o+.3)+t*t),i=.1*(Math.sin(10*e)+Math.sin(10*r));s.push(o,i,t)}return new Float32Array(s)},L=c=>{const s=[];let o=1,t=1,e=1;const r=3,i=2.7,l=1.7,n=2,u=9;for(let d=0;d<c;d++){const p=(t-r*o+i*t*e)*.005,m=(l*t-o*e+e)*.005,y=(n*o*t-u*e)*.005;o+=p,t+=m,e+=y,s.push(o*.05,t*.05,e*.05)}return new Float32Array(s)},_=c=>{const s=[];let o=.1,t=0,e=0;const r=.208186;for(let i=0;i<c;i++){const l=(Math.sin(t)-r*o)*.05,n=(Math.sin(e)-r*t)*.05,u=(Math.sin(o)-r*e)*.05;o+=l,t+=n,e+=u,s.push(o*.5,t*.5,e*.5)}return new Float32Array(s)},T=c=>{const s=[];let o=1,t=1,e=1;const r=5,i=-10,l=-.38;for(let n=0;n<c;n++){const u=(r*o-t*e)*.002,d=(i*t+o*e)*.002,p=(l*e+o*t/3)*.002;o+=u,t+=d,e+=p,s.push(o*.04,t*.04,e*.04)}return new Float32Array(s)},W=c=>{const s=[];let o=1,t=1,e=1;const r=36,i=3,l=20;for(let n=0;n<c;n++){const u=r*(t-o)*.001,d=(o-o*e+l*t)*.001,p=(o*t-i*e)*.001;o+=u,t+=d,e+=p,s.push(o*.02,t*.02,e*.02)}return new Float32Array(s)},k=c=>{const s=[];for(let h=0;h<c;h++){const o=Math.random()*8*Math.PI,t=Math.random()*2*Math.PI,e=.2*Math.exp(.1*o),r=.05*Math.exp(.08*o),i=e+r*Math.cos(t),l=.1*i*Math.cos(o),n=.1*i*Math.sin(o),u=.1*r*Math.sin(t);s.push(l,n,u)}return new Float32Array(s)},G=c=>{const s=[];let e=.1,r=.1;const i=.55;for(let l=0;l<c;l++){const n=Math.sin(-1.4*r)+1*Math.cos(-1.4*e),u=Math.sin(1.6*e)+.7*Math.cos(1.6*r);e=n,r=u,s.push(e*i,r*i,(Math.random()-.5)*.05)}return new Float32Array(s)},N=(c,s=7,a=1,h=1,o=.3,t=.3,e=.3)=>{const r=[];for(let l=0;l<c;l++){const n=l/c*Math.PI*2,u=Math.pow(Math.pow(Math.abs(Math.cos(s*n/4)/a),t)+Math.pow(Math.abs(Math.sin(s*n/4)/h),e),-1/o),d=.5*u*Math.cos(n),p=.5*u*Math.sin(n);r.push(d,p,(Math.random()-.5)*.1)}return new Float32Array(r)},B=c=>{const s=[];for(let h=0;h<c;h++){const o=Math.random()*2*Math.PI,t=Math.sin(4*o)+Math.cos(7*o),e=.4*t*Math.cos(o),r=.4*t*Math.sin(o);s.push(e,r,(Math.random()-.5)*.1)}return new Float32Array(s)},V=`
  precision highp float;
  // We have 1 starting position + 13 targets = 14 shapes.
  // So we only need targetPosition1 to targetPosition13.
  attribute vec3 targetPosition1, targetPosition2, targetPosition3, targetPosition4, targetPosition5, targetPosition6,
                 targetPosition7, targetPosition8, targetPosition9, targetPosition10, targetPosition11, targetPosition12, targetPosition13;
  uniform float progress, currentShape, size;
  uniform vec2 uMouse;

  // The array size must match the number of shapes EXACTLY.
  uniform float uScales[14]; // ✅ CHANGED to 14

  void main() {
    vec3 pos1, pos2;
    // We only go up to 13, since that's our last target attribute
    if (currentShape < 1.0) { pos1 = position; pos2 = targetPosition1; }
    else if (currentShape < 2.0) { pos1 = targetPosition1; pos2 = targetPosition2; }
    else if (currentShape < 3.0) { pos1 = targetPosition2; pos2 = targetPosition3; }
    else if (currentShape < 4.0) { pos1 = targetPosition3; pos2 = targetPosition4; }
    else if (currentShape < 5.0) { pos1 = targetPosition4; pos2 = targetPosition5; }
    else if (currentShape < 6.0) { pos1 = targetPosition5; pos2 = targetPosition6; }
    else if (currentShape < 7.0) { pos1 = targetPosition6; pos2 = targetPosition7; }
    else if (currentShape < 8.0) { pos1 = targetPosition7; pos2 = targetPosition8; }
    else if (currentShape < 9.0) { pos1 = targetPosition8; pos2 = targetPosition9; }
    else if (currentShape < 10.0) { pos1 = targetPosition9; pos2 = targetPosition10; }
    else if (currentShape < 11.0) { pos1 = targetPosition10; pos2 = targetPosition11; }
    else if (currentShape < 12.0) { pos1 = targetPosition11; pos2 = targetPosition12; }
    else if (currentShape < 13.0) { pos1 = targetPosition12; pos2 = targetPosition13; }
    else { pos1 = targetPosition13; pos2 = position; } // ✅ Last shape transitions back to first

    // Get the integer index for the current and next shapes
    int index1 = int(currentShape);
    // Use modulo 14 to wrap around correctly
    int index2 = (index1 + 1) % 14; // ✅ CHANGED to 14

    // Look up the scales from our uniform array
    float scale1 = uScales[index1];
    float scale2 = uScales[index2];

    // Apply the individual scales
    vec3 scaled_pos1 = pos1 * scale1;
    vec3 scaled_pos2 = pos2 * scale2;
    // --- END OF NEW LOGIC ---

    // Calculate the morphed position using the SCALED vectors
    vec3 finalPosition = mix(scaled_pos1, scaled_pos2, progress);

    // The mouse effect part is the same
    float dist = distance(finalPosition.xy, uMouse);
    float radius = 0.3;
    if (dist < radius) {
        float force = (radius - dist) / radius;
        finalPosition.z += force * 0.2;
    }

    vec4 mvPosition = modelViewMatrix * vec4(finalPosition, 1.0);
    gl_PointSize = size;
    gl_Position = projectionMatrix * mvPosition;
  }
`,q=`
  precision highp float;
  uniform vec3 color1, color2;
  uniform float progress;
  void main() {
    if (length(gl_PointCoord - vec2(0.5, 0.5)) > 0.475) discard;
    vec3 finalColor = mix(color1, color2, progress);
    gl_FragColor = vec4(finalColor, 1.0);
  }
`,O=({setCurrentStage:c})=>{const s=P.useRef(),[a,h]=P.useState([]),o=15e4,t=P.useMemo(()=>[{name:"SineWave",type:"procedural",generator:F,color:new g("#4d00ff")},{name:"Interference",type:"procedural",generator:D,color:new g("#ff00ff"),scale:1.5},{name:"Chen",type:"procedural",generator:T,color:new g("#ff7f00")},{name:"Rennard",type:"procedural",generator:B,color:new g("#00ff7f"),scale:1.5},{name:"Clifford",type:"procedural",generator:G,color:new g("#00ff7f"),position:[-10,0,0]},{name:"Superformula",type:"procedural",generator:N,color:new g("#8a2be2"),scale:3},{name:"Seashell",type:"procedural",generator:k,color:new g("#ff4500"),scale:4},{name:"Lorenz",type:"procedural",generator:C,color:new g("#ff4500"),scale:1.5,position:[0,-.5,0]},{name:"ThomasPoint",type:"procedural",generator:_,color:new g("#ff0055"),position:[0,-1,0]},{name:"MaurerRose",type:"procedural",generator:I,color:new g("#00bfff"),scale:2},{name:"Aizawa",type:"procedural",generator:E,color:new g("#9370db"),scale:3,position:[-3,0,0]},{name:"Sierpinski",type:"procedural",generator:R,color:new g("#00ff00")},{name:"LuChen",type:"procedural",generator:W,color:new g("#ffff00"),scale:1.5},{name:"Dadras",type:"procedural",generator:L,color:new g("#7B68EE"),scale:1.5}],[]);P.useEffect(()=>{const l=t.filter(n=>n.type==="bin").map(n=>fetch(n.path).then(u=>u.arrayBuffer()));Promise.all(l).then(n=>{const u={};t.filter(p=>p.type==="bin").forEach((p,m)=>{u[p.name]=new Float32Array(n[m])});const d=t.map(p=>p.type==="bin"?u[p.name]:p.generator(o));h(d)}).catch(n=>console.error("Failed to load particle data:",n))},[t,o]);const e=P.useMemo(()=>t.map(l=>l.color),[t]),r=P.useMemo(()=>t.map(l=>l.scale||1),[t]),i=P.useMemo(()=>({progress:{value:0},currentShape:{value:0},size:{value:1.75},color1:{value:e[0]},color2:{value:e[1]},uMouse:{value:new A(0,0)},uScales:{value:r}}),[e,r]);return v(({clock:l,mouse:n})=>{if(s.current&&a.length>0){s.current.rotation.y+=.002,s.current.material.uniforms.uMouse.value.lerp(n,.1);const u=2,d=5,p=e.length,m=u+d,y=m*p,M=l.getElapsedTime()%y,b=Math.floor(M/m);c&&c(b%4+1);const x=M%m;let S=x<u?x/u:1;s.current.material.uniforms.currentShape.value=b,s.current.material.uniforms.progress.value=S;const z=b,w=(b+1)%p;s.current.material.uniforms.color1.value=e[z],s.current.material.uniforms.color2.value=e[w]}}),a.length<t.length?null:f.jsxs("points",{ref:s,position:[0,.1,0],scale:1.65,children:[f.jsxs("bufferGeometry",{attach:"geometry",children:[f.jsx("bufferAttribute",{attach:"attributes-position",count:a[0].length/3,array:a[0],itemSize:3}),f.jsx("bufferAttribute",{attach:"attributes-targetPosition1",count:a[1].length/3,array:a[1],itemSize:3}),f.jsx("bufferAttribute",{attach:"attributes-targetPosition2",count:a[2].length/3,array:a[2],itemSize:3}),f.jsx("bufferAttribute",{attach:"attributes-targetPosition3",count:a[3].length/3,array:a[3],itemSize:3}),f.jsx("bufferAttribute",{attach:"attributes-targetPosition4",count:a[4].length/3,array:a[4],itemSize:3}),f.jsx("bufferAttribute",{attach:"attributes-targetPosition5",count:a[5].length/3,array:a[5],itemSize:3}),f.jsx("bufferAttribute",{attach:"attributes-targetPosition6",count:a[6].length/3,array:a[6],itemSize:3}),f.jsx("bufferAttribute",{attach:"attributes-targetPosition7",count:a[7].length/3,array:a[7],itemSize:3}),f.jsx("bufferAttribute",{attach:"attributes-targetPosition8",count:a[8].length/3,array:a[8],itemSize:3}),f.jsx("bufferAttribute",{attach:"attributes-targetPosition9",count:a[9].length/3,array:a[9],itemSize:3}),f.jsx("bufferAttribute",{attach:"attributes-targetPosition10",count:a[10].length/3,array:a[10],itemSize:3}),f.jsx("bufferAttribute",{attach:"attributes-targetPosition11",count:a[11].length/3,array:a[11],itemSize:3}),f.jsx("bufferAttribute",{attach:"attributes-targetPosition12",count:a[12].length/3,array:a[12],itemSize:3}),f.jsx("bufferAttribute",{attach:"attributes-targetPosition13",count:a[13].length/3,array:a[13],itemSize:3})]}),f.jsx("shaderMaterial",{attach:"material",vertexShader:V,fragmentShader:q,uniforms:i,depthWrite:!1,blending:j})]})};export{O as default};
