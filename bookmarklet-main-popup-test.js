window.initImpactDoc = function() {
    // Check if dialog is already open
    if (document.getElementById('browser-page-impact-dialog')) {
        return;
    }

    // Google OAuth configuration
    const CLIENT_ID = '267135613225-0q6672a1dl8f3bd1dg123ea2lf1b2er9.apps.googleusercontent.com';
    const API_KEY = 'AIzaSyAWg7PkUqRiBoQOOYlVwQJG6PKuxQqN5cA';
    const DISCOVERY_DOC = 'https://docs.googleapis.com/$discovery/rest?version=v1';
    const SCOPES = 'https://www.googleapis.com/auth/documents';

    let gapiInited = false;
    let masterDocId = localStorage.getItem('browserPageImpact_docId');

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Create dialog HTML
    const dialogHTML = `
        <div id="browser-page-impact-dialog" style="
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 90%;
            max-width: 500px;
            background: white;
            border-radius: 16px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
            z-index: 2147483647;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            padding: 32px;
            max-height: 90vh;
            overflow-y: auto;
        ">
            <div style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 24px;
            ">
                <h2 style="margin: 0; color: #2d3748; font-size: 24px; font-weight: 600;">📝 ImpactDoc (Popup Test)</h2>
                <button id="close-dialog" style="
                    background: none;
                    border: none;
                    font-size: 28px;
                    cursor: pointer;
                    color: #a0aec0;
                    padding: 0;
                    width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    transition: all 0.2s;
                " onmouseover="this.style.background='#f7fafc'" onmouseout="this.style.background='none'">&times;</button>
            </div>
            
            <div id="auth-section" style="display: block; text-align: center;">
                <p style="color: #4a5568; margin-bottom: 20px; font-size: 16px;">
                    Connect your Google account to access your private document
                </p>
                <div style="background: #fffbeb; color: #92400e; border: 1px solid #fbbf24; padding: 16px; border-radius: 8px; margin-bottom: 20px; font-size: 14px;">
                    <strong>Localhost Test Mode</strong><br>
                    This will open a popup window for authentication testing.
                </div>
                <button id="auth-button" disabled style="
                    background: #a0aec0;
                    color: white;
                    border: none;
                    padding: 14px 28px;
                    border-radius: 12px;
                    cursor: not-allowed;
                    font-size: 16px;
                    width: 100%;
                    margin-bottom: 16px;
                    font-weight: 600;
                    transition: all 0.2s;
                ">Loading...</button>
            </div>

            <div id="setup-section" style="display: none;">
                <h3 style="margin: 0 0 20px 0; color: #2d3748; font-size: 20px; font-weight: 600;">Setup Your Document</h3>
                <p style="color: #4a5568; margin-bottom: 20px;">
                    Enter your Google Doc ID to connect to your tracking document:
                </p>
                
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; color: #2d3748; font-weight: 600;">
                        Google Doc ID:
                    </label>
                    <input type="text" id="doc-id-input" placeholder="Enter your Google Doc ID" style="
                        width: 100%;
                        padding: 12px 16px;
                        border: 2px solid #e2e8f0;
                        border-radius: 8px;
                        font-size: 16px;
                        box-sizing: border-box;
                        transition: border-color 0.2s;
                    " onfocus="this.style.borderColor='#667eea'" onblur="this.style.borderColor='#e2e8f0'">
                    <small style="color: #718096; font-size: 14px; display: block; margin-top: 8px;">
                        Found in the URL: docs.google.com/document/d/<strong>DOCUMENT_ID</strong>/edit
                    </small>
                </div>
                
                <button id="connect-doc" style="
                    background: #48bb78;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 16px;
                    width: 100%;
                    margin-bottom: 20px;
                    font-weight: 600;
                    transition: all 0.2s;
                " onmouseover="this.style.background='#38a169'" onmouseout="this.style.background='#48bb78'">Connect Document</button>
            </div>

            <div id="content-section" style="display: none;">
                <p style="color: #4a5568; margin-bottom: 20px; font-size: 16px; text-align: center;">
                    <strong>Test Mode:</strong> This would normally add entries to your Google Doc.
                </p>
                
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; color: #2d3748; font-weight: 600;">
                        Entry Title:
                    </label>
                    <input type="text" id="entry-title" placeholder="Brief description of the entry" style="
                        width: 100%;
                        padding: 12px 16px;
                        border: 2px solid #e2e8f0;
                        border-radius: 8px;
                        font-size: 16px;
                        box-sizing: border-box;
                    ">
                </div>
                
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; color: #2d3748; font-weight: 600;">
                        Content:
                    </label>
                    <textarea id="content-text" placeholder="Enter your content here..." style="
                        width: 100%;
                        height: 120px;
                        padding: 12px 16px;
                        border: 2px solid #e2e8f0;
                        border-radius: 8px;
                        font-size: 16px;
                        resize: vertical;
                        box-sizing: border-box;
                        font-family: inherit;
                    "></textarea>
                </div>
                
                <button id="add-entry" style="
                    background: #48bb78;
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
                " onmouseover="this.style.background='#38a169'" onmouseout="this.style.background='#48bb78'">Test Add Entry</button>
            </div>
            
            <div id="status" style="
                margin-top: 16px;
                padding: 12px 16px;
                border-radius: 8px;
                font-size: 14px;
                display: none;
            "></div>
        </div>
        
        <div id="browser-page-impact-overlay" style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 2147483646;
        "></div>
    `;

    // Insert dialog into page
    document.body.insertAdjacentHTML('beforeend', dialogHTML);

    // Get dialog elements
    const dialog = document.getElementById('browser-page-impact-dialog');
    const overlay = document.getElementById('browser-page-impact-overlay');
    const closeButton = document.getElementById('close-dialog');
    const authSection = document.getElementById('auth-section');
    const setupSection = document.getElementById('setup-section');
    const contentSection = document.getElementById('content-section');
    const authButton = document.getElementById('auth-button');
    const connectDocButton = document.getElementById('connect-doc');
    const addEntryButton = document.getElementById('add-entry');

    function closeDialog() {
        dialog.remove();
        overlay.remove();
    }

    function showStatus(message, isError = false) {
        const statusDiv = document.getElementById('status');
        statusDiv.textContent = message;
        statusDiv.style.display = 'block';
        statusDiv.style.background = isError ? '#fed7d7' : '#f0fff4';
        statusDiv.style.color = isError ? '#742a2a' : '#22543d';
        statusDiv.style.border = `2px solid ${isError ? '#feb2b2' : '#9ae6b4'}`;
    }

    function loadGoogleAPIs() {
        // For localhost testing, we'll simulate the API loading
        setTimeout(() => {
            gapiInited = true;
            maybeEnableButtons();
        }, 1000);
    }

    function maybeEnableButtons() {
        if (gapiInited) {
            authButton.disabled = false;
            authButton.style.background = '#4285f4';
            authButton.style.cursor = 'pointer';
            authButton.textContent = 'Sign in with Google (Test)';
            showStatus('Ready to test authentication with popup');
        }
    }

    function handleAuthClick() {
        showStatus('Opening authentication popup...');
        
        // Open popup window for authentication (localhost test version)
        const authUrl = 'http://localhost:8002/auth-popup-localhost.html';
        const popup = window.open(authUrl, 'auth-popup', 'width=500,height=600,scrollbars=yes,resizable=yes');
        
        // Listen for authentication result
        const messageHandler = (event) => {
            // Accept localhost for testing
            if (event.origin !== 'http://localhost:8002') {
                return;
            }
            
            if (event.data.type === 'auth-success') {
                showStatus('Authentication successful! (Mock token received)');
                
                // Update UI
                authSection.style.display = 'none';
                if (masterDocId) {
                    contentSection.style.display = 'block';
                    showStatus('Successfully authenticated! Ready to test entries.');
                } else {
                    setupSection.style.display = 'block';
                    showStatus('Successfully authenticated! Please enter a test document ID.');
                }
                
                // Clean up
                window.removeEventListener('message', messageHandler);
                if (popup && !popup.closed) {
                    popup.close();
                }
            }
        };
        
        window.addEventListener('message', messageHandler);
        
        // Handle popup being closed manually
        const checkClosed = setInterval(() => {
            if (popup.closed) {
                clearInterval(checkClosed);
                window.removeEventListener('message', messageHandler);
                showStatus('Authentication cancelled');
            }
        }, 1000);
    }

    function connectDocument() {
        const docId = document.getElementById('doc-id-input').value.trim();
        if (!docId) {
            showStatus('Please enter a test document ID', true);
            return;
        }

        connectDocButton.disabled = true;
        connectDocButton.textContent = 'Connecting...';
        showStatus('Simulating document connection...');

        // Simulate connection
        setTimeout(() => {
            masterDocId = docId;
            localStorage.setItem('browserPageImpact_docId', docId);
            setupSection.style.display = 'none';
            contentSection.style.display = 'block';
            showStatus('Test document connected successfully!');
            connectDocButton.disabled = false;
            connectDocButton.textContent = 'Connect Document';
        }, 1500);
    }

    function addEntry() {
        const entryTitle = document.getElementById('entry-title').value.trim();
        const content = document.getElementById('content-text').value.trim();

        if (!entryTitle) {
            showStatus('Please enter an entry title', true);
            return;
        }

        if (!content) {
            showStatus('Please enter some content', true);
            return;
        }

        addEntryButton.disabled = true;
        addEntryButton.textContent = 'Testing...';
        showStatus('Simulating entry addition...');

        // Simulate adding entry
        setTimeout(() => {
            const timestamp = new Date().toLocaleString();
            showStatus(`Test entry added successfully! Would have added: "${timestamp} - ${entryTitle}"`);
            
            // Clear form
            document.getElementById('entry-title').value = '';
            document.getElementById('content-text').value = '';
            
            addEntryButton.disabled = false;
            addEntryButton.textContent = 'Test Add Entry';
        }, 1500);
    }

    // Event listeners
    closeButton.addEventListener('click', closeDialog);
    overlay.addEventListener('click', closeDialog);
    authButton.addEventListener('click', handleAuthClick);
    connectDocButton.addEventListener('click', connectDocument);
    addEntryButton.addEventListener('click', addEntry);

    // Initialize
    loadGoogleAPIs();

    // Show appropriate section
    if (masterDocId) {
        showStatus('Found saved document ID. Please authenticate to continue.');
    } else {
        showStatus('Please authenticate to get started.');
    }
};

// Auto-initialize for testing
window.initImpactDoc(); 