javascript:(function(){
console.log('Debug loader starting...');
if(document.getElementById('browser-page-impact-dialog')){
    console.log('Dialog already exists, returning');
    return;
}
var s=document.createElement('script');
var timestamp = Date.now();
s.src='https://vatsal-ships.github.io/impactDoc-bookmarklet/bookmarklet-main.js?v=' + timestamp + '&debug=1';
console.log('Loading script from:', s.src);
s.onload=function(){
    console.log('Script loaded successfully');
    if(window.initImpactDoc){
        console.log('initImpactDoc function found, calling...');
        window.initImpactDoc();
    } else {
        console.error('initImpactDoc function not found');
        alert('Error: initImpactDoc function not found');
    }
};
s.onerror=function(e){
    console.error('Script loading failed:', e);
    alert('Failed to load ImpactDoc. Error: ' + e.message);
};
document.head.appendChild(s);
console.log('Script element added to head');
})(); 