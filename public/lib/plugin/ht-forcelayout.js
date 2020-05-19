!function(U,u){"use strict";var Q="ht",J=Q+".layout.",K=U[Q]||module.parent.exports.ht,m=K.List,T=K.DataModel,S=K.Node,z=K.Edge,Z=K.Group,i=Math,y=i.sqrt,G=i.random,t=i.max,L=i.min,M=function(T){return T*T};K.Default.getInternal().addMSMap({ms_force:function(i){i._interval=50,i._stepCount=10,i._motionLimit=.01,i._edgeRepulsion=.65,i._nodeRepulsion=.65,i._damper=1,i._maxMotion=0,i._motionRatio=0,i.init=function(t){var H=this;t instanceof T?H.dm=t:H.gv=t,H._nodeMap={},H._nodes=new m,H._edges=new m},i.start=function(){var L=this,y=L.gv;if(!L._timer){var Q=L.cdm=y?y.dm():L.dm;Q.mm(L.handleDataModelChange,L),Q.md(L.handleDataPropertyChange,L),y&&y.mp(L.handleGV,L),Q.each(function(C){if(L.isVisible(C)&&L.isLayoutable(C)&&C instanceof S)if(L instanceof f){var E=C.p3();C.p3([E[0]+G(),E[1]+G(),E[2]+G()])}else E=C.p(),C.p(E.x+G(),E.y+G())}),L._timer=setInterval(function(){L.relax()},L._interval),L._damper=1}},i.stop=function(){var u=this;u._timer&&(u.cdm.umm(u.handleDataModelChange,u),u.cdm.umd(u.handleDataPropertyChange,u),u.gv&&u.gv.ump(u.handleGV,u),clearInterval(u._timer),delete u._timer,delete u.cdm)},i.handleGV=function(q){var h=this;if("dataModel"===q.property){var b=q.oldValue,T=q.newValue;b&&(b.umm(h.handleDataModelChange,h),b.umd(h.handleDataPropertyChange,h)),this.cdm=T,T.mm(h.handleDataModelChange,h),T.md(h.handleDataPropertyChange,h)}},i.relax=function(){var q=this;if(!(q._damper<.1&&q._maxMotion<q._motionLimit)){this.cdm.each(function(N){q.isVisible(N)&&(N instanceof z?q.addEdge(N):N instanceof S&&q.addNode(N))});for(var o,K,p=0,H=q._edges,e=q._nodes,B=e.size();p<q._stepCount;p++){for(H.each(q.relaxEdge,q),o=0;B>o;o++)for(K=0;B>K;K++)q.relaxNode(e.get(o),e.get(K));q.moveNode()}q._isAdjusting=1,e.each(function(R){R.fix||(R.p?R.v.p3(R.p):R.v.p(R.x,R.y))}),delete q._isAdjusting,q._nodeMap={},e.clear(),H.clear(),q.onRelaxed()}},i.onRelaxed=function(){},i.isRunning=function(){return!!this._timer},i.isVisible=function(Z){return Z.s("layoutable")===!1?!1:this.gv?this.gv.isVisible(Z):!0},i.isLayoutable=function(A){if(A.s("layoutable")===!1)return!1;if(A instanceof Z)return!1;var h=this;return h.gv?h.gv.isMovable(A)&&!h.gv.isSelected(A):!(h.cdm||h.dm).sm().co(A)},i.getNodeRepulsion=function(){return this._nodeRepulsion},i.setNodeRepulsion=function(E){this._nodeRepulsion=E,this._damper=1},i.getEdgeRepulsion=function(){return this._edgeRepulsion},i.setEdgeRepulsion=function(z){this._edgeRepulsion=z,this._damper=1},i.getStepCount=function(){return this._stepCount},i.setStepCount=function(h){this._stepCount=h,this._damper=1},i.getInterval=function(){return this._interval},i.setInterval=function(h){var k=this;k._interval!==h&&(k._interval=h,k._timer&&(clearInterval(k._timer),k._timer=setInterval(function(){k.relax()},h)))},i.handleDataPropertyChange=function(y){!this._isAdjusting&&this.isVisible(y.data)&&(this._damper=1)},i.handleDataModelChange=function(){this._damper=1},i.damp=function(){var H=this._maxMotion,c=this._damper;this._motionRatio<=.001&&((.2>H||H>1&&.9>c)&&c>.01?this._damper-=.01:.4>H&&c>.003?this._damper-=.003:c>1e-4&&(this._damper-=1e-4)),H<this._motionLimit&&(this._damper=0)}}}),K.layout.ForceLayout=function(T){this.init(T)},K.Default.def(J+"ForceLayout",u,{ms_force:1,getLimitBounds:function(){return this._limitBounds},setLimitBounds:function($){this._limitBounds=$,this._damper=1},getNodeSize:function(F){var v=this.gv;return v&&v.getDataUIBounds?v.getDataUIBounds(F):F.getRect()},addNode:function(W){var Z=this,K=Z._nodeMap[W._id];if(K)return K;var s=W.p();K={v:W,x:s.x,y:s.y,dx:0,dy:0,fix:!Z.isLayoutable(W),s:Z.getNodeSize(W)};var i=K.s,H=y(M(i.width)+M(i.height))*Z._nodeRepulsion;return K.r=1>H?100:H,Z._nodeMap[W._id]=K,Z._nodes.add(K),K},addEdge:function(D){if(D._40I&&D._41I){var Z=this,l=Z.addNode(D._40I),b=Z.addNode(D._41I),P={s:l,t:b};b=b.s,l=l.s;var $=b.width+l.width,i=b.height+l.height;P.length=y($*$+i*i)*Z._edgeRepulsion,P.length<=0&&(P.length=100),Z._edges.add(P)}},relaxEdge:function(i){var E=i.t,J=i.s,z=E.x-J.x,L=E.y-J.y,_=y(z*z+L*L),m=100*i.length,D=.25*z/m*_,d=.25*L/m*_;E.dx=E.dx-D,E.dy=E.dy-d,J.dx=J.dx+D,J.dy=J.dy+d},relaxNode:function(T,y){if(T!==y){var I=0,x=0,l=T.x-y.x,_=T.y-y.y,Q=l*l+_*_;0===Q?(I=G(),x=G()):36e4>Q&&(I=l/Q,x=_/Q);var N=T.r*y.r/400;I*=N,x*=N,T.dx+=I,T.dy+=x,y.dx-=I,y.dy-=x}},moveNode:function(){var Y=this,D=Y._limitBounds,i=Y._maxMotion,R=0,K=Y._damper;Y._nodes.each(function(C){if(!C.fix){var p=C.dx*K,s=C.dy*K;if(C.dx=p/2,C.dy=s/2,R=t(y(p*p+s*s),R),C.x+=t(-40,L(40,p)),C.y+=t(-40,L(40,s)),D){C.x<D.x&&(C.x=D.x,Y.adjust(1,0)),C.y<D.y&&(C.y=D.y,Y.adjust(0,1));var h=C.s;C.x+h.width>D.x+D.width&&(C.x=D.x+D.width-h.width,Y.adjust(-1,0)),C.y+h.height>D.y+D.height&&(C.y=D.y+D.height-h.height,Y.adjust(0,-1))}}}),Y._maxMotion=R,Y._motionRatio=R>0?i/R-1:0,Y.damp()},adjust:function(X,t){var A=this._limitBounds;this._nodes.each(function(e){X>0?(!A||e.x+e.s.width+X<A.x+A.width)&&(e.x+=X):(!A||e.x+X>A.x)&&(e.x+=X),t>0?(!A||e.y+e.s.height+t<A.y+A.height)&&(e.y+=t):(!A||e.y+t>A.y)&&(e.y+=t)})}});var f=K.layout.Force3dLayout=function(c){this.init(c)};K.Default.def(J+"Force3dLayout",u,{ms_force:1,getNodeSize3d:function(s){return s.s3()},addNode:function(g){var m=this,C=m._nodeMap[g._id];if(C)return C;C={v:g,p:g.p3(),d:[0,0,0],fix:!m.isLayoutable(g),s:m.getNodeSize3d(g)};var o=C.s,w=K.Default.getDistance(o)*m._nodeRepulsion;return C.r=1>w?100:w,m._nodeMap[g._id]=C,m._nodes.add(C),C},addEdge:function(A){if(A._40I&&A._41I){var z=this,k=z.addNode(A._40I),F=z.addNode(A._41I),a={s:k,t:F};F=F.s,k=k.s,a.length=y(M(F[0]+k[0])+M(F[1]+k[1])+M(F[2]+k[2]))*z._edgeRepulsion,a.length<=0&&(a.length=100),z._edges.add(a)}},relaxEdge:function(g){var m=g.t.p,i=g.s.p,e=g.t.d,S=g.s.d,W=m[0]-i[0],a=m[1]-i[1],x=m[2]-i[2],N=y(W*W+a*a+x*x),V=100*g.length,T=.25*W/V*N,X=.25*a/V*N,s=.25*x/V*N;e[0]-=T,e[1]-=X,e[2]-=s,S[0]+=T,S[1]+=X,S[2]+=s},relaxNode:function(f,L){if(f!==L){var l=f.p,i=L.p,M=0,t=0,A=0,x=l[0]-i[0],b=l[1]-i[1],u=l[2]-i[2],n=x*x+b*b+u*u;0===n?(M=G(),t=G(),A=G()):216e6>n&&(M=x/n,t=b/n,A=u/n);var Q=f.r*L.r/400,e=f.d,S=L.d;M*=Q,t*=Q,A*=Q,e[0]+=M,e[1]+=t,e[2]+=A,S[0]-=M,S[1]-=t,S[2]-=A}},moveNode:function(){var U=this,R=U._maxMotion,F=0,w=U._damper;U._nodes.each(function(g){if(!g.fix){var i=g.p,u=g.d,S=u[0]*w,s=u[1]*w,e=u[2]*w;u[0]=S/2,u[1]=s/2,u[2]=e/2,F=t(y(S*S+s*s+e*e),F),i[0]+=t(-40,L(40,S)),i[1]+=t(-40,L(40,s)),i[2]+=t(-40,L(40,e))}}),U._maxMotion=F,U._motionRatio=F>0?R/F-1:0,U.damp()}})}("undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:(0,eval)("this"),Object);