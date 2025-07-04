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
    let isAuthenticated = false;
    let masterDocId; // Will be set after cookie functions are defined
    
    // Simple encryption/decryption for token storage
    function simpleEncrypt(text) {
        return btoa(text.split('').map(char => 
            String.fromCharCode(char.charCodeAt(0) ^ 123)
        ).join(''));
    }
    
    function simpleDecrypt(encrypted) {
        try {
            return atob(encrypted).split('').map(char => 
                String.fromCharCode(char.charCodeAt(0) ^ 123)
            ).join('');
        } catch (e) {
            return null;
        }
    }
    
    // Universal cross-domain storage using GitHub Pages as bridge
    const STORAGE_BRIDGE_URL = 'https://vatsal-ships.github.io/impactDoc-bookmarklet/storage-bridge.html';
    let storageBridge = null;
    let pendingStorageRequests = new Map();
    let storageRequestId = 0;

    // Initialize storage bridge (invisible iframe to GitHub Pages)
    function initStorageBridge() {
        if (storageBridge) return Promise.resolve();
        
        return new Promise((resolve, reject) => {
            storageBridge = document.createElement('iframe');
            storageBridge.style.display = 'none';
            storageBridge.src = STORAGE_BRIDGE_URL;
            
            const messageHandler = (event) => {
                if (event.origin !== 'https://vatsal-ships.github.io') return;
                
                if (event.data.type === 'storage-bridge-ready') {
                    window.removeEventListener('message', messageHandler);
                    resolve();
                } else if (event.data.type === 'storage-response') {
                    const request = pendingStorageRequests.get(event.data.requestId);
                    if (request) {
                        pendingStorageRequests.delete(event.data.requestId);
                        if (event.data.success) {
                            request.resolve(event.data.value);
                        } else {
                            request.reject(new Error(event.data.error));
                        }
                    }
                }
            };
            
            window.addEventListener('message', messageHandler);
            
            storageBridge.onload = () => {
                // Bridge will send ready message
            };
            
            storageBridge.onerror = () => {
                window.removeEventListener('message', messageHandler);
                reject(new Error('Failed to load storage bridge'));
            };
            
            document.body.appendChild(storageBridge);
            
            // Timeout after 10 seconds
            setTimeout(() => {
                if (pendingStorageRequests.size === 0) return; // Already resolved
                window.removeEventListener('message, messageHandler');
                reject(new Error('Storage bridge timeout'));
            }, 10000);
        });
    }

    // Send message to storage bridge
    function sendStorageMessage(action, key, value = null) {
        return new Promise((resolve, reject) => {
            const requestId = ++storageRequestId;
            pendingStorageRequests.set(requestId, { resolve, reject });
            
            storageBridge.contentWindow.postMessage({
                type: 'storage-request',
                requestId,
                action,
                key,
                value
            }, 'https://vatsal-ships.github.io');
            
            // Timeout after 5 seconds
            setTimeout(() => {
                if (pendingStorageRequests.has(requestId)) {
                    pendingStorageRequests.delete(requestId);
                    reject(new Error('Storage request timeout'));
                }
            }, 5000);
        });
    }

    // Robust cross-domain storage functions
    async function getStoredValue(key) {
        try {
            // First try localStorage (fast for same domain)
            const localValue = localStorage.getItem(key);
            if (localValue) {
                return localValue;
            }
            
            // Then try universal bridge storage
            await initStorageBridge();
            return await sendStorageMessage('get', key);
        } catch (e) {
            console.warn('Storage get failed:', e);
            return null;
        }
    }

    async function setStoredValue(key, value) {
        try {
            // Store in localStorage (fast for same domain)
            localStorage.setItem(key, value);
            
            // Also store in universal bridge storage
            await initStorageBridge();
            await sendStorageMessage('set', key, value);
            return true;
        } catch (e) {
            console.warn('Storage set failed:', e);
            return false;
        }
    }

    async function removeStoredValue(key) {
        try {
            // Remove from localStorage
            localStorage.removeItem(key);
            
            // Remove from universal bridge storage
            await initStorageBridge();
            await sendStorageMessage('remove', key);
            return true;
        } catch (e) {
            console.warn('Storage remove failed:', e);
            return false;
        }
    }

    // Check for stored authentication token
    async function getStoredToken() {
        try {
            const tokenString = await getStoredValue('browserPageImpact_token');
            if (!tokenString) return null;
            
            const decrypted = simpleDecrypt(tokenString);
            if (!decrypted) return null;
            
            const parsed = JSON.parse(decrypted);
            const now = Date.now();
            
            // Check if token is expired (with 5 minute buffer)
            if (parsed.expiresAt && now >= (parsed.expiresAt - 300000)) {
                await removeStoredValue('browserPageImpact_token');
                return null;
            }
            
            return parsed;
        } catch (e) {
            console.warn('Get stored token failed:', e);
            return null;
        }
    }
    
    // Store authentication token
    async function storeToken(token, expiresIn) {
        try {
            const tokenData = {
                access_token: token,
                expiresAt: Date.now() + (expiresIn * 1000) // Convert seconds to milliseconds
            };
            
            const encrypted = simpleEncrypt(JSON.stringify(tokenData));
            await setStoredValue('browserPageImpact_token', encrypted);
            return true;
        } catch (e) {
            console.warn('Store token failed:', e);
            return false;
        }
    }
    
    // Initialize masterDocId from storage
    async function initializeMasterDocId() {
        try {
            const docId = await getStoredValue('browserPageImpact_docId');
            if (docId) {
                masterDocId = docId;
            }
        } catch (e) {
            console.warn('Initialize master doc ID failed:', e);
        }
    }
    
    // Handle token expiration
    async function handleTokenExpiration() {
        await removeStoredValue('browserPageImpact_token');
        gapi.client.setToken('');
        isAuthenticated = false;
        
        contentSection.style.display = 'none';
        setupSection.style.display = 'none';
        authSection.style.display = 'block';
        showStatus('Session expired. Please sign in again.', true);
    }

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Create dialog HTML - streamlined for speed
    const dialogHTML = `
        <div id="browser-page-impact-dialog" style="
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
        ">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                <h3 style="margin: 0; font-size: 18px; color: #333;">ImpactDoc</h3>
                <button id="close-dialog" style="background: none; border: none; font-size: 20px; cursor: pointer; color: #666;">×</button>
            </div>
                
                <div id="auth-section" style="display: block; text-align: center;">
                    <p style="color: #4a5568; margin-bottom: 20px; font-size: 16px;">
                        Connect your Google account to access your private document
                    </p>
                    <button id="auth-button" style="
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
                    " onmouseover="this.style.background='#3367d6'" onmouseout="this.style.background='#4285f4'">Sign in with Google</button>
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
                    
                    <div style="background: #f7fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                        <p style="margin: 0 0 12px 0; font-weight: 600; color: #2d3748; font-size: 16px;">Don't have a Google Doc yet?</p>
                        <p style="margin: 0; color: #4a5568; font-size: 14px;">
                            1. Go to <a href="https://docs.google.com" target="_blank" style="color: #4285f4;">docs.google.com</a><br>
                            2. Create a new document<br>
                            3. Copy the document ID from the URL<br>
                            4. Paste it above and click "Connect Document"
                        </p>
                    </div>
                </div>

                <div id="content-section" style="display: none;">
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; color: #2d3748; font-weight: 600;">
                            Select Month:
                        </label>
                        <select id="month-select" style="
                            width: 100%;
                            padding: 12px 16px;
                            border: 2px solid #e2e8f0;
                            border-radius: 8px;
                            font-size: 16px;
                            box-sizing: border-box;
                        ">
                            ${months.map((month, index) => 
                                `<option value="${index}" ${index === new Date().getMonth() ? 'selected' : ''}>${month}</option>`
                            ).join('')}
                        </select>
                    </div>
                    
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
                    " onmouseover="this.style.background='#38a169'" onmouseout="this.style.background='#48bb78'">Add Entry</button>
                    
                    <div style="display: flex; gap: 12px;">
                        <button id="view-doc" style="
                            background: #718096;
                            color: white;
                            border: none;
                            padding: 10px 16px;
                            border-radius: 8px;
                            cursor: pointer;
                            font-size: 14px;
                            flex: 1;
                            font-weight: 500;
                        ">View Document</button>
                        <button id="change-doc" style="
                            background: #ed8936;
                            color: white;
                            border: none;
                            padding: 10px 16px;
                            border-radius: 8px;
                            cursor: pointer;
                            font-size: 14px;
                            flex: 1;
                            font-weight: 500;
                        ">Change Document</button>
                        <button id="sign-out" style="
                            background: #e53e3e;
                            color: white;
                            border: none;
                            padding: 10px 16px;
                            border-radius: 8px;
                            cursor: pointer;
                            font-size: 14px;
                            flex: 1;
                            font-weight: 500;
                        ">Sign Out</button>
                    </div>
                </div>
                
                <div id="status" style="
                    margin-top: 16px;
                    padding: 12px 16px;
                    border-radius: 8px;
                    font-size: 14px;
                    display: none;
                "></div>
            </div>
        </div>
    `;

    // Insert dialog into page
    document.body.insertAdjacentHTML('beforeend', dialogHTML);

    // Get dialog elements
    const dialog = document.getElementById('browser-page-impact-dialog');
    const authSection = document.getElementById('auth-section');
    const setupSection = document.getElementById('setup-section');
    const contentSection = document.getElementById('content-section');
    const authButton = document.getElementById('auth-button');
    const connectDocButton = document.getElementById('connect-doc');
    const addEntryButton = document.getElementById('add-entry');
    const viewDocButton = document.getElementById('view-doc');
    const changeDocButton = document.getElementById('change-doc');
    const signOutButton = document.getElementById('sign-out');
    const closeButton = document.getElementById('close-dialog');
    const statusDiv = document.getElementById('status');

    // Helper functions
    function closeDialog() {
        dialog.remove();
    }

    function showStatus(message, isError = false) {
        statusDiv.textContent = message;
        statusDiv.style.display = 'block';
        statusDiv.style.background = isError ? '#fed7d7' : '#c6f6d5';
        statusDiv.style.color = isError ? '#c53030' : '#2f855a';
        statusDiv.style.border = `2px solid ${isError ? '#feb2b2' : '#9ae6b4'}`;
    }

    // Fast-path initialization - check auth first, load APIs only if needed
    async function initializeFastPath() {
        showStatus('Checking authentication...');
        
        // Initialize storage and check for existing auth
        await initializeMasterDocId();
        const storedToken = await getStoredToken();
        
        if (storedToken && masterDocId) {
            // Fast path: User is authenticated and has document
            contentSection.style.display = 'block';
            showStatus('Ready to add entries!');
            
            // Load APIs in background for when user needs them
            loadGoogleAPIsBackground();
        } else if (storedToken) {
            // User is authenticated but needs to set up document
            setupSection.style.display = 'block';
            showStatus('Please enter your Google Doc ID');
            
            // Load APIs in background
            loadGoogleAPIsBackground();
        } else {
            // User needs to authenticate
            authButton.disabled = false;
            showStatus('Click to authenticate with Google');
        }
    }
    
    // Load Google APIs in background (non-blocking)
    function loadGoogleAPIsBackground() {
        if (gapiInited) return;
        
        const gapiScript = document.createElement('script');
        gapiScript.src = 'https://apis.google.com/js/api.js';
        gapiScript.onload = () => {
            gapi.load('client', () => {
                gapi.client.init({
                    apiKey: API_KEY,
                    discoveryDocs: [DISCOVERY_DOC],
                }).then(() => {
                    gapiInited = true;
                    
                    // Set token if we have one
                    const storedToken = localStorage.getItem('browserPageImpact_token');
                    if (storedToken) {
                        try {
                            const decrypted = simpleDecrypt(storedToken);
                            if (decrypted) {
                                const parsed = JSON.parse(decrypted);
                                gapi.client.setToken({
                                    access_token: parsed.access_token
                                });
                                isAuthenticated = true;
                            }
                        } catch (e) {
                            console.warn('Failed to set background token:', e);
                        }
                    }
                }).catch((error) => {
                    console.error('Background API loading failed:', error);
                });
            });
        };
        gapiScript.onerror = () => {
            console.error('Failed to load Google APIs');
        };
        document.head.appendChild(gapiScript);
    }

    // Load Google APIs (blocking) - only when user takes action
    function loadGoogleAPIs() {
        if (gapiInited) return Promise.resolve();
        
        return new Promise((resolve, reject) => {
            showStatus('Loading Google APIs...');
            
            const gapiScript = document.createElement('script');
            gapiScript.src = 'https://apis.google.com/js/api.js';
            gapiScript.onload = () => {
                gapi.load('client', () => {
                    gapi.client.init({
                        apiKey: API_KEY,
                        discoveryDocs: [DISCOVERY_DOC],
                    }).then(() => {
                        gapiInited = true;
                        resolve();
                    }).catch(reject);
                });
            };
            gapiScript.onerror = () => {
                reject(new Error('Failed to load Google APIs'));
            };
            document.head.appendChild(gapiScript);
        });
    }



    async function handleAuthClick() {
        showStatus('Opening authentication popup...');
        
        // Ensure Google APIs are loaded
        try {
            await loadGoogleAPIs();
        } catch (error) {
            showStatus('Failed to load Google APIs: ' + error.message, true);
            return;
        }
        
        // Open popup window for authentication from our authorized domain
        const authUrl = 'https://vatsal-ships.github.io/impactDoc-bookmarklet/auth-popup.html';
        const popup = window.open(authUrl, 'auth-popup', 'width=500,height=600,scrollbars=yes,resizable=yes');
        
        // Listen for authentication result
        const messageHandler = async (event) => {
            // Verify origin for security
            if (event.origin !== 'https://vatsal-ships.github.io') {
                return;
            }
            
            if (event.data.type === 'auth-success') {
                // Store the token persistently
                await storeToken(event.data.token, event.data.expiresIn);
                
                // Set the token in gapi client
                gapi.client.setToken({
                    access_token: event.data.token,
                    expires_in: event.data.expiresIn
                });
                
                isAuthenticated = true;
                
                // Update UI
                authSection.style.display = 'none';
                if (masterDocId) {
                    contentSection.style.display = 'block';
                    showStatus('Successfully authenticated! Ready to add entries.');
                } else {
                    setupSection.style.display = 'block';
                    showStatus('Successfully authenticated! Please enter your Google Doc ID.');
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

    async function connectDocument() {
        const docId = document.getElementById('doc-id-input').value.trim();
        if (!docId) {
            showStatus('Please enter a Google Doc ID', true);
            return;
        }

        connectDocButton.disabled = true;
        connectDocButton.textContent = 'Connecting...';
        showStatus('Verifying document access...');

        try {
            // Ensure Google APIs are loaded
            if (!gapiInited) {
                await loadGoogleAPIs();
                
                // Set token if we have one
                const storedToken = await getStoredToken();
                if (storedToken) {
                    gapi.client.setToken({
                        access_token: storedToken.access_token
                    });
                    isAuthenticated = true;
                }
            }
            
            await gapi.client.docs.documents.get({
                documentId: docId
            });

            masterDocId = docId;
            await setStoredValue('browserPageImpact_docId', docId);
            setupSection.style.display = 'none';
            contentSection.style.display = 'block';
            showStatus('Document connected successfully!');
        } catch (error) {
            console.error('Error accessing document:', error);
            
            // Check if it's an authentication error
            if (error.status === 401 || error.status === 403) {
                handleTokenExpiration();
                return;
            }
            
            showStatus('Cannot access document. Please check the ID and make sure you have edit access.', true);
        } finally {
            connectDocButton.disabled = false;
            connectDocButton.textContent = 'Connect Document';
        }
    }

    async function findOrCreateMonthSection(monthIndex) {
        const currentYear = new Date().getFullYear();
        const selectedMonth = months[monthIndex];
        const monthHeader = `${selectedMonth} ${currentYear}`;

        try {
            const doc = await gapi.client.docs.documents.get({
                documentId: masterDocId
            });

            const content = doc.result.body.content;
            let insertIndex = -1;
            let monthExists = false;

            // Find the month section
            for (let i = 0; i < content.length; i++) {
                if (content[i].paragraph && content[i].paragraph.elements) {
                    const text = content[i].paragraph.elements[0].textRun?.content || '';
                    if (text.includes(monthHeader)) {
                        monthExists = true;
                        // Find insertion point after this month header
                        for (let j = i + 1; j < content.length; j++) {
                            if (content[j].paragraph && content[j].paragraph.elements) {
                                const nextText = content[j].paragraph.elements[0].textRun?.content || '';
                                if (months.some(month => nextText.includes(`${month} ${currentYear}`) && !nextText.includes(monthHeader))) {
                                    insertIndex = content[j].startIndex;
                                    break;
                                }
                            }
                        }
                        if (insertIndex === -1) {
                            insertIndex = content[content.length - 1].endIndex - 1;
                        }
                        break;
                    }
                }
            }

            if (!monthExists) {
                showStatus(`Creating ${selectedMonth} section...`);
                insertIndex = content[content.length - 1].endIndex - 1;
                
                const monthSection = `\n${monthHeader}\n${'─'.repeat(50)}\n\n`;
                
                await gapi.client.docs.documents.batchUpdate({
                    documentId: masterDocId,
                    resource: {
                        requests: [
                            {
                                insertText: {
                                    location: { index: insertIndex },
                                    text: monthSection
                                }
                            }
                        ]
                    }
                });

                // Format the month header
                await gapi.client.docs.documents.batchUpdate({
                    documentId: masterDocId,
                    resource: {
                        requests: [
                            {
                                updateTextStyle: {
                                    range: {
                                        startIndex: insertIndex + 1,
                                        endIndex: insertIndex + 1 + monthHeader.length
                                    },
                                    textStyle: {
                                        bold: true,
                                        fontSize: { magnitude: 14, unit: 'PT' }
                                    },
                                    fields: 'bold,fontSize'
                                }
                            }
                        ]
                    }
                });

                insertIndex = insertIndex + monthSection.length;
            }

            return insertIndex;
        } catch (error) {
            console.error('Error finding/creating month section:', error);
            
            // Check if it's an authentication error
            if (error.status === 401 || error.status === 403) {
                handleTokenExpiration();
                throw new Error('Authentication expired');
            }
            
            throw error;
        }
    }

    async function addEntry() {
        const monthIndex = parseInt(document.getElementById('month-select').value);
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
        addEntryButton.textContent = 'Adding...';
        showStatus('Adding entry to document...');

        try {
            // Ensure Google APIs are loaded
            if (!gapiInited) {
                await loadGoogleAPIs();
                
                // Set token if we have one
                const storedToken = await getStoredToken();
                if (storedToken) {
                    gapi.client.setToken({
                        access_token: storedToken.access_token
                    });
                    isAuthenticated = true;
                }
            }
            
            const insertIndex = await findOrCreateMonthSection(monthIndex);
            const timestamp = new Date().toLocaleString();
            const entry = `\n${timestamp}\n${entryTitle}\n${content}\n\n`;

            // Insert text and format it to ensure normal (non-bold) text style
            await gapi.client.docs.documents.batchUpdate({
                documentId: masterDocId,
                resource: {
                    requests: [
                        {
                            insertText: {
                                location: { index: insertIndex },
                                text: entry
                            }
                        },
                        {
                            updateTextStyle: {
                                range: {
                                    startIndex: insertIndex,
                                    endIndex: insertIndex + entry.length
                                },
                                textStyle: {
                                    bold: false,
                                    italic: false,
                                    underline: false,
                                    strikethrough: false,
                                    fontSize: { magnitude: 11, unit: 'PT' },
                                    foregroundColor: {
                                        color: {
                                            rgbColor: {
                                                red: 0.0,
                                                green: 0.0,
                                                blue: 0.0
                                            }
                                        }
                                    },
                                    weightedFontFamily: {
                                        fontFamily: 'Arial'
                                    },
                                    backgroundColor: {
                                        color: {
                                            rgbColor: {
                                                red: 1.0,
                                                green: 1.0,
                                                blue: 1.0
                                            }
                                        }
                                    }
                                },
                                fields: 'bold,italic,underline,strikethrough,fontSize,foregroundColor,weightedFontFamily,backgroundColor'
                            }
                        }
                    ]
                }
            });

            showStatus('Entry added successfully!');
            document.getElementById('entry-title').value = '';
            document.getElementById('content-text').value = '';
        } catch (error) {
            console.error('Error adding entry:', error);
            
            // Check if it's an authentication error
            if (error.status === 401 || error.status === 403) {
                handleTokenExpiration();
                return;
            }
            
            showStatus('Failed to add entry: ' + error.message, true);
        } finally {
            addEntryButton.disabled = false;
            addEntryButton.textContent = 'Add Entry';
        }
    }

    function viewDocument() {
        if (masterDocId) {
            window.open(`https://docs.google.com/document/d/${masterDocId}/edit`, '_blank');
        }
    }

    async function changeDocument() {
        masterDocId = null;
        await removeStoredValue('browserPageImpact_docId');
        contentSection.style.display = 'none';
        setupSection.style.display = 'block';
        document.getElementById('doc-id-input').value = '';
        showStatus('Ready to connect to a different document');
    }

    async function signOut() {
        const token = gapi.client.getToken();
        if (token !== null) {
            google.accounts.oauth2.revoke(token.access_token);
            gapi.client.setToken('');
        }
        
        // Clear stored token
        await removeStoredValue('browserPageImpact_token');
        isAuthenticated = false;
        
        authSection.style.display = 'block';
        setupSection.style.display = 'none';
        contentSection.style.display = 'none';
        showStatus('Signed out successfully');
    }

    // Event listeners
    closeButton.addEventListener('click', closeDialog);
    authButton.addEventListener('click', handleAuthClick);
    connectDocButton.addEventListener('click', connectDocument);
    addEntryButton.addEventListener('click', addEntry);
    viewDocButton.addEventListener('click', viewDocument);
    changeDocButton.addEventListener('click', changeDocument);
    signOutButton.addEventListener('click', signOut);

    // Close dialog when clicking outside
    dialog.addEventListener('click', (e) => {
        if (e.target === dialog) {
            closeDialog();
        }
    });

    // Initialize with fast-path for authenticated users
    initializeFastPath();
}; 