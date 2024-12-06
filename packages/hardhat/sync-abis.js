#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Configuration - directory files
const HARDHAT_ARTIFACTS_PATH = './artifacts/contracts';
const REACT_ABI_PATH = '../react-app/abis';

// Create the React ABI directory if it doesn't exist
if (!fs.existsSync(REACT_ABI_PATH)) {
    fs.mkdirSync(REACT_ABI_PATH, { recursive: true });
}

// Function to walk through directories recursively
function walkDir(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            results = results.concat(walkDir(filePath));
        } else {
            if (file.endsWith('.json') && !file.includes('.dbg.')) {
                results.push(filePath);
            }
        }
    });
    return results;
}

// Main script
console.log("🔄 Syncing ABIs to React app...");

try {
    // Find all artifact JSON files
    const artifactFiles = walkDir(HARDHAT_ARTIFACTS_PATH);

    artifactFiles.forEach(filepath => {
        // Read and parse the artifact file
        const artifact = JSON.parse(fs.readFileSync(filepath, 'utf8'));
        const filename = path.basename(filepath);
        const contractName = filename.replace('.json', '');

        // Extract and save just the ABI
        const abiPath = path.join(REACT_ABI_PATH, `${contractName}.json`);
        fs.writeFileSync(abiPath, JSON.stringify(artifact.abi, null, 2));
        console.log(`Copied ABI for ${contractName}`);
    });

    console.log("✅ ABI sync complete!");
} catch (error) {
    console.error("❌ Error syncing ABIs:", error);
    process.exit(1);
}
