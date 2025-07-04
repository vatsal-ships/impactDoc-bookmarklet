# 🚀 GitHub Setup Guide

This guide will help you deploy your Browser Page Impact bookmarklet to GitHub with GitHub Pages for easy sharing.

## 📋 Step-by-Step Setup

### 1. Create GitHub Repository

1. **Go to GitHub** and sign in to your account
2. **Click "New repository"** (green button or + icon)
3. **Repository settings:**
   - Repository name: `browser-page-impact`
   - Description: `A powerful bookmarklet for tracking content to Google Docs`
   - ✅ Public (required for free GitHub Pages)
   - ✅ Add a README file
   - Choose MIT License (recommended)

### 2. Upload Your Files

#### Option A: Using GitHub Web Interface

1. **Click "uploading an existing file"** link
2. **Drag and drop all files:**
   ```
   index.html
   bookmarklet.js
   bookmarklet-minified.js
   test.html
   deploy.html
   setup.sh
   config-helper.js
   DEPLOYMENT.md
   README.md
   ```
3. **Commit message:** "Initial bookmarklet implementation"
4. **Click "Commit changes"**

#### Option B: Using Git Commands

```bash
# Clone your new repository
git clone https://github.com/YOUR_USERNAME/browser-page-impact.git
cd browser-page-impact

# Copy all your files to this directory
cp /path/to/your/files/* .

# Add and commit
git add .
git commit -m "Initial bookmarklet implementation"
git push origin main
```

### 3. Update Configuration

1. **Edit the files** to replace placeholders:
   - In `index.html`: Replace `YOUR_USERNAME` with your GitHub username
   - In `README.md`: Replace `YOUR_USERNAME` with your GitHub username
   - In `bookmarklet.js`: Update `CLIENT_ID` and `API_KEY` with your Google credentials

2. **Commit the changes:**
   ```bash
   git add .
   git commit -m "Update configuration with GitHub username"
   git push origin main
   ```

### 4. Enable GitHub Pages

1. **Go to your repository** on GitHub
2. **Click "Settings"** tab
3. **Scroll down to "Pages"** section
4. **Source:** Deploy from a branch
5. **Branch:** Select `main` (or `master`)
6. **Folder:** `/ (root)`
7. **Click "Save"**

### 5. Update Google Cloud Console

1. **Go to Google Cloud Console** → APIs & Services → Credentials
2. **Edit your OAuth 2.0 Client ID**
3. **Add authorized JavaScript origins:**
   ```
   https://YOUR_USERNAME.github.io
   https://YOUR_USERNAME.github.io/browser-page-impact
   ```
4. **Save changes**

### 6. Test Your Deployment

1. **Wait 5-10 minutes** for GitHub Pages to deploy
2. **Visit:** `https://YOUR_USERNAME.github.io/browser-page-impact/`
3. **Test the drag-and-drop** functionality
4. **Verify OAuth flow** works correctly

## 🎯 Your Repository Structure

After setup, your repository should look like:

```
browser-page-impact/
├── .git/                   # Git metadata
├── index.html             # 🌟 Main GitHub Pages site
├── bookmarklet.js         # Full source code
├── bookmarklet-minified.js # Minified version
├── test.html             # Local testing
├── deploy.html           # Alternative deployment page
├── setup.sh              # Development server
├── config-helper.js      # Configuration helper
├── DEPLOYMENT.md         # Deployment documentation
├── GITHUB_SETUP.md       # This guide
├── README.md             # Project documentation
└── LICENSE               # MIT License
```

## 🔗 Share Your Bookmarklet

Once deployed, you can share:

**📱 Installation Page:**
```
https://YOUR_USERNAME.github.io/browser-page-impact/
```

**📋 Direct Repository:**
```
https://github.com/YOUR_USERNAME/browser-page-impact
```

## 🔧 Customization Options

### Update Branding

1. **Edit `index.html`:**
   - Change title and description
   - Update colors in CSS
   - Add your personal branding

2. **Edit `README.md`:**
   - Update contact information
   - Add your email/social links
   - Customize project description

### Add Custom Domain (Optional)

1. **Purchase a domain** (e.g., `mybookmarklet.com`)
2. **Add CNAME file** to repository root:
   ```
   mybookmarklet.com
   ```
3. **Configure DNS** with your domain provider
4. **Update Google OAuth** authorized origins

## 🛠️ Maintenance

### Update Credentials

When you need to update Google credentials:

1. **Edit the files** with new CLIENT_ID/API_KEY
2. **Commit and push:**
   ```bash
   git add .
   git commit -m "Update Google credentials"
   git push origin main
   ```
3. **GitHub Pages auto-deploys** in ~5 minutes

### Version Updates

For new features or bug fixes:

1. **Make your changes**
2. **Test locally** with `./setup.sh`
3. **Commit and push:**
   ```bash
   git add .
   git commit -m "Add new feature: description"
   git push origin main
   ```

## 📊 Analytics (Optional)

### Add Google Analytics

1. **Create Google Analytics account**
2. **Add tracking code** to `index.html`:
   ```html
   <!-- Google Analytics -->
   <script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'GA_TRACKING_ID');
   </script>
   ```

### Monitor Usage

- **GitHub Insights:** See repository traffic and clones
- **Google Cloud Console:** Monitor API usage
- **Google Analytics:** Track installation page visits

## 🎉 You're Done!

Your bookmarklet is now:

- ✅ **Hosted on GitHub Pages** - Free and reliable
- ✅ **Easy to share** - Simple URL to send to users
- ✅ **Version controlled** - Track changes and updates
- ✅ **Professional presentation** - Beautiful installation page
- ✅ **Open source** - Others can contribute and learn

**Share your installation page:**
`https://YOUR_USERNAME.github.io/browser-page-impact/`

## 🆘 Troubleshooting

### GitHub Pages Not Working

- Check repository is public
- Verify Pages is enabled in Settings
- Wait 10-15 minutes for initial deployment
- Check for typos in file names

### OAuth Errors

- Verify authorized origins include GitHub Pages URL
- Check CLIENT_ID and API_KEY are correct
- Ensure Google Docs API is enabled

### Bookmarklet Not Working

- Test on different websites
- Check browser console for errors
- Verify Google credentials are updated
- Try refreshing the page

Need help? [Create an issue](https://github.com/YOUR_USERNAME/browser-page-impact/issues) in your repository! 