!function(r,o){"use strict";var F="ht",y=r[F],H=function(I){return(/ble$/.test(I)||/ed$/.test(I)||y.IsGetter[I]?"is":"get")+I.charAt(0).toUpperCase()+I.slice(1)};y.QuickFinder=function(z,q,B,Y,b){var A=this;A.$9j={},A.$1j=z,A.$2j=q,A.$3j=B,A.$4j=Y||A.getValue,A.$5j=b||A.$5j,z.each(A.$7j,A),z.mm(A.$11j,A,!0),z.md(A.$12j,A,!0)},y.Default.def(y.QuickFinder,o,{$6j:"__ht__null__",getValueFunc:function(){return this.$4j},getFilterFunc:function(){return this.$5j},$11j:function(F){"add"===F.kind?this.$7j(F.data):"remove"===F.kind?this.$8j(F.data):"clear"===F.kind&&(this.$9j={})},$12j:function(C){var V=this,$=V.$3j,p=V.$2j;if(V.$5j(C.data)){if(null==$&&p===C.property);else if("style"===$&&"s:"+p===C.property);else if("attr"!==$||"a:"+p!==C.property)return;var w=V.$10j(C.oldValue);w&&w.remove(C.data),V.$7j(C.data)}},$10j:function(t){return t=null==t?this.$6j:t,this.$9j[t]},find:function(K){var t=this.$10j(K);return t?t.toList():new y.List},findFirst:function(X){var t=this.$10j(X);return!t||t.isEmpty()?null:t.get(0)},$7j:function(O){var a=this;if(a.$5j(O)){var Y=a.$4j(O),K=a.$10j(Y);K||(K=new y.List,Y=null==Y?a.$6j:Y,a.$9j[Y]=K),K.add(O)}},$8j:function(R){var Z=this;if(Z.$5j(R)){var f=Z.$4j(R),z=Z.$10j(f);z&&(z.remove(R),z.isEmpty()&&(f=null==f?Z.$6j:f,delete Z.$9j[f]))}},dispose:function(){this.$1j.umm(this.$11j,this),this.$1j.umd(this.$12j,this),delete this.$1j},getDataModel:function(){return this.$1j},getAccessType:function(){return this.$3j},getPropertyName:function(){return this.$2j},$5j:function(A){return null!=this.$3j||this.$4j!==this.getValue||A[H(this.$2j)]?!0:!1},getValue:function(u){var O=this,X=O.$3j,Q=O.$2j;return null==X?u[H(Q)]():"style"===X?u.s(Q):"attr"===X?u.a(Q):void 0}})}("undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:(0,eval)("this"),Object);