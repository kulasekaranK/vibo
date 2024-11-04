"use strict";(self.webpackChunkapp=self.webpackChunkapp||[]).push([[2636],{2636:(O,v,i)=>{i.r(v),i.d(v,{ConversationPage:()=>R});var f=i(467),d=i(177),m=i(4341),t=i(2220),C=i(5079),h=i(5873),g=i(9152),e=i(4438),M=i(6766),E=i(8287);function p(a,u){if(1&a&&(e.j41(0,"ion-item",9)(1,"ion-avatar",10),e.nrm(2,"img",11),e.k0s(),e.j41(3,"div",12)(4,"ion-label",13)(5,"h2"),e.EFF(6),e.k0s()(),e.j41(7,"div",14)(8,"ion-note",15),e.EFF(9),e.nI1(10,"date"),e.k0s()()()()),2&a){const o=u.$implicit,s=e.XpG(2);e.R7$(),e.Y8G("slot",o.senderId===(null==s.currentUserDetails?null:s.currentUserDetails.uid)?"end":"start"),e.R7$(),e.Y8G("src",o.senderAvatar,e.B4B),e.R7$(),e.Y8G("ngClass",o.senderId===(null==s.currentUserDetails?null:s.currentUserDetails.uid)?"own-message":"received-message"),e.R7$(3),e.JRh(o.text),e.R7$(3),e.JRh(e.i5U(10,5,o.timestamp,"shortTime"))}}function P(a,u){if(1&a&&(e.j41(0,"div")(1,"ion-list"),e.DNE(2,p,11,8,"ion-item",8),e.k0s()()),2&a){const o=e.XpG();e.R7$(2),e.Y8G("ngForOf",o.messages)}}function U(a,u){1&a&&(e.j41(0,"p",16),e.EFF(1,"No messages yet."),e.k0s())}let R=(()=>{var a;class u{constructor(s,n,r,l){this.route=s,this.firebaseService=n,this.database=r,this.router=l,this.userDetails=null,this.userName="",this.currentUserDetails=null,this.newMessage="",this.messages=[],this.lastSentMessageKey=null,(0,C.a)({personSharp:h.QdU,ellipsisVerticalOutline:h.k4i,sendOutline:h.NF$})}ngOnInit(){var s=this;return(0,f.A)(function*(){const n=s.route.snapshot.paramMap.get("uid");n&&(s.userDetails=yield s.firebaseService.loadUserDetail(n),s.userName=`@${s.userDetails.userName}`);const r=yield s.firebaseService.getCurrentUser();r&&(s.currentUserDetails=yield s.firebaseService.loadUserDetail(r.uid)),s.currentUserDetails&&n&&s.loadMessages(s.currentUserDetails.uid,n)})()}loadMessages(s,n){const r=this.getChatId(s,n),l=(0,g.KR)(this.database,`chats/${r}/messages`);(0,g.Zy)(l,c=>{const _=c.val();this.messages=_?Object.values(_):[]})}sendMessage(){var s=this;return(0,f.A)(function*(){if(!s.newMessage.trim())return;const n=s.currentUserDetails.name,r=s.currentUserDetails.profilePic,l=s.currentUserDetails.uid,c=s.userDetails.uid,_=s.getChatId(l,c),I=(0,g.KR)(s.database,`chats/${_}/messages`),D=(0,g.VC)(I);yield(0,g.hZ)(D,{senderId:l,receiverId:c,senderName:n,senderAvatar:r,text:s.newMessage,timestamp:(0,g.O5)(),read:!1}),s.lastSentMessageKey=D.key,s.newMessage=""})()}getChatId(s,n){return s<n?`${s}_${n}`:`${n}_${s}`}}return(a=u).\u0275fac=function(s){return new(s||a)(e.rXU(M.nX),e.rXU(E.f),e.rXU(g.Wm),e.rXU(M.Ix))},a.\u0275cmp=e.VBU({type:a,selectors:[["app-conversation"]],standalone:!0,features:[e.aNF],decls:21,vars:6,consts:[["noMessages",""],["mode","md"],["slot","start"],["alt","profile",3,"src"],[4,"ngIf","ngIfElse"],["fill","outline","placeholder","Message...","name","message",3,"ngModelChange","ngModel"],["slot","end","shape","round",3,"click"],["name","send-outline","color","light"],["class","ion-margin","lines","none",4,"ngFor","ngForOf"],["lines","none",1,"ion-margin"],[3,"slot"],["alt","",3,"src"],[3,"ngClass"],["color","dark",1,"ion-margin-bottom"],[1,"ion-text-end"],["color","warning"],[1,"ion-text-center"]],template:function(s,n){if(1&s){const r=e.RV6();e.j41(0,"ion-header")(1,"ion-toolbar",1)(2,"ion-buttons",2),e.nrm(3,"ion-back-button"),e.k0s(),e.j41(4,"ion-avatar",2),e.nrm(5,"img",3),e.k0s(),e.j41(6,"ion-title")(7,"ion-label")(8,"h1"),e.EFF(9),e.k0s(),e.j41(10,"p"),e.EFF(11),e.k0s()()()()(),e.j41(12,"ion-content"),e.DNE(13,P,3,1,"div",4)(14,U,2,0,"ng-template",null,0,e.C5r),e.k0s(),e.j41(16,"ion-footer")(17,"ion-toolbar")(18,"ion-input",5),e.mxI("ngModelChange",function(c){return e.eBV(r),e.DH7(n.newMessage,c)||(n.newMessage=c),e.Njj(c)}),e.j41(19,"ion-button",6),e.bIt("click",function(){return e.eBV(r),e.Njj(n.sendMessage())}),e.nrm(20,"ion-icon",7),e.k0s()()()()}if(2&s){const r=e.sdS(15);e.R7$(5),e.Y8G("src",null==n.userDetails?null:n.userDetails.profilePic,e.B4B),e.R7$(4),e.JRh(null==n.userDetails?null:n.userDetails.name),e.R7$(2),e.JRh(n.userName),e.R7$(2),e.Y8G("ngIf",n.messages.length>0)("ngIfElse",r),e.R7$(5),e.R50("ngModel",n.newMessage)}},dependencies:[t.nf,t.iq,t.uz,t.$w,t.M0,t.he,t.JI,t.mC,t.el,t.Jm,t.QW,t.W9,t.eU,t.BC,t.ai,d.MD,d.YU,d.Sq,d.bT,d.vh,m.YN,m.BC,m.vS],styles:[".own-message[_ngcontent-%COMP%]{justify-content:flex-end;background:var(--ion-color-primary);border-radius:10px;margin-left:auto;max-width:95%;padding:10px}.received-message[_ngcontent-%COMP%]{justify-content:flex-start;background:var(--ion-color-secondary);border-radius:10px;margin-right:auto;max-width:95%;padding:10px}ion-note[_ngcontent-%COMP%]{font-size:12px}"]}),u})()}}]);