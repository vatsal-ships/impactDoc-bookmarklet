javascript:(function(){
console.log('Safe loader starting...');
if(document.getElementById('browser-page-impact-dialog')){
    console.log('Dialog already exists, returning');
    return;
}
var s=document.createElement('script');
var timestamp = Date.now();
s.src='https://vatsal-ships.github.io/impactDoc-bookmarklet/bookmarklet-main-safe.js?v=' + timestamp;
console.log('Loading safe script from:', s.src);
s.onload=function(){
    console.log('Safe script loaded successfully');
    if(window.initImpactDoc){
        console.log('initImpactDoc function found, calling...');
        window.initImpactDoc();
    } else {
        console.error('initImpactDoc function not found');
        alert('Error: initImpactDoc function not found');
    }
};
s.onerror=function(e){
    console.error('Safe script loading failed:', e);
    alert('Failed to load safe ImpactDoc. Error: ' + e.message);
};
document.head.appendChild(s);
console.log('Safe script element added to head');
})(); 