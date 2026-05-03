const fs = require('fs');
const path = require('path');

function traverse(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory() && file !== 'node_modules') {
      traverse(fullPath);
    } else if (fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      // The bug is `${${api.url}}:8000/add_group` which is invalid.
      // We want to replace `${${api.url}}` with `${api.url}`.
      if (content.includes('${${api.url}}')) {
        content = content.split('${${api.url}}').join('${api.url}');
        fs.writeFileSync(fullPath, content);
        console.log('Fixed:', fullPath);
      }
    }
  });
}

traverse('./src');