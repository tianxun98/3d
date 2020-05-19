!function(o,B,E){"use strict";var P="ht",Z=o[P],b=null,z=Math,c=z.abs,m=z.max,W=Number.MAX_VALUE,M=Z.Default,y=M.getInternal(),L=M.clone,T=y.vec3TransformMat4,Q=y.appendArray,q=function(){var q=/v( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)/,H=/vt( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)/,K=/vn( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)/,J=function(T,h){return h=parseInt(h),h>=0?T[h-1]:T[h+T.length]},I=function(C,M,H,$,E,q){if(C.vs){var v=J(M,$),w=J(M,E),S=J(M,q),U=H.matrix,g=C.vs;if(H.flipFace){var j=w;w=S,S=j}U?(Q(g,T(L(v),U)),Q(g,T(L(w),U)),Q(g,T(L(S),U))):(Q(g,v),Q(g,w),Q(g,S))}},w=function(o,E,K,S,D,l){if(o.vs){var y=J(E,S),s=J(E,D),O=J(E,l),Z=K.flipY;if(K.flipFace){var L=s;s=O,O=L}o.uv.push(y[0],Z?1-y[1]:y[1],s[0],Z?1-s[1]:s[1],O[0],Z?1-O[1]:O[1])}},k=function(u,r,l,C,n,W){if(u.vs){var D=J(r,C),A=J(r,n),m=J(r,W),i=l.normalMatrix,N=u.ns;if(l.flipFace){var Z=A;A=m,m=Z}i?(Q(N,T(L(D),i)),Q(N,T(L(A),i)),Q(N,T(L(m),i))):(Q(N,D),Q(N,A),Q(N,m))}},Y=function(r,T,v,y,U,q,a,l){var O=y&&y.length&&l;q[3]===E?(I(r,T,U,q[0],q[1],q[2]),a&&w(r,v,U,a[0],a[1],a[2]),O&&k(r,y,U,l[0],l[1],l[2])):(I(r,T,U,q[0],q[1],q[3]),I(r,T,U,q[1],q[2],q[3]),a&&(w(r,v,U,a[0],a[1],a[3]),w(r,v,U,a[1],a[2],a[3])),O&&(k(r,y,U,l[0],l[1],l[3]),k(r,y,U,l[1],l[2],l[3])))},G=function(V,z,E,j){var e,x,t,b,F,w,Y,k=W,R=W,l=W,n=-W,U=-W,S=-W;for(e in V)for(w=V[e].vs,Y=w.length,x=0;Y>x;x+=3)t=w[x+0],b=w[x+1],F=w[x+2],k>t&&(k=t),R>b&&(R=b),l>F&&(l=F),t>n&&(n=t),b>U&&(U=b),F>S&&(S=F);if(E){var G=k+(n-k)/2,f=R+(U-R)/2,Q=l+(S-l)/2;for(e in V)for(w=V[e].vs,Y=w.length,x=0;Y>x;x+=3)w[x+0]-=G,w[x+1]-=f,w[x+2]-=Q}var p,C,X;E?(p=n-k,C=U-R,X=S-l):(p=2*m(c(k),c(n)),C=2*m(c(R),c(U)),X=2*m(c(l),c(S))),j.rawS3=[p,C,X];for(e in V){if(w=V[e].vs,z)for(Y=w.length,x=0;Y>x;x+=3)p&&(w[x+0]/=p),C&&(w[x+1]/=C),X&&(w[x+2]/=X);V[e].rawS3=j.rawS3}};return function(I,P,W){if(!I)return b;(y.isString(P)||P instanceof ArrayBuffer)&&(P=s(P)),W||(W={}),W.flipY==b&&(W.flipY=!0),(W.s3||W.r3||W.t3||W.mat)&&(W.matrix=y.createWorldMatrix(W.mat,W.s3,W.r3,W.rotationMode,W.t3));var w,i,U,z,c,f,F=[],T=[],$=W.ignoreNormal?b:[],E=W.reverseFlipMtls,n={vs:[],uv:[],ns:$?[]:b},e={htdefault:n},l=new g(I);for($&&W.matrix&&(W.normalMatrix=y.createNormalMatrix(W.matrix));null!=(i=l.stepNext());)if(i=i.trim(),0!==i.length&&"#"!==i.charAt(0))if(U=q.exec(i))F.push([parseFloat(U[1]),parseFloat(U[2]),parseFloat(U[3])]);else if(U=H.exec(i))T.push([parseFloat(U[1]),parseFloat(U[2])]);else if($&&(U=K.exec(i)))W.flipFace?$.push([parseFloat(-U[1]),parseFloat(-U[2]),parseFloat(-U[3])]):$.push([parseFloat(U[1]),parseFloat(U[2]),parseFloat(U[3])]);else if("f"===i[0]){var L=i.split(/\s+/);if(L.length<4)continue;var k,w,Q,j=[],V=[],p=[];for(w=1,Q=L.length;Q>w;w++)k=L[w].split("/"),j.push(parseInt(k[0],10)),k.length>1&&k[1].length>0&&p.push(parseInt(k[1],10)),k.length>2&&k[2].length>0&&V.push(parseInt(k[2],10));for(w=0,Q=j.length-2;Q>w;w++)Y(n,F,T,$,W,[j[0],j[w+1],j[w+2]],p.length?[p[0],p[w+1],p[w+2]]:b,V.length?[V[0],V[w+1],V[w+2]]:b)}else if(/^usemtl /.test(i)&&(z=i.substring(7).trim(),!(n=e[z]))){if(n={name:z,vs:[],uv:[],ns:$?[]:b},W.ignoreMtls&&W.ignoreMtls.indexOf(z)>=0&&delete n.vs,(W.reverseFlip||"*"===E||E&&E.indexOf(z)>=0)&&(n.reverseFlip=!0),P&&(c=P[z],c&&(W.ignoreColor||(n.color=c.kd),!W.ignoreTransparent&&c.d>0&&c.d<1&&(n.transparent=!0,n.opacity=c.d),!W.ignoreImage&&(f=c.map_kd)))){f=f.split(" ");var D=-1;for(w=0;w<f.length;w++)"-o"===f[w]?(n.uvOffset=[parseFloat(f[w+1]),parseFloat(f[w+2])],w+=2,D=w):"-s"===f[w]&&(n.uvScale=[parseFloat(f[w+1]),parseFloat(f[w+2])],w+=2,D=w);n.image=(W.prefix||"")+f.splice(D+1).join(" ")}e[z]=n}var h=[];for(var r in e){var a=e[r].vs;a&&0!==a.length||h.push(r)}h.forEach(function(S){delete e[S]}),G(e,W.cube,W.center,W);var J=W.shape3d;if(J){var _=[];for(var z in e){var n=e[z];_.rawS3=n.rawS3,_.push(n)}M.setShape3dModel(J,_)}return e}}(),s=function(a){var A={};if(a)for(var H,s,I,R,o,F,q=new g(a),l=/\s+/;null!=(s=q.stepNext());)s=s.trim(),0!==s.length&&"#"!==s.charAt(0)&&(I=s.indexOf(" "),R=(I?s.substring(0,I):s).toLowerCase(),o=(I?s.substring(I+1):"").trim(),"newmtl"===R?A[o]=H={name:o}:H&&("ka"===R||"kd"===R||"ks"===R?(F=o.split(l,3),H[R]=[parseFloat(F[0]),parseFloat(F[1]),parseFloat(F[2]),1]):H[R]="ns"===R||"d"===R?parseFloat(o):o));return A},g=function(c){var n=this;if(c instanceof ArrayBuffer){n.isBuffer=!0;var C=0,w=new Uint8Array(c),E=w.length,W=w.length;n.stepNext=function(){for(var Y,p,K=C;E>C;)if(Y=w[C],p=Y>>4,12===p||13==p)C+=2;else if(14===p)C+=3;else if(C++,10===Y)return String.fromCharCode.apply(null,w.subarray(K,C));return C>K?String.fromCharCode.apply(null,w.subarray(K,C)):null}}else{n.isBuffer=!1;var l=c.split("\n"),j=0,W=l.length;n.stepNext=function(){return W>j?l[j++]:null}}};g.prototype={},g.prototype.constructor=g,y.addMethod(M,{loadObj:function(X,T,E){E=E||{};var i=!1;/(MSIE |Trident\/|Edge\/)/.test(o.navigator.userAgent)&&(i=!0);var w=function(p){var Y,K=E.finishFunc,B=E.shape3d,D=p?q(p[0],p[1],E):null;if(D){if(B)Y=M.getShape3dModel(B);else{Y=[];for(var z in D){var t=D[z];Y.rawS3=t.rawS3,Y.push(t)}}K&&K(D,Y,Y.rawS3)}else K&&K(null)};if(i){var a=function(K){E.responseType="arraybuffer",M.xhrLoad(X,function(I){w([I,K])},E)};T?M.xhrLoad(T,function(n){a(n)},E):a()}else M.xhrLoad(T?[X,T]:[X],w,E)},parseObj:function(f,m,O){return q(f,m,O)}})}("undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:(0,eval)("this"),Object);