#!/bin/bash

echo "🚀 Browser Page Impact Bookmarklet Setup"
echo "========================================"
echo ""

# Check if Python is available
if command -v python3 &> /dev/null; then
    PYTHON_CMD="python3"
elif command -v python &> /dev/null; then
    PYTHON_CMD="python"
else
    echo "❌ Python not found. Please install Python to run the local server."
    exit 1
fi

echo "✅ Python found: $PYTHON_CMD"
echo ""

# Check if bookmarklet.js exists
if [ ! -f "bookmarklet.js" ]; then
    echo "❌ bookmarklet.js not found in current directory"
    exit 1
fi

echo "✅ bookmarklet.js found"
echo ""

# Check if credentials are configured
if grep -q "YOUR_GOOGLE_CLIENT_ID" bookmarklet.js; then
    echo "⚠️  WARNING: You need to configure your Google credentials!"
    echo "   Please follow the README.md instructions to:"
    echo "   1. Set up Google Cloud Console"
    echo "   2. Enable Google Docs API"
    echo "   3. Create OAuth 2.0 credentials"
    echo "   4. Update CLIENT_ID and API_KEY in bookmarklet.js"
    echo ""
else
    echo "✅ Google credentials appear to be configured"
    echo ""
fi

echo "🌐 Starting local server on http://localhost:8000"
echo "   Press Ctrl+C to stop the server"
echo ""

# Start the server
$PYTHON_CMD -m http.server 8000 