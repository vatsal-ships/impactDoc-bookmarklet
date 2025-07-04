javascript:(function(){
if(document.getElementById('browser-page-impact-dialog')){return;}
var s=document.createElement('script');
s.src='http://localhost:8002/bookmarklet-main-localhost.js';
s.onload=function(){window.initImpactDoc();};
s.onerror=function(){alert('Failed to load ImpactDoc test. Make sure the server is running on localhost:8002');};
document.head.appendChild(s);
})(); 