// update-check.js - 增强版：带更新提示界面
(async function() {
    // ================= 配置区域 =================
    // 1. 这里填写你当前的版本号 (每次发新版记得改这个数字)
    const currentVersion = "3.0"; 
    
    // 2. version.json 的路径 (加上时间戳防止缓存)
    const versionUrl = "./version.json?t=" + new Date().getTime(); 
    // ===========================================

    try {
        // 获取服务器上的最新版本号
        const response = await fetch(versionUrl);
        if (!response.ok) throw new Error("无法连接服务器");
        
        const data = await response.json();
        const serverVersion = data.version;

        console.log(`当前版本: ${currentVersion} | 服务器版本: ${serverVersion}`);

        // 如果版本号不一致，说明有更新
        if (serverVersion !== currentVersion) {
            showUpdateScreen(serverVersion);
        }
    } catch (error) {
        console.warn("自动更新检测跳过:", error);
    }

    // --- 显示“正在更新”界面的函数 ---
    function showUpdateScreen(newVer) {
        // 1. 创建遮罩层背景
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.85); /* 黑色半透明背景 */
            z-index: 99999; /* 保证在最顶层 */
            display: flex; flex-direction: column;
            justify-content: center; align-items: center;
            color: white; font-family: sans-serif;
        `;

        // 2. 创建旋转的圆圈 (CSS Loading动画)
        const spinner = document.createElement('div');
        spinner.style.cssText = `
            width: 50px; height: 50px;
            border: 5px solid #f3f3f3;
            border-top: 5px solid #3498db; /* 蓝色旋转条 */
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 20px;
        `;

        // 3. 创建文字提示
        const text = document.createElement('h2');
        text.innerText = `发现新版本 ${newVer}\n正在更新资源，请稍候...`;
        text.style.textAlign = 'center';
        text.style.whiteSpace = 'pre-line'; // 允许换行

        // 4. 组装并添加到页面
        overlay.appendChild(spinner);
        overlay.appendChild(text);
        document.body.appendChild(overlay);

        // 添加旋转动画的关键帧
        const styleSheet = document.createElement("style");
        styleSheet.innerText = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(styleSheet);

        // 5. 延迟 2 秒后强制刷新页面 (给玩家一点看字的时间，同时让浏览器加载新缓存)
        setTimeout(() => {
            window.location.reload(true); // true 参数强制从服务器重新加载
        }, 2000);
    }
})();
