"use strict";(self.webpackChunkapp=self.webpackChunkapp||[]).push([[2387],{2387:(T,c,o)=>{o.r(c),o.d(c,{routes:()=>u});var f=o(467),t=o(4438),s=o(2220),v=o(5079),a=o(5873);const r=(0,o(5083).F3)("PushNotifications",{});var P=o(6766),g=o(8287);let p=(()=>{var n;class d{constructor(e,i,h){this.alertController=e,this.router=i,this.firebaseService=h,this.environmentInjector=(0,t.WQX)(t.uvJ),(0,v.a)({home:a.iRW,search:a.$P,addCircle:a.YH_,person:a.MVM,square:a.EwI,searchCircle:a.puM,ellipse:a.pw2,triangle:a.zXF})}ngOnInit(){r.requestPermissions().then(e=>{"granted"===e.receive?r.register():this.showAlert("Permission Denied","Push notification permission was denied.")}),r.addListener("pushNotificationReceived",e=>{this.storeNotification(e)}),r.addListener("pushNotificationReceived",e=>{this.showAlert(e.title,e.body),this.storeNotification(e)})}showAlert(e,i){var h=this;return(0,f.A)(function*(){yield(yield h.alertController.create({header:e,message:i,buttons:["OK"]})).present()})()}storeNotification(e){const i={title:e.title||"No Title",body:e.body||"No Body",timestamp:(new Date).toISOString()};this.firebaseService.StoreNotification(i)}}return(n=d).\u0275fac=function(e){return new(e||n)(t.rXU(s.hG),t.rXU(P.Ix),t.rXU(g.f))},n.\u0275cmp=t.VBU({type:n,selectors:[["app-tabs"]],standalone:!0,features:[t.aNF],decls:18,vars:0,consts:[[1,"ion-padding-bottom"],["slot","bottom"],["tab","home","color","tertiary","href","/tabs/home"],["name","home"],["tab","search","href","/tabs/search"],["name","search"],["tab","create-post","href","/tabs/create-post"],["name","add-circle"],["tab","profile","href","/tabs/profile"],["name","person"]],template:function(e,i){1&e&&(t.j41(0,"ion-tabs",0)(1,"ion-tab-bar",1)(2,"ion-tab-button",2),t.nrm(3,"ion-icon",3),t.j41(4,"ion-label"),t.EFF(5,"Home"),t.k0s()(),t.j41(6,"ion-tab-button",4),t.nrm(7,"ion-icon",5),t.j41(8,"ion-label"),t.EFF(9,"Search"),t.k0s()(),t.j41(10,"ion-tab-button",6),t.nrm(11,"ion-icon",7),t.j41(12,"ion-label"),t.EFF(13,"Create Post"),t.k0s()(),t.j41(14,"ion-tab-button",8),t.nrm(15,"ion-icon",9),t.j41(16,"ion-label"),t.EFF(17,"Profile"),t.k0s()()()())},dependencies:[s.p4,s.Jq,s.qW,s.iq,s.he]}),d})();var l=o(3547);const u=[{path:"",component:p,children:[{path:"home",loadComponent:()=>Promise.all([o.e(9350),o.e(710)]).then(o.bind(o,710)).then(n=>n.Tab1Page),canActivate:[l.W]},{path:"search",loadComponent:()=>o.e(676).then(o.bind(o,676)).then(n=>n.Tab2Page),canActivate:[l.W]},{path:"create-post",loadComponent:()=>Promise.all([o.e(9350),o.e(1654)]).then(o.bind(o,1654)).then(n=>n.Tab3Page),canActivate:[l.W]},{path:"profile",loadComponent:()=>Promise.all([o.e(9350),o.e(3040)]).then(o.bind(o,3040)).then(n=>n.Tab4Page),canActivate:[l.W]},{path:"",redirectTo:"home",pathMatch:"full"}]}]}}]);