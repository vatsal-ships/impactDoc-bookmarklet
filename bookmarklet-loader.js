javascript:(function(){
if(document.getElementById('browser-page-impact-dialog')){return;}
if(window.impactDocLoading){console.warn('ImpactDoc already loading');return;}
window.impactDocLoading=true;
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
alert('ImpactDoc failed to initialize: '+e.message);
}
};
s.onerror=function(){
window.impactDocLoading=false;
alert('Failed to load ImpactDoc. Please check your internet connection.');
};
document.head.appendChild(s);
})(); 