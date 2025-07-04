window.initImpactDoc = function() {
    // Check if dialog is already open
    if (document.getElementById('browser-page-impact-dialog')) {
        return;
    }

    // Show a test dialog first to verify the loader works
    const testDialog = document.createElement('div');
    testDialog.id = 'browser-page-impact-dialog';
    testDialog.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        z-index: 10000;
        display: flex;
        justify-content: center;
        align-items: center;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        backdrop-filter: blur(4px);
    `;
    
    testDialog.innerHTML = `
        <div style="
            background: white;
            border-radius: 20px;
            padding: 40px;
            width: 500px;
            max-width: 90vw;
            text-align: center;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
        ">
            <h2 style="margin: 0 0 20px 0; color: #2d3748; font-size: 24px; font-weight: 600;">
                🎉 Loader Test Successful!
            </h2>
            <p style="color: #4a5568; margin-bottom: 20px; font-size: 16px;">
                The compact loader successfully loaded and executed the main script.
            </p>
            <div style="background: #f0fff4; border: 1px solid #9ae6b4; border-radius: 12px; padding: 20px; margin: 20px 0;">
                <h4 style="color: #2f855a; margin-bottom: 10px;">✅ What this proves:</h4>
                <ul style="text-align: left; color: #2f855a; margin: 0; padding-left: 20px;">
                    <li>Bookmarklet size issue is solved</li>
                    <li>Dynamic loading works perfectly</li>
                    <li>The loader approach is functional</li>
                    <li>Ready for production use</li>
                </ul>
            </div>
            <div style="background: #fffbeb; border: 1px solid #f59e0b; border-radius: 12px; padding: 20px; margin: 20px 0;">
                <h4 style="color: #92400e; margin-bottom: 10px;">📋 Next Steps:</h4>
                <ol style="text-align: left; color: #92400e; margin: 0; padding-left: 20px;">
                    <li>Visit the GitHub Pages version</li>
                    <li>Drag the bookmarklet from there</li>
                    <li>Google OAuth will work on the live site</li>
                </ol>
            </div>
            <button onclick="document.getElementById('browser-page-impact-dialog').remove()" 
                    style="
                        background: #4285f4;
                        color: white;
                        border: none;
                        padding: 12px 24px;
                        border-radius: 8px;
                        cursor: pointer;
                        font-size: 16px;
                        font-weight: 600;
                        margin-top: 10px;
                    ">
                Close
            </button>
        </div>
    `;
    
    document.body.appendChild(testDialog);
    
    // Close when clicking outside
    testDialog.addEventListener('click', (e) => {
        if (e.target === testDialog) {
            testDialog.remove();
        }
    });
}; 