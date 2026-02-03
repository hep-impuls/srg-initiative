const fs = require('fs');
const path = require('path');

const RESTRICTED_CHAR = 'ß';
const IGNORED_DIRS = ['node_modules', '.git', 'dist', 'build', '.claude'];
const IGNORED_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.mp3', '.pdf'];

let foundRestrictedChar = false;

function scanDirectory(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            if (!IGNORED_DIRS.includes(file)) {
                scanDirectory(fullPath);
            }
        } else {
            const ext = path.extname(file).toLowerCase();
            if (!IGNORED_EXTENSIONS.includes(ext)) {
                checkFile(fullPath);
            }
        }
    }
}

function checkFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const lines = content.split('\n');

        lines.forEach((line, index) => {
            if (line.includes(RESTRICTED_CHAR)) {
                console.error(`ERROR: Restricted character '${RESTRICTED_CHAR}' found in:`);
                console.error(`  File: ${filePath}`);
                console.error(`  Line: ${index + 1}`);
                console.error(`  Code: ${line.trim()}`);
                console.error('---------------------------------------------------');
                foundRestrictedChar = true;
            }
        });
    } catch (err) {
        console.error(`Error reading file ${filePath}:`, err);
    }
}

console.log(`Scanning for '${RESTRICTED_CHAR}' in src directory...`);
const srcDir = path.join(__dirname, '..', 'src');

if (fs.existsSync(srcDir)) {
    scanDirectory(srcDir);
} else {
    console.error(`Directory not found: ${srcDir}`);
    process.exit(1);
}

if (foundRestrictedChar) {
    console.error(`\nFAILURE: Found restricted character '${RESTRICTED_CHAR}'. Please replace with 'ss'.`);
    process.exit(1);
} else {
    console.log(`\nSUCCESS: No restricted characters found.`);
    process.exit(0);
}
