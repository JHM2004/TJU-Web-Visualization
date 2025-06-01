document.addEventListener('DOMContentLoaded', function() {
    // 创建ICP备案号元素
    const icpFooter = document.createElement('div');
    icpFooter.className = 'icp-footer';
    icpFooter.innerHTML = `
        <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">
            津ICP备2024027086号-1
        </a>
    `;
    // 直接插入body末尾（流式，不遮挡内容）
    document.body.appendChild(icpFooter);
}); 