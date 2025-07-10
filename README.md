# 📝 Browser Page Impact Bookmarklet

A powerful bookmarklet that lets you quickly add entries to your Google Docs tracking document from any webpage. Perfect for tracking ideas, notes, research, or any content you encounter while browsing.

## 🚀 Live Demo & Installation

**👉 [Install the Bookmarklet](https://vatsal-ships.github.io/impactDoc-bookmarklet/)**

Simply drag the bookmarklet button from the installation page to your bookmarks bar - no setup required! The bookmarklet will connect to **your own private Google Doc** that only you can access.

## ✨ Features

- **🔐 Secure Google OAuth** - Safe authentication with your Google account
- **📅 Monthly Organization** - Automatically organizes entries by month
- **🚀 One-Click Access** - Works on any website, no hosting required
- **💾 Persistent Settings** - Remembers your document and preferences
- **📱 Responsive Design** - Works on desktop and mobile browsers
- **🎯 Auto-Create Sections** - Creates month sections automatically if they don't exist
- **⏰ Automatic Timestamps** - Every entry includes when it was added

## 📋 How It Works

1. **Install**: Drag the bookmarklet to your bookmarks bar
2. **Setup**: First time - sign in with Google and enter **your private Google Doc ID**
3. **Use**: Click the bookmark on any webpage to add entries to **your document**
4. **Organize**: Entries are automatically sorted by month with timestamps in **your private Google Doc**

> **🔒 Privacy**: Each user connects to their own private Google Doc. Your data stays in your document, accessible only to you.

## 🛠️ Setup Requirements

### For Users (Simple!)

**No technical setup required!** Just:

1. **Create Your Private Google Doc**
   - Create a new Google Doc at [docs.google.com](https://docs.google.com)
   - This will be YOUR private document - only you can access it
   - Copy the document ID from the URL
   - The ID is the long string in: `docs.google.com/document/d/DOCUMENT_ID/edit`

2. **Install the Bookmarklet**
   - Visit the [installation page](https://vatsal-ships.github.io/impactDoc-bookmarklet/)
   - Drag the bookmarklet button to your bookmarks bar

3. **First Use**
   - Click the bookmarklet on any webpage
   - Sign in with Google (OAuth) - this gives permission to access YOUR documents
   - Enter your private Google Doc ID (one-time setup)
   - Start adding entries to YOUR document!

### For Developers (Advanced)

If you want to fork and customize this project:

1. **Create a Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one

2. **Enable Google Docs API**
   - Go to "APIs & Services" > "Library"
   - Search for "Google Docs API" and enable it

3. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Application type: **Web application**
   - Add authorized JavaScript origins for your domain

4. **Create API Key**
   - Click "Create Credentials" > "API Key"
   - Restrict to Google Docs API for security

5. **Update the Bookmarklet**
   - Replace `CLIENT_ID` and `API_KEY` in the code with your credentials

## 📁 Project Structure

```
browser-page-impact/
├── index.html              # Main GitHub Pages deployment page
├── bookmarklet.js          # Full source code
├── bookmarklet-minified.js # Minified bookmarklet code
├── test.html              # Local testing page
├── deploy.html            # Alternative deployment page
├── setup.sh               # Local development server
├── config-helper.js       # Configuration helper script
├── DEPLOYMENT.md          # Detailed deployment guide
└── README.md              # This file
```

## 🧪 Local Development

```bash
# Clone the repository
git clone https://github.com/vatsal-ships/impactDoc-bookmarklet.git
cd browser-page-impact

# Start local server for testing
./setup.sh

# Visit http://localhost:8000/test.html
```

## 🔧 Configuration

### Using the Helper Script

```bash
node config-helper.js
```

### Manual Configuration

Edit `bookmarklet.js` and update:

```javascript
const CLIENT_ID = 'your-google-client-id.apps.googleusercontent.com';
const API_KEY = 'your-google-api-key';
```

## 📖 Usage Examples

### Document Structure

The bookmarklet creates a well-organized document structure:

```
Browser Page Impact Tracker 2024

January 2024
──────────────────────────────────────────────────

Meeting Notes
12/15/2024, 2:30:45 PM
Discussed project timeline and resource allocation...

Research Findings
12/16/2024, 10:15:30 AM
Found interesting article about productivity methods...

February 2024
──────────────────────────────────────────────────

...
```

### Entry Types

Perfect for tracking:
- Impact Doc for mastery
- 🔍 Research findings and insights
- 💡 Ideas and inspiration
- 🎯 Goals and progress updates

## 🔒 Security & Privacy

- **Your Private Documents**: Each user connects to their own private Google Doc
- **OAuth Authentication**: Secure Google sign-in, no password storage
- **API Key Restrictions**: Limited to Google Docs API only
- **Local Storage**: Only YOUR document ID stored locally in your browser
- **No Server**: Pure client-side application, no data sent to external servers
- **No Shared Data**: Your entries go directly to YOUR Google Doc - not shared with anyone
- **Open Source**: Full code transparency

## 🌐 Browser Compatibility

- ✅ Chrome 70+
- ✅ Firefox 65+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🚀 Deployment

### GitHub Pages (Recommended)

1. Fork this repository
2. Update `CLIENT_ID` and `API_KEY` in the code
3. Enable GitHub Pages in repository settings
4. Your bookmarklet will be available at: `https://YOUR_USERNAME.github.io/browser-page-impact/`

### Using This Public Version

**For most users**: Just use the public version at `https://vatsal-ships.github.io/impactDoc-bookmarklet/` - no setup required!

### Custom Domain

1. Host `index.html` on any web server
2. Update Google OAuth authorized origins
3. Share the URL with users

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📞 Support

- 🐛 [Report Issues](https://github.com/vatsal-ships/impactDoc-bookmarklet/issues)
- 💬 [Discussions](https://github.com/vatsal-ships/impactDoc-bookmarklet/discussions)
- 📧 Email: vatsal.patel@shopify.com

---
