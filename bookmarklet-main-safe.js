window.initImpactDoc = function() {
    console.log('initImpactDoc called');
    
    // Check if dialog is already open
    if (document.getElementById('browser-page-impact-dialog')) {
        console.log('Dialog already exists');
        return;
    }

    console.log('Creating dialog...');
    
    // Create dialog element using DOM methods instead of template string
    const dialog = document.createElement('div');
    dialog.id = 'browser-page-impact-dialog';
    dialog.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        border-radius: 8px;
        padding: 20px;
        width: 380px;
        max-width: 90vw;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;

    // Create header
    const header = document.createElement('div');
    header.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;';
    
    const title = document.createElement('h3');
    title.textContent = 'ImpactDoc';
    title.style.cssText = 'margin: 0; font-size: 18px; color: #333;';
    
    const closeButton = document.createElement('button');
    closeButton.id = 'close-dialog';
    closeButton.textContent = '×';
    closeButton.style.cssText = 'background: none; border: none; font-size: 20px; cursor: pointer; color: #666;';
    
    header.appendChild(title);
    header.appendChild(closeButton);
    dialog.appendChild(header);

    // Create loading section
    const loadingSection = document.createElement('div');
    loadingSection.id = 'loading-section';
    loadingSection.style.cssText = 'display: block; text-align: center;';
    
    const loadingText = document.createElement('p');
    loadingText.textContent = 'Loading...';
    loadingText.style.cssText = 'color: #4a5568; margin-bottom: 20px; font-size: 16px;';
    
    loadingSection.appendChild(loadingText);
    dialog.appendChild(loadingSection);

    // Create auth section
    const authSection = document.createElement('div');
    authSection.id = 'auth-section';
    authSection.style.cssText = 'display: none; text-align: center;';
    
    const authText = document.createElement('p');
    authText.textContent = 'Connect your Google account to access your private document';
    authText.style.cssText = 'color: #4a5568; margin-bottom: 20px; font-size: 16px;';
    
    const authButton = document.createElement('button');
    authButton.id = 'auth-button';
    authButton.textContent = 'Sign in with Google';
    authButton.style.cssText = `
        background: #4285f4;
        color: white;
        border: none;
        padding: 14px 28px;
        border-radius: 12px;
        cursor: pointer;
        font-size: 16px;
        width: 100%;
        margin-bottom: 16px;
        font-weight: 600;
        transition: all 0.2s;
    `;
    
    authSection.appendChild(authText);
    authSection.appendChild(authButton);
    dialog.appendChild(authSection);

    // Create status div
    const statusDiv = document.createElement('div');
    statusDiv.id = 'status';
    statusDiv.style.cssText = `
        margin-top: 16px;
        padding: 12px 16px;
        border-radius: 8px;
        font-size: 14px;
        display: none;
    `;
    dialog.appendChild(statusDiv);

    // Insert dialog into page
    document.body.appendChild(dialog);
    
    console.log('Dialog created and added to page');

    // Helper functions
    function closeDialog() {
        console.log('Closing dialog');
        dialog.remove();
    }

    function showStatus(message, isError = false) {
        console.log('Status:', message, isError ? '(error)' : '');
        statusDiv.textContent = message;
        statusDiv.style.display = 'block';
        statusDiv.style.background = isError ? '#fed7d7' : '#c6f6d5';
        statusDiv.style.color = isError ? '#c53030' : '#2f855a';
        statusDiv.style.border = `2px solid ${isError ? '#feb2b2' : '#9ae6b4'}`;
    }

    // Add event listeners
    closeButton.addEventListener('click', closeDialog);
    authButton.addEventListener('click', function() {
        alert('Auth button clicked! (This is a test version)');
    });

    // Show auth section after a short delay
    setTimeout(function() {
        console.log('Showing auth section');
        loadingSection.style.display = 'none';
        authSection.style.display = 'block';
        showStatus('Test version: Click to authenticate with Google');
    }, 500);

    console.log('initImpactDoc completed');
}; 