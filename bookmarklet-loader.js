javascript:(function(){
if(document.getElementById('browser-page-impact-dialog')){return;}
var s=document.createElement('script');
// Always append a timestamp to bypass aggressive browser caching
s.src='https://vatsal-ships.github.io/impactDoc-bookmarklet/bookmarklet-main.js?v='+(Date.now());
s.onload=function(){window.initImpactDoc();};
s.onerror=function(){alert('Failed to load ImpactDoc. Please check your internet connection.');};
document.head.appendChild(s);
})(); 