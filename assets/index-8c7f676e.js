import{ag as u,o as f,Q as d,as as g}from"./@vue-3b858b78.js";import{_,r as h,__tla as y}from"./_plugin-vue_export-helper-ee39f1d1.js";import{i as v,z as S,__tla as L}from"./element-plus-e3bcbdc2.js";import{Q as b}from"./@element-plus-ffae287f.js";import{c as N}from"./vuex-857a7739.js";import"./vue-router-111722e5.js";import"./js-cookie-cf83ad76.js";import"./lodash-es-3b111273.js";import"./@vueuse-dbe79a15.js";import"./@popperjs-c45de710.js";import"./@ctrl-43a4208a.js";import"./dayjs-de8721ee.js";import"./ali-oss-f05aeb17.js";import"./async-validator-7f96df71.js";import"./memoize-one-297ddbcb.js";import"./escape-html-1d60d822.js";import"./normalize-wheel-es-ed76fb12.js";import{__tla as R}from"./@floating-ui-dec9075e.js";Promise.all([(()=>{try{return y}catch{}})(),(()=>{try{return L}catch{}})(),(()=>{try{return R}catch{}})()]).then(async()=>{(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))i(t);new MutationObserver(t=>{for(const e of t)if(e.type==="childList")for(const n of e.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&i(n)}).observe(document,{childList:!0,subtree:!0});function o(t){const e={};return t.integrity&&(e.integrity=t.integrity),t.referrerpolicy&&(e.referrerPolicy=t.referrerpolicy),t.crossorigin==="use-credentials"?e.credentials="include":t.crossorigin==="anonymous"?e.credentials="omit":e.credentials="same-origin",e}function i(t){if(t.ep)return;t.ep=!0;const e=o(t);fetch(t.href,e)}})();const a={};function c(r,o){const i=u("router-view");return f(),d(i)}const m=_(a,[["render",c]]),l={navState:sessionStorage.getItem("navState")||"",policeTrainingRefresh:!1},p=N({state:l,mutations:{saveNavState(r,o){r.navState=o,sessionStorage.setItem("navState",o)},changePoliceTrainingRefresh(r,o){r.policeTrainingRefresh=!r.policeTrainingRefresh}}}),s=g(m).use(h).use(v,{locale:S}).use(p);for(const[r,o]of Object.entries(b))s.component(r,o);s.mount("#app")});