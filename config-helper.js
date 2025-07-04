#!/usr/bin/env node

const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('🔧 Bookmarklet Configuration Helper');
console.log('===================================');
console.log('');

function askQuestion(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer);
        });
    });
}

async function main() {
    try {
        console.log('This helper will update your bookmarklet.js with your Google credentials.');
        console.log('Make sure you have already set up your Google Cloud Console project.');
        console.log('');

        const clientId = await askQuestion('Enter your Google Client ID: ');
        const apiKey = await askQuestion('Enter your Google API Key: ');

        if (!clientId || !apiKey) {
            console.log('❌ Both Client ID and API Key are required.');
            process.exit(1);
        }

        // Read the bookmarklet file
        const bookmarkletPath = './bookmarklet.js';
        if (!fs.existsSync(bookmarkletPath)) {
            console.log('❌ bookmarklet.js not found in current directory.');
            process.exit(1);
        }

        let content = fs.readFileSync(bookmarkletPath, 'utf8');

        // Replace the placeholder values
        content = content.replace(
            'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
            clientId
        );
        content = content.replace(
            'YOUR_GOOGLE_API_KEY',
            apiKey
        );

        // Write the updated content back
        fs.writeFileSync(bookmarkletPath, content);

        console.log('');
        console.log('✅ Configuration updated successfully!');
        console.log('');
        console.log('Next steps:');
        console.log('1. Run ./setup.sh to start the local server');
        console.log('2. Visit http://localhost:8000/test.html');
        console.log('3. Test the bookmarklet');
        console.log('');

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    } finally {
        rl.close();
    }
}

main(); 