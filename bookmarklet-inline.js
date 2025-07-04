javascript:(function(){
if(document.getElementById('browser-page-impact-dialog')){return;}
var d=document.createElement('div');
d.id='browser-page-impact-dialog';
d.style.cssText='position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:white;border-radius:8px;padding:20px;width:380px;max-width:90vw;max-height:90vh;box-shadow:0 4px 20px rgba(0,0,0,0.3);z-index:10000;font-family:-apple-system,BlinkMacSystemFont,sans-serif;';
d.innerHTML='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;"><h3 style="margin:0;font-size:18px;color:#333;">ImpactDoc</h3><button id="close-dialog" style="background:none;border:none;font-size:20px;cursor:pointer;color:#666;">×</button></div><div style="text-align:center;"><p style="color:#4a5568;margin-bottom:20px;font-size:16px;">Connect your Google account to access your private document</p><button id="auth-button" style="background:#4285f4;color:white;border:none;padding:14px 28px;border-radius:12px;cursor:pointer;font-size:16px;width:100%;margin-bottom:16px;font-weight:600;">Sign in with Google</button></div>';
document.body.appendChild(d);
document.getElementById('close-dialog').onclick=function(){d.remove();};
document.getElementById('auth-button').onclick=function(){alert('Auth button clicked! (Inline test version)');};
})(); 