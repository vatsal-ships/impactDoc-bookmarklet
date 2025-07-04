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

    let tokenClient;
    let gapiInited = false;
    let gisInited = false;
    let masterDocId = localStorage.getItem('browserPageImpact_docId');

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Create dialog HTML
    const dialogHTML = `
        <div id="browser-page-impact-dialog" style="
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
        ">
            <div style="
                background: white;
                border-radius: 20px;
                padding: 32px;
                width: 500px;
                max-width: 90vw;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
            ">
                <div style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 24px;
                ">
                    <h2 style="margin: 0; color: #2d3748; font-size: 24px; font-weight: 600;">📝 ImpactDoc</h2>
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

    function loadGoogleAPIs() {
        // Load Google APIs script
        const gapiScript = document.createElement('script');
        gapiScript.src = 'https://apis.google.com/js/api.js';
        gapiScript.onload = () => {
            gapi.load('client', initializeGapiClient);
        };
        document.head.appendChild(gapiScript);

        // Load Google Identity Services script
        const gisScript = document.createElement('script');
        gisScript.src = 'https://accounts.google.com/gsi/client';
        gisScript.onload = () => {
            // Initialize with improved configuration
            tokenClient = google.accounts.oauth2.initTokenClient({
                client_id: CLIENT_ID,
                scope: SCOPES,
                callback: '', // defined later
                // Add configuration to handle redirect URIs better
                redirect_uri: window.location.origin,
                ux_mode: 'popup', // Use popup mode to avoid redirect issues
                include_granted_scopes: true
            });
            gisInited = true;
            maybeEnableButtons();
        };
        document.head.appendChild(gisScript);
    }

    function initializeGapiClient() {
        gapi.client.init({
            apiKey: API_KEY,
            discoveryDocs: [DISCOVERY_DOC],
        }).then(() => {
            gapiInited = true;
            maybeEnableButtons();
        }).catch((error) => {
            console.error('Error initializing GAPI client:', error);
            showStatus('Failed to initialize Google APIs: ' + error.message, true);
        });
    }

    function maybeEnableButtons() {
        if (gapiInited && gisInited) {
            authButton.disabled = false;
            showStatus('Ready to authenticate with Google');
        }
    }

    function handleAuthClick() {
        tokenClient.callback = async (resp) => {
            if (resp.error !== undefined) {
                console.error('Auth error:', resp);
                showStatus('Authentication failed: ' + resp.error, true);
                return;
            }

            authSection.style.display = 'none';
            if (masterDocId) {
                contentSection.style.display = 'block';
                showStatus('Successfully authenticated! Ready to add entries.');
            } else {
                setupSection.style.display = 'block';
                showStatus('Successfully authenticated! Please enter your Google Doc ID.');
            }
        };

        tokenClient.error_callback = (error) => {
            console.error('OAuth error:', error);
            showStatus('Authentication error: ' + error.type, true);
        };

        if (gapi.client.getToken() === null) {
            tokenClient.requestAccessToken({prompt: 'consent'});
        } else {
            tokenClient.requestAccessToken({prompt: ''});
        }
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
            await gapi.client.docs.documents.get({
                documentId: docId
            });

            masterDocId = docId;
            localStorage.setItem('browserPageImpact_docId', docId);
            setupSection.style.display = 'none';
            contentSection.style.display = 'block';
            showStatus('Document connected successfully!');
        } catch (error) {
            console.error('Error accessing document:', error);
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

    function changeDocument() {
        masterDocId = null;
        localStorage.removeItem('browserPageImpact_docId');
        contentSection.style.display = 'none';
        setupSection.style.display = 'block';
        document.getElementById('doc-id-input').value = '';
        showStatus('Ready to connect to a different document');
    }

    function signOut() {
        const token = gapi.client.getToken();
        if (token !== null) {
            google.accounts.oauth2.revoke(token.access_token);
            gapi.client.setToken('');
        }
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

    // Initialize
    showStatus('Loading Google APIs...');
    loadGoogleAPIs();
}; 