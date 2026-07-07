// update-check.js - 版本检测与自动刷新脚本

(async function checkUpdate() {
    // 这里的 version.json 路径必须是相对于当前 html 文件的
    // 如果你的 html 在根目录，直接写 './version.json'
    const versionUrl = './version.json?t=' + new Date().getTime(); 

    try {
        const response = await fetch(versionUrl);
        if (!response.ok) throw new Error('无法获取版本信息');
        
        const data = await response.json();
        const serverVersion = data.version; // 获取服务器版本号
        const localVersion = localStorage.getItem('my_game_version'); // 获取本地记录的版本

        console.log(`服务器版本: ${serverVersion}, 本地版本: ${localVersion}`);

        // 核心逻辑：如果本地没有版本记录，或者版本不一致
        if (!localVersion || localVersion !== serverVersion) {
            console.log("发现新版本，开始清理缓存...");

            // 1. 显示提示信息（可选，你可以做得更漂亮）
            alert(data.message || "检测到更新，正在刷新...");

            // 2. 清除特定的缓存（如果是 PWA 或 Service Worker）
            if ('caches' in window) {
                const cacheNames = await caches.keys();
                await Promise.all(cacheNames.map(name => caches.delete(name)));
            }
            
            // 3. 更新本地版本号
            localStorage.setItem('my_game_version', serverVersion);

            // 4. 强制刷新页面 (true 参数表示忽略缓存重新加载)
            window.location.reload(true);
        }
    } catch (error) {
        console.error("版本检查失败:", error);
    }
})();
