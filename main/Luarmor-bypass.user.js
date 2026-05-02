// ==UserScript==
// @name         Luarmor & Linkvertise Auto Bypass
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Automate Luarmor checkpoints and bypass Linkvertise with elegant UI
// @author       Partner Coding
// @match        https://ads.luarmor.net/*
// @match        https://linkvertise.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      demonbypass.c5.lol
// @updateURL    https://github.com/dqwchwqwuvbqvtwvq/Userscript/raw/refs/heads/main/main/Luarmor-bypass.user.js
// @downloadURL  https://github.com/dqwchwqwuvbqvtwvq/Userscript/raw/refs/heads/main/main/Luarmor-bypass.user.js
// ==/UserScript==

(function() {
    'use strict';

    const API_KEY = "demon_704b65703b4618318f08bfccd82eac0d";
    const API_URL = "https://demonbypass.c5.lol/api/bypass?apikey=" + API_KEY + "&url=";

    // --- 1. CSS UI Overlay ---
    GM_addStyle(`
        #custom-bypass-ui {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(15, 15, 25, 0.98); color: white;
            z-index: 999999; display: flex; flex-direction: column;
            align-items: center; justify-content: center; font-family: sans-serif;
        }
        .loader-box {
            text-align: center; padding: 30px; border-radius: 15px;
            background: #1e1e2e; border: 1px solid #3e3e5e; box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }
        .spinner {
            border: 4px solid #f3f3f3; border-top: 4px solid #3498db;
            border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite;
            margin: 0 auto 20px;
        }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .status-text { font-size: 1.2rem; margin-bottom: 10px; color: #00d1ff; }
        .timer { font-size: 2rem; margin-top: 10px; color: #ff4757; }
    `);

    function createUI() {
        if (document.getElementById('custom-bypass-ui')) return;
        const ui = document.createElement('div');
        ui.id = 'custom-bypass-ui';
        ui.innerHTML = `
            <div class="loader-box">
                <div class="spinner"></div>
                <div class="status-text" id="status-msg">Bypassing Linkvertise...</div>
                <div id="countdown-timer" class="timer"></div>
            </div>
        `;
        document.body.appendChild(ui);
    }

    const currentUrl = window.location.href;

    if (currentUrl.includes("ads.luarmor.net/get_key")) {
        const startBtn = document.getElementById('nextbtn');
        if (startBtn) setTimeout(() => startBtn.click(), 2000);
    }

    if (currentUrl.includes("linkvertise.com")) {
        createUI();
        GM_xmlhttpRequest({
            method: "GET",
            url: API_URL + encodeURIComponent(currentUrl),
            onload: function(response) {
                const data = JSON.parse(response.responseText);
                if (data.status === "success") {
                    startCountdown(data.result);
                } else {
                    document.getElementById('status-msg').innerText = "Bypass Failed";
                }
            }
        });
    }

    function startCountdown(targetUrl) {
        let timeLeft = 10;
        const timerEl = document.getElementById('countdown-timer');
        document.getElementById('status-msg').innerText = "Redirecting in...";
        const interval = setInterval(() => {
            timerEl.innerText = timeLeft + "s";
            if (timeLeft-- <= 0) {
                clearInterval(interval);
                window.location.href = targetUrl;
            }
        }, 1000);
    }
})();
