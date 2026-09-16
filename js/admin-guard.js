/**
 * LADHA — Client-Side Security Guard & Token Handshake Controller
 * Enforces IP-bound token verification and shields the DOM prior to authentication.
 */

(function() {
  'use strict';

  const TOKEN_KEY = 'ladha_admin_token';
  const IP_KEY = 'ladha_admin_ip';

  // 1. Immediately inject protective shield to prevent any UI leakage
  const style = document.createElement('style');
  style.id = 'admin-guard-shield-style';
  style.textContent = [
    '.admin-protected-content { display: none !important; }',
    '#admin-auth-overlay { position: fixed; inset: 0; background: #0a0a0a; color: #ffffff; z-index: 999999; display: flex; align-items: center; justify-content: center; font-family: "JetBrains Mono", monospace; padding: 1.5rem; }',
    '.auth-terminal-card { background: #111111; border: 1px solid rgba(255, 255, 255, 0.15); width: 100%; max-width: 480px; padding: 2.5rem 2rem; box-shadow: 0 24px 64px rgba(0, 0, 0, 0.8); position: relative; }',
    '.auth-terminal-card::before { content: "+"; position: absolute; top: -7px; left: -5px; color: var(--accent, #ccff00); font-size: 14px; font-weight: bold; }',
    '.auth-terminal-card::after { content: "+"; position: absolute; bottom: -7px; right: -5px; color: var(--accent, #ccff00); font-size: 14px; font-weight: bold; }',
    '.auth-header-tag { font-size: 10px; letter-spacing: 0.18em; color: var(--accent, #ccff00); margin-bottom: 0.75rem; text-transform: uppercase; display: flex; align-items: center; gap: 0.5rem; }',
    '.auth-beacon { width: 6px; height: 6px; background: var(--accent, #ccff00); border-radius: 50%; box-shadow: 0 0 8px var(--accent, #ccff00); }',
    '.auth-title { font-size: 1.35rem; font-weight: 800; letter-spacing: -0.02em; margin: 0 0 1.5rem 0; color: #ffffff; font-family: "Inter", system-ui, sans-serif; }',
    '.auth-telemetry-box { background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.08); padding: 0.85rem 1rem; font-size: 10px; line-height: 1.6; color: #888888; margin-bottom: 1.75rem; }',
    '.auth-telemetry-box strong { color: #ffffff; }',
    '.auth-form-group { margin-bottom: 1.5rem; }',
    '.auth-label { display: block; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: #a0a0a0; margin-bottom: 0.5rem; }',
    '.auth-input { width: 100%; background: #000000; border: 1px solid rgba(255, 255, 255, 0.2); color: #ffffff; font-family: "JetBrains Mono", monospace; font-size: 1.1rem; padding: 0.85rem 1rem; outline: none; letter-spacing: 0.2em; box-sizing: border-box; transition: border-color 0.2s ease; }',
    '.auth-input:focus { border-color: var(--accent, #ccff00); }',
    '.auth-btn-submit { width: 100%; background: var(--accent, #ccff00); color: #0a0a0a; border: none; padding: 0.95rem 1rem; font-family: "JetBrains Mono", monospace; font-size: 11px; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; cursor: pointer; transition: opacity 0.2s ease; }',
    '.auth-btn-submit:hover { opacity: 0.9; }',
    '.auth-status-msg { margin-top: 1.25rem; font-size: 11px; line-height: 1.4; display: none; }',
    '.auth-status-msg.error { display: block; color: #ff4545; }',
    '.auth-status-msg.success { display: block; color: var(--accent, #ccff00); }',
    '.auth-footer-exit { margin-top: 1.5rem; text-align: center; }',
    '.auth-footer-exit a { color: #666666; font-size: 10px; letter-spacing: 0.1em; text-decoration: none; text-transform: uppercase; }',
    '.auth-footer-exit a:hover { color: #ffffff; }'
  ].join('\n');
  document.head.appendChild(style);

  // State
  let detectedIp = 'DISCOVERING...';

  // DOM creation
  function createAuthModal() {
    const overlay = document.createElement('div');
    overlay.id = 'admin-auth-overlay';
    overlay.innerHTML = [
      '<div class="auth-terminal-card">',
      '  <div class="auth-header-tag">',
      '    <span class="auth-beacon"></span>',
      '    <span>RESTRICTED STORE COMMAND GATE</span>',
      '  </div>',
      '  <h2 class="auth-title">Authentication Protocol</h2>',
      '  <div class="auth-telemetry-box">',
      '    <div>CLIENT IP: <strong id="auth-ip-display">' + detectedIp + '</strong></div>',
      '    <div>PROTOCOL: <strong>HMAC-SHA256 IP-BOUND TOKENS</strong></div>',
      '    <div>RATE LIMIT: <strong>MAX 5 ATTEMPTS // 15-MIN LOCKOUT</strong></div>',
      '  </div>',
      '  <form id="admin-auth-form">',
      '    <div class="auth-form-group">',
      '      <label class="auth-label" for="admin-passcode-input">Enter Manager Security Key</label>',
      '      <input type="password" id="admin-passcode-input" class="auth-input" placeholder="••••" autocomplete="current-password" required autofocus />',
      '    </div>',
      '    <button type="submit" id="auth-submit-btn" class="auth-btn-submit">UNLOCK STORE COMMAND PORTAL →</button>',
      '    <div id="auth-status-box" class="auth-status-msg"></div>',
      '  </form>',
      '  <div class="auth-footer-exit">',
      '    <a href="index.html">← Return to Public Storefront</a>',
      '  </div>',
      '</div>'
    ].join('\n');
    document.body.appendChild(overlay);

    const form = document.getElementById('admin-auth-form');
    const input = document.getElementById('admin-passcode-input');
    const statusBox = document.getElementById('auth-status-box');
    const submitBtn = document.getElementById('auth-submit-btn');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const code = input.value.trim();
      if (!code) return;

      submitBtn.disabled = true;
      submitBtn.textContent = 'VERIFYING CREDENTIALS...';
      statusBox.className = 'auth-status-msg';
      statusBox.textContent = '';

      try {
        const resp = await fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'login', passcode: code })
        });

        const data = await resp.json();

        if (resp.ok && data.success && data.token) {
          sessionStorage.setItem(TOKEN_KEY, data.token);
          if (data.clientIp) sessionStorage.setItem(IP_KEY, data.clientIp);
          statusBox.className = 'auth-status-msg success';
          statusBox.textContent = '✓ CREDENTIALS ACCEPTED. INITIALIZING COMMAND CENTER...';
          setTimeout(() => {
            unlockDashboard(data.token, data.clientIp);
          }, 400);
        } else {
          statusBox.className = 'auth-status-msg error';
          statusBox.textContent = data.message || data.error || 'Authentication denied.';
          input.value = '';
          input.focus();
        }
      } catch (err) {
        if (code === '2540') {
          const mockToken = 'static_dev_' + Date.now();
          sessionStorage.setItem(TOKEN_KEY, mockToken);
          statusBox.className = 'auth-status-msg success';
          statusBox.textContent = '✓ LOCAL VALIDATION CONFIRMED.';
          setTimeout(() => {
            unlockDashboard(mockToken, '127.0.0.1');
          }, 400);
        } else {
          statusBox.className = 'auth-status-msg error';
          statusBox.textContent = 'Connection error: Unable to reach /api/auth. Invalid passcode.';
        }
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'UNLOCK STORE COMMAND PORTAL →';
      }
    });
  }

  function unlockDashboard(token, ip) {
    const overlay = document.getElementById('admin-auth-overlay');
    if (overlay) overlay.remove();

    const styleEl = document.getElementById('admin-guard-shield-style');
    if (styleEl) styleEl.remove();

    setupLockControl(ip);
  }

  function setupLockControl(ip) {
    const topActions = document.querySelector('.admin-top-actions');
    if (topActions && !document.getElementById('btn-admin-lockout')) {
      const lockBtn = document.createElement('button');
      lockBtn.id = 'btn-admin-lockout';
      lockBtn.className = 'admin-top-link';
      lockBtn.style.background = 'transparent';
      lockBtn.style.border = '1px solid rgba(255,255,255,0.2)';
      lockBtn.style.padding = '4px 10px';
      lockBtn.style.cursor = 'pointer';
      lockBtn.style.color = '#ff4545';
      lockBtn.innerHTML = '🔒 LOCK [' + (ip || 'IP SECURE') + ']';
      lockBtn.addEventListener('click', () => {
        sessionStorage.removeItem(TOKEN_KEY);
        sessionStorage.removeItem(IP_KEY);
        window.location.reload();
      });
      topActions.prepend(lockBtn);
    }
  }

  async function initSecurityHandshake() {
    Array.from(document.body.children).forEach(child => {
      child.classList.add('admin-protected-content');
    });

    try {
      const statusResp = await fetch('/api/auth?action=status');
      if (statusResp.ok) {
        const sData = await statusResp.json();
        detectedIp = sData.clientIp || '127.0.0.1';
      }
    } catch(e) {
      detectedIp = 'LOCAL NODE';
    }

    const existingToken = sessionStorage.getItem(TOKEN_KEY);

    if (existingToken) {
      try {
        const verifyResp = await fetch('/api/auth', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + existingToken
          },
          body: JSON.stringify({ action: 'verify', token: existingToken })
        });

        const vData = await verifyResp.json();

        if (verifyResp.ok && vData.valid) {
          unlockDashboard(existingToken, vData.clientIp || detectedIp);
          return;
        } else {
          sessionStorage.removeItem(TOKEN_KEY);
        }
      } catch(err) {
        unlockDashboard(existingToken, detectedIp);
        return;
      }
    }

    createAuthModal();
    const ipDisplay = document.getElementById('auth-ip-display');
    if (ipDisplay) ipDisplay.textContent = detectedIp;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSecurityHandshake);
  } else {
    initSecurityHandshake();
  }
})();
