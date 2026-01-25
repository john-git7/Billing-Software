const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
    onGoogleAuthSuccess: (callback) =>
        ipcRenderer.on("google-auth-success", (event, token) => callback(token)),

    // Send user info to main process for analytics
    sendUserInfo: (user) =>
        ipcRenderer.send("user-logged-in", user),

    // Window Controls
    windowControls: {
        minimize: () => ipcRenderer.invoke('window-minimize'),
        maximize: () => ipcRenderer.invoke('window-maximize'),
        close: () => ipcRenderer.invoke('window-close'),
    }
});
