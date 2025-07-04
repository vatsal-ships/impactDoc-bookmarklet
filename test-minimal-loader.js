javascript:(function(){
var s=document.createElement('script');
s.src='https://vatsal-ships.github.io/impactDoc-bookmarklet/test-minimal.js?v='+(Date.now());
s.onload=function(){window.testMinimal();};
s.onerror=function(){alert('Failed to load test script');};
document.head.appendChild(s);
})(); 