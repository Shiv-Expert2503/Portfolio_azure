import{r as P,C as g,V as A,u as w,j as h,A as F}from"./index-PP5nGYZV.js";const j=(c,s=2)=>{const r=[];for(let t=0;t<c;t++){const e=(Math.random()-.5)*2.5,a=Math.sin(e*Math.PI*s)*.5,i=(Math.random()-.5)*.5;r.push(e,a,i)}return new Float32Array(r)},C=c=>{const s=[];let o=1,t=1,e=1;const a=10,i=28,u=8/3;for(let n=0;n<c;n++){const l=a*(t-o)*.01,f=(o*(i-e)-t)*.01,p=(o*t-u*e)*.01;o+=l,t+=f,e+=p,s.push(o*.03,t*.03,e*.03)}return new Float32Array(s)},E=c=>{const s=[];let o=.1,t=0,e=0;const a=.95,i=.7,u=.6,n=3.5,l=.25,f=.1;for(let p=0;p<c;p++){const m=((e-i)*o-n*t)*.01,y=(n*o+(e-i)*t)*.01,b=(u+a*e-e*e*e/3-(o*o+t*t)*(1+l*e)+f*e*(o*o*o))*.01;o+=m,t+=y,e+=b,s.push(o*.15,t*.15,e*.15)}return new Float32Array(s)},D=c=>{const s=[];for(let t=0;t<c;t++){const e=Math.floor(Math.random()*360),a=e*71*Math.PI/180,i=.4*Math.sin(6*e*Math.PI/180),u=i*Math.cos(a),n=i*Math.sin(a),l=(Math.random()-.5)*.3;s.push(u,n,l)}return new Float32Array(s)},I=c=>{const s=[],d=[[0,.8,0],[-.6928000000000001,-.4,0],[.6928000000000001,-.4,0]];let o=0,t=0,e=0;for(let a=0;a<c;a++){const i=d[Math.floor(Math.random()*3)];o=(o+i[0])/2,t=(t+i[1])/2,e=(e+i[2])/2+(Math.random()-.5)*.1,s.push(o,t,e)}return new Float32Array(s)},_=c=>{const s=[];for(let d=0;d<c;d++){const o=(Math.random()-.5)*1.5,t=(Math.random()-.5)*1.5,e=Math.sqrt((o-.3)*(o-.3)+t*t),a=Math.sqrt((o+.3)*(o+.3)+t*t),i=.1*(Math.sin(10*e)+Math.sin(10*a));s.push(o,i,t)}return new Float32Array(s)},L=c=>{const s=[];let o=1,t=1,e=1;const a=3,i=2.7,u=1.7,n=2,l=9;for(let f=0;f<c;f++){const p=(t-a*o+i*t*e)*.005,m=(u*t-o*e+e)*.005,y=(n*o*t-l*e)*.005;o+=p,t+=m,e+=y,s.push(o*.05,t*.05,e*.05)}return new Float32Array(s)},R=c=>{const s=[];let o=.1,t=0,e=0;const a=.208186;for(let i=0;i<c;i++){const u=(Math.sin(t)-a*o)*.05,n=(Math.sin(e)-a*t)*.05,l=(Math.sin(o)-a*e)*.05;o+=u,t+=n,e+=l,s.push(o*.5,t*.5,e*.5)}return new Float32Array(s)},T=c=>{const s=[];let o=1,t=1,e=1;const a=5,i=-10,u=-.38;for(let n=0;n<c;n++){const l=(a*o-t*e)*.002,f=(i*t+o*e)*.002,p=(u*e+o*t/3)*.002;o+=l,t+=f,e+=p,s.push(o*.04,t*.04,e*.04)}return new Float32Array(s)},B=c=>{const s=[];let o=1,t=1,e=1;const a=36,i=3,u=20;for(let n=0;n<c;n++){const l=a*(t-o)*.001,f=(o-o*e+u*t)*.001,p=(o*t-i*e)*.001;o+=l,t+=f,e+=p,s.push(o*.02,t*.02,e*.02)}return new Float32Array(s)},N=c=>{const s=[];let o=1,t=1,e=1;const a=50,i=24,u=13;for(let n=0;n<c;n++){const l=(a*(t-o)+t*e)*.01,f=(i*o+t-o*e)*.01,p=(o*t-u*e)*.01;o+=l,t+=f,e+=p,s.push(o*.15,t*.15,e*.15)}return new Float32Array(s)},W=`
  attribute vec3 targetPosition1, targetPosition2, targetPosition3, targetPosition4, targetPosition5, targetPosition6,
                 targetPosition7, targetPosition8, targetPosition9, targetPosition10, targetPosition11;
  uniform float progress, currentShape, size;
  uniform vec2 uMouse;

  // ✅ ADD THE SCALES ARRAY UNIFORM (The number must match the number of shapes)
  uniform float uScales[13];

  void main() {
    vec3 pos1, pos2;
    // This part is the same
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
    else { pos1 = targetPosition11; pos2 = position; }

    // --- ✨ NEW SCALING LOGIC ---
    // Get the integer index for the current and next shapes
    int index1 = int(currentShape);
    int index2 = (index1 + 1) % 12; // Use modulo to wrap around from 11 to 0

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
`,k=`
  uniform vec3 color1, color2;
  uniform float progress;
  void main() {
    if (length(gl_PointCoord - vec2(0.5, 0.5)) > 0.475) discard;
    vec3 finalColor = mix(color1, color2, progress);
    gl_FragColor = vec4(finalColor, 1.0);
  }
`,O=({setCurrentStage:c})=>{const s=P.useRef(),[r,d]=P.useState([]),o=45e3,t=P.useMemo(()=>[{name:"Neuron",type:"bin",path:"/brain_normalized_150k.bin",color:new g("#00ffff")},{name:"Brain",type:"procedural",generator:j,color:new g("#4d00ff")},{name:"SineWave",type:"procedural",generator:_,color:new g("#ff00ff"),scale:1.5},{name:"TangentWave",type:"procedural",generator:R,color:new g("#ff0055"),position:[0,-1,0]},{name:"Lorenz",type:"procedural",generator:C,color:new g("#ff4500"),scale:1.5,position:[0,-.5,0]},{name:"Torus",type:"procedural",generator:T,color:new g("#ff7f00")},{name:"Mobius",type:"procedural",generator:D,color:new g("#ffff00"),scale:2},{name:"Butterfly",type:"procedural",generator:E,color:new g("#9370db"),scale:3},{name:"MaurerRose",type:"procedural",generator:I,color:new g("#00ff00")},{name:"DeepSkyBlueShape",type:"procedural",generator:B,color:new g("#00bfff"),scale:1.5},{name:"Dadras",type:"procedural",generator:L,color:new g("#7B68EE"),scale:1.5},{name:"Cardioid",type:"procedural",generator:N,color:new g("#FF69B4")}],[]);P.useEffect(()=>{const u=t.filter(n=>n.type==="bin").map(n=>fetch(n.path).then(l=>l.arrayBuffer()));Promise.all(u).then(n=>{const l={};t.filter(p=>p.type==="bin").forEach((p,m)=>{l[p.name]=new Float32Array(n[m])});const f=t.map(p=>p.type==="bin"?l[p.name]:p.generator(o));d(f)}).catch(n=>console.error("Failed to load particle data:",n))},[t,o]);const e=P.useMemo(()=>t.map(u=>u.color),[t]),a=P.useMemo(()=>t.map(u=>u.scale||1),[t]),i=P.useMemo(()=>({progress:{value:0},currentShape:{value:0},size:{value:1.75},color1:{value:e[0]},color2:{value:e[1]},uMouse:{value:new A(0,0)},uScales:{value:a}}),[e,a]);return w(({clock:u,mouse:n})=>{if(s.current&&r.length>0){s.current.rotation.y+=.002,s.current.material.uniforms.uMouse.value.lerp(n,.1);const l=2,f=5,p=e.length,m=l+f,y=m*p,b=u.getElapsedTime()%y,x=Math.floor(b/m);c&&c(x%4+1);const S=b%m;let M=S<l?S/l:1;s.current.material.uniforms.currentShape.value=x,s.current.material.uniforms.progress.value=M;const z=x,v=(x+1)%p;s.current.material.uniforms.color1.value=e[z],s.current.material.uniforms.color2.value=e[v]}}),r.length<t.length?null:h.jsxs("points",{ref:s,position:[0,.1,0],scale:1.65,children:[h.jsxs("bufferGeometry",{attach:"geometry",children:[h.jsx("bufferAttribute",{attach:"attributes-position",count:r[0].length/3,array:r[0],itemSize:3}),h.jsx("bufferAttribute",{attach:"attributes-targetPosition1",count:r[1].length/3,array:r[1],itemSize:3}),h.jsx("bufferAttribute",{attach:"attributes-targetPosition2",count:r[2].length/3,array:r[2],itemSize:3}),h.jsx("bufferAttribute",{attach:"attributes-targetPosition3",count:r[3].length/3,array:r[3],itemSize:3}),h.jsx("bufferAttribute",{attach:"attributes-targetPosition4",count:r[4].length/3,array:r[4],itemSize:3}),h.jsx("bufferAttribute",{attach:"attributes-targetPosition5",count:r[5].length/3,array:r[5],itemSize:3}),h.jsx("bufferAttribute",{attach:"attributes-targetPosition6",count:r[6].length/3,array:r[6],itemSize:3}),h.jsx("bufferAttribute",{attach:"attributes-targetPosition7",count:r[7].length/3,array:r[7],itemSize:3}),h.jsx("bufferAttribute",{attach:"attributes-targetPosition8",count:r[8].length/3,array:r[8],itemSize:3}),h.jsx("bufferAttribute",{attach:"attributes-targetPosition9",count:r[9].length/3,array:r[9],itemSize:3}),h.jsx("bufferAttribute",{attach:"attributes-targetPosition10",count:r[10].length/3,array:r[10],itemSize:3}),h.jsx("bufferAttribute",{attach:"attributes-targetPosition11",count:r[11].length/3,array:r[11],itemSize:3})]}),h.jsx("shaderMaterial",{attach:"material",vertexShader:W,fragmentShader:k,uniforms:i,depthWrite:!1,blending:F})]})};export{O as default};
