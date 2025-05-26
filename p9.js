const fs = require('fs');
const path = require('path');

/**
 * List contents of a directory with type and full path
 * @param {string} dirPath - The directory path
 */
function listDirectoryContents(dirPath) {
  try {
    const items = fs.readdirSync(dirPath);

    const result = items.map(item => {
      const fullPath = path.join(dirPath, item);
      const isDirectory = fs.lstatSync(fullPath).isDirectory();

      return {
        name: item,
        type: isDirectory ? 'directory' : 'file',
        path: fullPath
      };
    });

    console.log(JSON.stringify(result, null, 2));
  } catch (err) {
    console.error('Error reading directory:', err.message);
  }
}

// Get directory from command-line args or default to current directory
const inputPath = process.argv[2] || '.';
listDirectoryContents(inputPath);
