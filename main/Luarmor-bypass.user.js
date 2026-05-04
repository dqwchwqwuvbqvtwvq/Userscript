// ==UserScript==
// @name         Luarmor - Demon Bypass
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  only support linkvertise
// @author       Made by Jova
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

    GM_addStyle(`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Poppins:wght@300;500&display=swap');

        #custom-bypass-ui {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: radial-gradient(circle at center, rgba(15, 15, 35, 0.95), rgba(5, 5, 15, 1));
            backdrop-filter: blur(15px);
            color: white; z-index: 999999;
            display: flex; flex-direction: column;
            align-items: center; justify-content: center;
            font-family: 'Poppins', sans-serif;
            animation: fadeIn 0.8s ease;
        }

        .main-container {
            position: relative; text-align: center;
            padding: 50px; border-radius: 30px;
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 0 40px rgba(0, 209, 255, 0.2);
            overflow: hidden;
        }

        /* Border Animasi Berputar */
        .main-container::before {
            content: ""; position: absolute; top: -50%; left: -50%;
            width: 200%; height: 200%;
            background: conic-gradient(transparent, #00d1ff, transparent, #ff4757, transparent);
            animation: rotateBorder 4s linear infinite;
            z-index: -1;
        }
        .main-container::after {
            content: ""; position: absolute; inset: 4px;
            background: #0f0f1e; border-radius: 26px; z-index: -1;
        }

        .spinner-v2 {
            width: 90px; height: 90px; margin-bottom: 25px;
            border: 5px solid rgba(255, 255, 255, 0.1);
            border-top: 5px solid #00d1ff;
            border-right: 5px solid #ff4757;
            border-radius: 50%;
            animation: spin 1s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite;
        }

        .status-msg {
            font-family: 'Orbitron', sans-serif;
            font-size: 1.5rem; letter-spacing: 2px; margin-bottom: 10px;
            text-transform: uppercase; color: #fff;
            text-shadow: 0 0 10px rgba(0, 209, 255, 0.8);
        }

        .timer-v2 {
            font-size: 3.5rem; font-weight: 700; color: #ff4757;
            text-shadow: 0 0 20px rgba(255, 71, 87, 0.6);
        }

        .jova-badge {
            margin-top: 35px; padding: 8px 20px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(0, 209, 255, 0.3);
            border-radius: 50px; font-size: 0.8rem;
            color: #00d1ff; letter-spacing: 3px;
            box-shadow: 0 0 15px rgba(0, 209, 255, 0.2);
        }

        @keyframes rotateBorder { 100% { transform: rotate(360deg); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    `);

    function createUI() {
        if (document.getElementById('custom-bypass-ui')) return;
        const ui = document.createElement('div');
        ui.id = 'custom-bypass-ui';
        ui.innerHTML = `
            <div class="main-container">
                <center><div class="spinner-v2"></div></center>
                <div class="status-msg" id="status-msg">System Loading...</div>
                <div id="countdown-timer" class="timer-v2">--</div>
                <div class="jova-badge">MADE BY Jova X Zamx</div>
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
                try {
                    const data = JSON.parse(response.responseText);
                    if (data.status === "success") {
                        startCountdown(data.result);
                    } else {
                        document.getElementById('status-msg').innerText = "FAILED";
                        document.getElementById('status-msg').style.color = "#ff4757";
                    }
                } catch(e) {
                    document.getElementById('status-msg').innerText = "ERROR";
                }
            }
        });
    }

    function startCountdown(targetUrl) {
        let timeLeft = 10;
        const timerEl = document.getElementById('countdown-timer');
        document.getElementById('status-msg').innerText = "Bypassed!";
        
        const interval = setInterval(() => {
            timerEl.innerText = timeLeft + "s";
            if (timeLeft-- <= 0) {
                clearInterval(interval);
                window.location.href = targetUrl;
            }
        }, 1000);
    }
})();
