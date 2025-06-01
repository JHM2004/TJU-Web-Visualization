const fs = require('fs');
const path = require('path');

// 要处理的HTML文件列表
const htmlFiles = [
    '4-screen-paleo-geography-3D.html',
    'mobile-paleo-geography-3D.html',
    'paleo-geography-3D.html',
    'mobile-index.html',
    'pc-index.html',
    '4-screen-biological-evolution-dna-3D.html',
    'mobile-comment.html',
    'mobile-biological-evolution-star-3D.html',
    'mobile-biological-evolution-visualization-3D.html',
    'mobile-biological-evolution-tree-3D.html',
    'mobile-biological-evolution-dna-3D.html',
    '4-screen-biological-evolution-star-3D.html',
    '4-screen-biological-evolution-tree-3D.html',
    '4-screen-biological-evolution-visualization-3D.html',
    '4-screen-biological-evolution-force-2D.html',
    'biological-evolution-visualization-3D.html',
    'biological-evolution-tree-3D.html',
    'biological-evolution-star-3D.html',
    'biological-evolution-force-2D.html',
    'biological-evolution-dna-3D.html',
    'index-earth.html',
    '4-screen-home-page.html',
    '4-screen-biological-evolution-tree-2D.html',
    '4-screen-radial-tidy-tree.html',
    '4-screen-display.html',
    'mobile-biological-evolution-force-2D.html',
    'mobile-home-page.html',
    'index.html',
    'device-testing.html',
    '4-screen-biological-classification-sunburst-2D.html',
    'radial-tidy-tree.html',
    'mobile-radial-tidy-tree.html',
    'mobile-index-earth.html',
    'mobile-biological-evolution-tree-2D.html',
    'mobile-biological-classification-sunburst-2D.html',
    'biological-classification-sunburst-2D.html',
    'biological-evolution-tree-2D.html',
    'z-new.html'
];

// 要添加的CSS和JS引用
const cssLink = '<link rel="stylesheet" href="./static/icp-footer.css">';
const jsScript = '<script src="./static/icp-footer.js"></script>';

// 处理每个HTML文件
htmlFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    
    // 读取文件内容
    let content = fs.readFileSync(filePath, 'utf8');
    
    // 检查是否已经添加了ICP引用
    if (!content.includes('icp-footer.css') && !content.includes('icp-footer.js')) {
        // 在head标签后添加CSS引用
        content = content.replace(/<head>/, `<head>\n    ${cssLink}`);
        
        // 在body标签结束前添加JS引用
        content = content.replace(/<\/body>/, `    ${jsScript}\n</body>`);
        
        // 写回文件
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`已更新文件: ${file}`);
    } else {
        console.log(`文件已包含ICP引用: ${file}`);
    }
}); 