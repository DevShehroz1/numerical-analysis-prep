/* NA Chatbot Floating Widget - load on every page */
(function() {
  // Skip if we're inside the main index (which has its own widget)
  if (window.parent !== window && window.parent.document.getElementById('chatFab')) {
    return;
  }

  // Inject CSS
  const css = `
    .naw-fab {
      position: fixed; bottom: 20px; right: 20px;
      width: 58px; height: 58px; border-radius: 50%;
      background: linear-gradient(135deg, #e07a5f, #d26a4e);
      display: flex; align-items: center; justify-content: center;
      font-size: 1.7rem; cursor: pointer;
      box-shadow: 0 6px 24px rgba(224,122,95,0.45);
      z-index: 99999; border: none; color: #fff;
      transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      font-family: sans-serif;
    }
    .naw-fab:hover { transform: scale(1.08) rotate(-8deg); }
    .naw-fab.naw-hidden { transform: scale(0); pointer-events: none; }
    .naw-fab .naw-pulse {
      position: absolute; inset: -6px;
      border: 2px solid #e07a5f; border-radius: 50%;
      opacity: 0; animation: nawPulse 2s infinite;
    }
    @keyframes nawPulse {
      0% { transform: scale(0.9); opacity: 0.6; }
      70% { transform: scale(1.3); opacity: 0; }
      100% { opacity: 0; }
    }
    .naw-panel {
      position: fixed; bottom: 20px; right: 20px;
      width: 380px; max-width: calc(100vw - 24px);
      height: 560px; max-height: calc(100vh - 80px);
      background: #1a1a2e; border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.5);
      display: none; flex-direction: column;
      z-index: 99999; overflow: hidden;
      border: 1px solid rgba(255,255,255,0.08);
      font-family: 'DM Sans', -apple-system, sans-serif;
      color: #e8e8f0;
    }
    .naw-panel.naw-open {
      display: flex;
      animation: nawSlide 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    @keyframes nawSlide {
      from { opacity: 0; transform: translateY(20px) scale(0.95); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    .naw-header {
      background: linear-gradient(135deg, #25254a, #1a1a2e);
      padding: 14px 16px; display: flex; align-items: center; gap: 12px;
      border-bottom: 1px solid rgba(255,255,255,0.06); flex-shrink: 0;
    }
    .naw-avatar {
      width: 38px; height: 38px; border-radius: 50%;
      background: linear-gradient(135deg, #e07a5f, #81b29a);
      display: flex; align-items: center; justify-content: center;
      font-size: 1.15rem; flex-shrink: 0;
    }
    .naw-info { flex: 1; min-width: 0; }
    .naw-info h3 { font-size: 0.95rem; font-weight: 600; color: #fff; margin: 0; }
    .naw-info p { font-size: 0.7rem; color: #81b29a; margin: 0; }
    .naw-dot {
      display: inline-block; width: 6px; height: 6px;
      background: #81b29a; border-radius: 50%; margin-right: 4px;
      animation: nawBlink 2s infinite;
    }
    @keyframes nawBlink { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
    .naw-close {
      width: 32px; height: 32px; border-radius: 50%;
      background: rgba(255,255,255,0.08); border: none;
      color: #fff; font-size: 1.1rem; cursor: pointer; flex-shrink: 0;
    }
    .naw-close:hover { background: rgba(255,255,255,0.15); }
    .naw-messages {
      flex: 1; overflow-y: auto; padding: 14px;
      display: flex; flex-direction: column; gap: 10px;
      background: #0f0f1a;
    }
    .naw-msg {
      max-width: 85%; padding: 10px 14px; border-radius: 14px;
      font-size: 0.88rem; line-height: 1.55; word-wrap: break-word;
      animation: nawFade 0.3s ease;
    }
    @keyframes nawFade {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .naw-msg.naw-user {
      align-self: flex-end; background: #3d5a80;
      color: #fff; border-bottom-right-radius: 4px;
    }
    .naw-msg.naw-bot {
      align-self: flex-start; background: #1e1e35;
      color: #e8e8f0; border-bottom-left-radius: 4px;
    }
    .naw-msg.naw-bot strong { color: #e07a5f; }
    .naw-msg.naw-bot code {
      background: rgba(0,0,0,0.4); padding: 2px 5px;
      border-radius: 4px; font-size: 0.82em;
    }
    .naw-msg.naw-bot pre {
      background: rgba(0,0,0,0.4); padding: 8px 10px;
      border-radius: 6px; overflow-x: auto; margin: 6px 0; font-size: 0.78rem;
    }
    .naw-msg.naw-bot ul, .naw-msg.naw-bot ol { margin: 6px 0 6px 16px; }
    .naw-msg.naw-bot li { margin-bottom: 3px; }
    .naw-msg.naw-bot h3 { color: #e07a5f; font-size: 0.95rem; margin: 8px 0 3px; }
    .naw-typing {
      display: inline-flex; gap: 4px; padding: 10px 14px;
      background: #1e1e35; border-radius: 14px;
      border-bottom-left-radius: 4px; align-self: flex-start;
    }
    .naw-typing span {
      width: 7px; height: 7px; background: #8888aa;
      border-radius: 50%; animation: nawBounce 1.4s infinite;
    }
    .naw-typing span:nth-child(2) { animation-delay: 0.15s; }
    .naw-typing span:nth-child(3) { animation-delay: 0.3s; }
    @keyframes nawBounce {
      0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
      30% { transform: translateY(-5px); opacity: 1; }
    }
    .naw-suggestions {
      padding: 6px 10px 8px; display: flex; gap: 6px;
      overflow-x: auto; flex-shrink: 0; scrollbar-width: none;
      background: #0f0f1a;
      border-top: 1px solid rgba(255,255,255,0.05);
    }
    .naw-suggestions::-webkit-scrollbar { display: none; }
    .naw-sugg {
      background: #1e1e35; border: 1px solid rgba(255,255,255,0.08);
      color: #e8e8f0; padding: 6px 12px; border-radius: 16px;
      font-size: 0.72rem; white-space: nowrap; cursor: pointer;
      flex-shrink: 0; font-family: inherit;
    }
    .naw-sugg:hover { background: #25254a; border-color: #e07a5f; }
    .naw-input-row {
      background: #1a1a2e; padding: 10px 12px;
      display: flex; gap: 8px;
      border-top: 1px solid rgba(255,255,255,0.06); flex-shrink: 0;
    }
    .naw-input {
      flex: 1; background: #1e1e35;
      border: 1px solid rgba(255,255,255,0.08);
      color: #e8e8f0; padding: 10px 14px; border-radius: 20px;
      font-size: 0.9rem; font-family: inherit; outline: none; min-width: 0;
    }
    .naw-input:focus { border-color: #e07a5f; }
    .naw-input::placeholder { color: #8888aa; }
    .naw-send {
      background: #e07a5f; color: #fff; border: none;
      width: 40px; height: 40px; border-radius: 50%;
      font-size: 1rem; cursor: pointer; flex-shrink: 0;
    }
    .naw-send:hover:not(:disabled) { background: #d26a4e; }
    .naw-send:disabled { opacity: 0.4; cursor: not-allowed; }
    @media (max-width: 600px) {
      .naw-panel { bottom: 12px; right: 12px; left: 12px; width: auto; height: 75vh; }
      .naw-fab { bottom: 16px; right: 16px; }
    }
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  // Inject HTML
  const fab = document.createElement('button');
  fab.className = 'naw-fab';
  fab.id = 'nawFab';
  fab.title = 'Ask NA Chatbot';
  fab.innerHTML = '<span class="naw-pulse"></span>\uD83E\uDD16';
  fab.onclick = openChat;
  document.body.appendChild(fab);

  const panel = document.createElement('div');
  panel.className = 'naw-panel';
  panel.id = 'nawPanel';
  panel.innerHTML = `
    <div class="naw-header">
      <div class="naw-avatar">&#129302;</div>
      <div class="naw-info">
        <h3>NA Study Buddy</h3>
        <p><span class="naw-dot"></span>Ask me anything</p>
      </div>
      <button class="naw-close" id="nawClose">&#10005;</button>
    </div>
    <div class="naw-messages" id="nawMessages">
      <div class="naw-msg naw-bot">
        Hi Shehroz! &#128075; I'm your NA study buddy. Ask me anything about Bisection, False Position, Newton-Raphson, Secant, Gauss, or Gauss-Jordan. &#128170;
      </div>
    </div>
    <div class="naw-suggestions">
      <button class="naw-sugg" data-q="Explain bisection method in easy words">Bisection</button>
      <button class="naw-sugg" data-q="When do I stop iterating?">Stopping rule</button>
      <button class="naw-sugg" data-q="Difference between Newton-Raphson and Secant">NR vs Secant</button>
      <button class="naw-sugg" data-q="Solve f(x) = x^3 - x - 2 by false position">False Position</button>
      <button class="naw-sugg" data-q="Explain Gauss elimination step by step">Gauss</button>
    </div>
    <div class="naw-input-row">
      <input type="text" class="naw-input" id="nawInput" placeholder="Ask your question..." autocomplete="off" />
      <button class="naw-send" id="nawSend">&#10148;</button>
    </div>
  `;
  document.body.appendChild(panel);

  const messages = document.getElementById('nawMessages');
  const input = document.getElementById('nawInput');
  const sendBtn = document.getElementById('nawSend');

  document.getElementById('nawClose').onclick = closeChat;
  sendBtn.onclick = sendChat;
  input.onkeydown = (e) => { if (e.key === 'Enter') sendChat(); };
  panel.querySelectorAll('.naw-sugg').forEach(btn => {
    btn.onclick = () => {
      input.value = btn.getAttribute('data-q');
      sendChat();
    };
  });

  const SYSTEM_PROMPT = `You are a friendly Numerical Analysis tutor for Shehroz, a student preparing for his midterm exam at the University of Lahore. He is new to NA and needs clear, simple explanations in easy words.

Topics in his course ONLY:
1. Bisection Method (main example: f(x) = x^3 - x - 1)
2. False Position / Regula Falsi (f(x) = x^3 - x - 2)
3. Newton-Raphson (f(x) = x^3 - x - 1, x0=1, stopping: |x_{n+1}-x_n| <= 0.001)
4. Secant Method (f(x) = x^3 - x - 1, x0=1, x1=2)
5. Gauss Elimination (3x3 systems)
6. Gauss-Jordan Elimination
7. Error types (absolute, relative, round-off, truncation)

Also advanced NR examples:
- Product Rule: f(x) = x*e^x - 1, root ~0.567
- Quotient Rule: f(x) = (x^2+1)/(x+1) - 2, root ~2.414
- Trigonometric: f(x) = x*cos(x) - 0.5, root ~1.098
- Chain Rule: f(x) = (x^2+1)^3 - 5, root ~1.112

RULES:
- Simple words, short sentences, beginner-friendly.
- Use plain text math: x^3, x_1, or Unicode superscripts/subscripts.
- NEVER use LaTeX ($ or \\( \\)).
- Show iterations in clear numbered steps.
- Always give worked examples with real numbers.
- Keep answers under 250 words unless solving a full example.
- Stopping criterion: |x_new - x_old| <= 0.001.
- Be encouraging; he has only 1-2 days to prepare.
- If asked something outside these topics, politely redirect.`;

  let history = [{ role: 'system', content: SYSTEM_PROMPT }];

  function openChat() {
    panel.classList.add('naw-open');
    fab.classList.add('naw-hidden');
    setTimeout(() => { if (window.innerWidth > 600) input.focus(); }, 300);
  }

  function closeChat() {
    panel.classList.remove('naw-open');
    fab.classList.remove('naw-hidden');
  }

  function addMsg(text, who) {
    const msg = document.createElement('div');
    msg.className = 'naw-msg naw-' + who;
    if (who === 'bot') {
      msg.innerHTML = formatBot(text);
    } else {
      msg.textContent = text;
    }
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
  }

  function formatBot(text) {
    let html = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    html = html.replace(/```([\s\S]*?)```/g, '<pre>$1</pre>');
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    html = html.replace(/^[-*] (.+)$/gm, '<li>$1</li>');
    html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>[\s\S]*?<\/li>)(?!\s*<li>)/g, function(m) {
      return '<ul>' + m + '</ul>';
    });
    html = html.replace(/<\/ul>\s*<ul>/g, '');
    html = html.replace(/\n\n/g, '<br><br>');
    html = html.replace(/\n/g, '<br>');
    return html;
  }

  function showTyping() {
    const t = document.createElement('div');
    t.className = 'naw-typing';
    t.id = 'nawTyping';
    t.innerHTML = '<span></span><span></span><span></span>';
    messages.appendChild(t);
    messages.scrollTop = messages.scrollHeight;
  }

  function hideTyping() {
    const t = document.getElementById('nawTyping');
    if (t) t.remove();
  }

  async function sendChat() {
    const text = input.value.trim();
    if (!text) return;

    addMsg(text, 'user');
    input.value = '';
    sendBtn.disabled = true;
    showTyping();

    history.push({ role: 'user', content: text });

    try {
      if (typeof puter === 'undefined' || !puter.ai) {
        throw new Error('Puter.ai not loaded');
      }
      const response = await puter.ai.chat(history, { model: 'claude-sonnet-4' });
      hideTyping();

      let reply;
      if (typeof response === 'string') {
        reply = response;
      } else if (response && response.message && response.message.content) {
        if (Array.isArray(response.message.content)) {
          reply = response.message.content.map(c => c.text || c).join('\n');
        } else {
          reply = response.message.content;
        }
      } else if (response && response.text) {
        reply = response.text;
      } else {
        reply = String(response);
      }
      history.push({ role: 'assistant', content: reply });
      addMsg(reply, 'bot');
    } catch (err) {
      hideTyping();
      console.error('Chat error:', err);
      addMsg("Sorry, I couldn't connect right now. \uD83D\uDE15<br><br>Try refreshing the page. You may need to sign in to Puter the first time.", 'bot');
    }

    sendBtn.disabled = false;
    if (window.innerWidth > 600) input.focus();
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && panel.classList.contains('naw-open')) {
      closeChat();
    }
  });
})();
