javascript:(function(){
if(document.getElementById('browser-page-impact-dialog')){return;}
if(window.impactDocLoading){console.warn('ImpactDoc already loading');return;}
window.impactDocLoading=true;
function ensureDOM(){
try{
if(location.protocol==='chrome:'||location.protocol==='chrome-extension:'||location.protocol==='moz-extension:'||location.hostname==='newtab'){
alert('ImpactDoc cannot run on browser special pages.\\nPlease navigate to a website (like google.com) first, then try again.');
return false;
}
if(location.protocol==='about:'||location.href==='about:blank'){
alert('ImpactDoc cannot run on empty pages.\\nPlease navigate to a website first, then try again.');
return false;
}
if(!document.documentElement){return false;}
if(!document.head){
var head=document.createElement('head');
document.documentElement.appendChild(head);
}
if(!document.body){
var body=document.createElement('body');
document.documentElement.appendChild(body);
}
return true;
}catch(e){
console.error('DOM creation failed:',e);
if(location.protocol==='about:'||location.href==='about:blank'){
alert('ImpactDoc cannot run on empty pages.\\nPlease navigate to a website first, then try again.');
}else{
alert('ImpactDoc: Cannot initialize on this page type');
}
return false;
}
}
function loadScript(){
if(!ensureDOM()){
window.impactDocLoading=false;
return;
}
var s=document.createElement('script');
s.src='https://vatsal-ships.github.io/impactDoc-bookmarklet/bookmarklet-main-mini.js?v='+(Date.now());
s.onload=function(){
try{
window.impactDocLoading=false;
if(typeof window.initImpactDoc==='function'){
window.initImpactDoc();
}else{
console.error('ImpactDoc function not found');
alert('ImpactDoc failed to load properly. Please try again.');
}
}catch(e){
console.error('ImpactDoc initialization error:',e);
if(location.protocol==='chrome:'||location.protocol==='about:'){
alert('ImpactDoc cannot run on this page type.\\nPlease navigate to a regular website first.');
}else{
alert('ImpactDoc failed to initialize: '+e.message);
}
}
};
s.onerror=function(){
window.impactDocLoading=false;
if(location.protocol==='chrome:'||location.protocol==='about:'){
alert('ImpactDoc cannot run on this page type.\\nPlease navigate to a regular website first.');
}else{
alert('Failed to load ImpactDoc. Please check your internet connection.');
}
};
document.head.appendChild(s);
}
if(document.readyState==='loading'){
document.addEventListener('DOMContentLoaded',loadScript);
}else{
loadScript();
}
})(); 