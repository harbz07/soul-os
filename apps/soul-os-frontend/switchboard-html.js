export const SWITCHBOARD_HTML = `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
<!--
 ██████╗ ██████╗ ██╗   ██╗██████╗ ██╗███████╗██████╗
██╔════╝██╔═══██╗██║   ██║██╔══██╗██║██╔════╝██╔══██╗
██║     ██║   ██║██║   ██║██████╔╝██║█████╗  ██████╔╝
██║     ██║   ██║██║   ██║██╔══██╗██║██╔══╝  ██╔══██╗
╚██████╗╚██████╔╝╚██████╔╝██║  ██║██║███████╗██║  ██║
 ╚═════╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚═╝╚══════╝╚═╝  ╚═╝
        Constellation Switchboard v2 — soul-os.cc
-->
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Constellation Switchboard — soul-os.cc</title>
<link rel="preconnect" href="https://api.fontshare.com">
<link href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&f[]=jet-brains-mono@400,500&display=swap" rel="stylesheet">
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><circle cx='16' cy='16' r='14' fill='none' stroke='%234F98A3' stroke-width='2'/><circle cx='16' cy='16' r='3' fill='%234F98A3'/><line x1='16' y1='2' x2='16' y2='10' stroke='%234F98A3' stroke-width='1.5'/><line x1='16' y1='22' x2='16' y2='30' stroke='%234F98A3' stroke-width='1.5'/><line x1='2' y1='16' x2='10' y2='16' stroke='%234F98A3' stroke-width='1.5'/><line x1='22' y1='16' x2='30' y2='16' stroke='%234F98A3' stroke-width='1.5'/></svg>">
<style>
/* ===== TOKENS ===== */
:root {
  --font-body: 'General Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'JetBrains Mono', 'SF Mono', 'Fira Code', monospace;

  --text-xs:   clamp(0.75rem,  0.7rem  + 0.25vw, 0.8rem);
  --text-sm:   clamp(0.8125rem, 0.78rem + 0.2vw, 0.875rem);
  --text-base: clamp(0.875rem, 0.85rem + 0.15vw, 0.9375rem);
  --text-lg:   clamp(1rem, 0.95rem + 0.3vw, 1.125rem);
  --text-xl:   clamp(1.25rem, 1.1rem + 0.5vw, 1.5rem);

  --space-1: 0.25rem; --space-2: 0.5rem; --space-3: 0.75rem;
  --space-4: 1rem; --space-5: 1.25rem; --space-6: 1.5rem;
  --space-8: 2rem; --space-10: 2.5rem; --space-12: 3rem;

  --radius-sm: 0.375rem; --radius-md: 0.5rem;
  --radius-lg: 0.75rem; --radius-xl: 1rem;
  --transition: 180ms cubic-bezier(0.16, 1, 0.3, 1);

  --bg: #0b0e14;
  --surface: #111520;
  --surface-2: #161b28;
  --surface-3: #1c2233;
  --border: #252d3f;
  --border-subtle: #1e2536;
  --text: #c8cdd8;
  --text-muted: #6b7280;
  --text-faint: #404858;
  --cyan: #4fd1c5;
  --cyan-dim: #2a9d8f;
  --cyan-glow: rgba(79,209,197,0.12);
  --amber: #f59e0b;
  --amber-dim: rgba(245,158,11,0.15);
  --green: #34d399;
  --green-dim: rgba(52,211,153,0.15);
  --red: #f87171;
  --red-dim: rgba(248,113,113,0.15);
  --purple: #a78bfa;
  --purple-dim: rgba(167,139,250,0.12);
  --blue: #60a5fa;
  --blue-dim: rgba(96,165,250,0.15);
  --pink: #f472b6;
  --pink-dim: rgba(244,114,182,0.15);
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; scroll-behavior: smooth; }
body {
  min-height: 100dvh;
  font-family: var(--font-body);
  font-size: var(--text-base);
  color: var(--text);
  background: var(--bg);
  line-height: 1.6;
  display: flex;
  flex-direction: column;
}
button { cursor: pointer; background: none; border: none; font: inherit; color: inherit; }
a { color: var(--cyan); text-decoration: none; }
a:hover { text-decoration: underline; }
input, select, textarea {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: var(--space-2) var(--space-3);
  color: var(--text);
  font-size: var(--text-sm);
  font-family: var(--font-body);
  outline: none;
  transition: border-color var(--transition);
  width: 100%;
}
input:focus, select:focus, textarea:focus { border-color: var(--cyan-dim); }
select { font-family: var(--font-body); }

/* ===== SCROLLBAR ===== */
::-webkit-scrollbar { width: 5px; height: 5px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: var(--text-faint); }

/* ===== SHELL ===== */
.shell { display: flex; flex-direction: column; min-height: 100dvh; }

/* ===== TOPBAR ===== */
.topbar {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-3) var(--space-5);
  background: var(--surface);
  border-bottom: 1px solid var(--border-subtle);
  position: sticky;
  top: 0;
  z-index: 100;
  flex-shrink: 0;
}
.topbar-logo {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-shrink: 0;
}
.topbar-logo svg { width: 28px; height: 28px; }
.topbar-logo-text {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--cyan);
  letter-spacing: -0.01em;
  line-height: 1.2;
}
.topbar-logo-sub {
  font-size: var(--text-xs);
  color: var(--text-faint);
  font-family: var(--font-mono);
}
.topbar-status {
  display: flex;
  gap: var(--space-3);
  margin-left: var(--space-4);
}
.status-pill {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--text-xs);
  font-family: var(--font-mono);
  color: var(--text-muted);
  padding: 2px 8px;
  border-radius: 999px;
  border: 1px solid var(--border-subtle);
  background: var(--surface-2);
  transition: all var(--transition);
  cursor: pointer;
  user-select: none;
}
.status-pill:hover { border-color: var(--border); }
.status-dot {
  width: 5px; height: 5px;
  border-radius: 50%;
  flex-shrink: 0;
}
.status-dot.online  { background: var(--green);  box-shadow: 0 0 5px var(--green); }
.status-dot.offline { background: var(--red);    box-shadow: 0 0 5px var(--red); }
.status-dot.checking{ background: var(--amber);  animation: pulse 1.2s infinite; }
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }

.topbar-right { margin-left: auto; display: flex; gap: var(--space-2); align-items: center; }
.btn-sm {
  padding: 5px 12px;
  border-radius: var(--radius-sm);
  font-size: var(--text-xs);
  font-family: var(--font-mono);
  border: 1px solid var(--border);
  color: var(--text-muted);
  transition: all var(--transition);
  white-space: nowrap;
}
.btn-sm:hover { border-color: var(--cyan-dim); color: var(--cyan); background: var(--cyan-glow); }
.btn-sm.primary { background: var(--cyan-dim); color: #fff; border-color: var(--cyan-dim); }
.btn-sm.primary:hover { background: var(--cyan); }

/* ===== TABS ===== */
.tabs-wrapper {
  display: flex;
  align-items: center;
  gap: 0;
  padding: 0 var(--space-5);
  background: var(--surface);
  border-bottom: 1px solid var(--border-subtle);
  overflow-x: auto;
  flex-shrink: 0;
}
.tab-btn {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--text-muted);
  border-bottom: 2px solid transparent;
  white-space: nowrap;
  transition: color var(--transition), border-color var(--transition);
  position: relative;
  top: 1px;
}
.tab-btn svg { width: 15px; height: 15px; flex-shrink: 0; }
.tab-btn:hover { color: var(--text); }
.tab-btn.active { color: var(--cyan); border-bottom-color: var(--cyan); }

/* ===== CONTENT ===== */
.content { flex: 1; overflow: hidden; display: flex; }
.tab-panel {
  display: none;
  flex: 1;
  overflow: hidden;
  flex-direction: column;
}
.tab-panel.active { display: flex; }
.panel-body {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-5);
  max-width: 1000px;
  margin: 0 auto;
  width: 100%;
}

/* ===== SECTION HEADERS ===== */
.section-heading {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--text);
  margin-bottom: var(--space-4);
  display: flex;
  align-items: center;
  gap: var(--space-2);
}
.section-heading svg { color: var(--cyan-dim); flex-shrink: 0; }
.section-sub {
  font-size: var(--text-xs);
  color: var(--text-muted);
  margin-top: calc(-1 * var(--space-3));
  margin-bottom: var(--space-5);
}

/* ===== CARDS ===== */
.card {
  background: var(--surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  overflow: hidden;
  margin-bottom: var(--space-4);
}
.card-header {
  padding: var(--space-3) var(--space-4);
  background: var(--surface-2);
  border-bottom: 1px solid var(--border-subtle);
  font-size: var(--text-sm);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: var(--space-2);
  justify-content: space-between;
}
.card-body { padding: var(--space-4); }
.card-body-tight { padding: var(--space-3) var(--space-4); }

/* ===== FORM ROWS ===== */
.form-row {
  display: flex;
  gap: var(--space-3);
  margin-bottom: var(--space-3);
  flex-wrap: wrap;
}
.form-row:last-child { margin-bottom: 0; }
.form-group { display: flex; flex-direction: column; gap: var(--space-1); flex: 1; min-width: 140px; }
.form-group.grow { flex: 3; }
.form-group.shrink { flex: 0 0 auto; min-width: 0; }
.form-label {
  font-size: var(--text-xs);
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-weight: 500;
}

/* ===== AGENT PILLS ===== */
.agent-pills {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-bottom: var(--space-3);
}
.agent-pill {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  padding: 4px 12px;
  border-radius: 999px;
  border: 1px solid var(--border);
  font-size: var(--text-xs);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition);
  user-select: none;
}
.agent-pill:hover { border-color: var(--border); filter: brightness(1.2); }
.agent-pill.selected { border-width: 2px; }
.agent-pill .dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }

/* ===== CHAT PANEL ===== */
.chat-layout {
  display: flex;
  flex-direction: column;
  height: calc(100dvh - 107px); /* topbar + tabs */
}
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  max-width: 820px;
  margin: 0 auto;
  width: 100%;
}
.msg {
  display: flex;
  gap: var(--space-3);
  align-items: flex-start;
  max-width: 100%;
}
.msg.user { flex-direction: row-reverse; }
.msg-avatar {
  width: 32px; height: 32px;
  border-radius: var(--radius-md);
  display: flex; align-items: center; justify-content: center;
  font-size: var(--text-xs);
  font-weight: 700;
  flex-shrink: 0;
  font-family: var(--font-mono);
}
.msg-body { max-width: 78%; }
.msg.user .msg-body { align-items: flex-end; display: flex; flex-direction: column; }
.msg-agent {
  font-size: var(--text-xs);
  font-family: var(--font-mono);
  color: var(--text-muted);
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: var(--space-2);
}
.msg.user .msg-agent { justify-content: flex-end; }
.msg-bubble {
  background: var(--surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: var(--space-3) var(--space-4);
  font-size: var(--text-sm);
  line-height: 1.65;
  word-break: break-word;
  white-space: pre-wrap;
}
.msg.user .msg-bubble {
  background: var(--cyan-glow);
  border-color: var(--cyan-dim);
}
.msg-bubble.thinking {
  color: var(--text-muted);
  font-style: italic;
  display: flex;
  align-items: center;
  gap: var(--space-2);
}
.thinking-dots { display: flex; gap: 3px; }
.thinking-dots span {
  width: 5px; height: 5px; border-radius: 50%;
  background: var(--text-muted);
  animation: bounce 1.2s infinite;
}
.thinking-dots span:nth-child(2) { animation-delay: 0.2s; }
.thinking-dots span:nth-child(3) { animation-delay: 0.4s; }
@keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-5px)} }

.msg-meta {
  font-size: var(--text-xs);
  color: var(--text-faint);
  font-family: var(--font-mono);
  margin-top: 4px;
}
.msg.user .msg-meta { text-align: right; }

.chat-footer {
  border-top: 1px solid var(--border-subtle);
  background: var(--surface);
  padding: var(--space-3) var(--space-5);
  flex-shrink: 0;
}
.chat-composer {
  max-width: 820px;
  margin: 0 auto;
}
.chat-config {
  display: flex;
  gap: var(--space-2);
  margin-bottom: var(--space-2);
  flex-wrap: wrap;
  align-items: center;
}
.chat-config select {
  width: auto;
  flex: 0 0 auto;
  font-size: var(--text-xs);
  padding: 4px 10px;
  border-radius: var(--radius-sm);
}
.chat-config-label {
  font-size: var(--text-xs);
  color: var(--text-faint);
  font-family: var(--font-mono);
}
.chat-input-row {
  display: flex;
  gap: var(--space-2);
  align-items: flex-end;
}
.chat-input-row textarea {
  resize: none;
  min-height: 44px;
  max-height: 160px;
  overflow-y: auto;
  line-height: 1.5;
  border-radius: var(--radius-lg);
  padding: var(--space-3) var(--space-3);
  font-size: var(--text-sm);
}
.btn-send {
  width: 40px; height: 40px;
  border-radius: var(--radius-md);
  background: var(--cyan-dim);
  color: #fff;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  transition: background var(--transition);
}
.btn-send:hover { background: var(--cyan); }
.btn-send svg { width: 16px; height: 16px; }
.btn-send:disabled { opacity: 0.4; pointer-events: none; }

/* ===== ROUNDTABLE ===== */
.roundtable-layout {
  display: flex;
  flex-direction: column;
  height: calc(100dvh - 107px);
}
.roundtable-transcript {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  max-width: 900px;
  margin: 0 auto;
  width: 100%;
}
.rt-turn {
  display: flex;
  gap: var(--space-3);
  align-items: flex-start;
}
.rt-avatar {
  width: 36px; height: 36px;
  border-radius: var(--radius-md);
  display: flex; align-items: center; justify-content: center;
  font-size: var(--text-xs);
  font-weight: 700;
  flex-shrink: 0;
  font-family: var(--font-mono);
}
.rt-body { flex: 1; min-width: 0; }
.rt-header {
  font-size: var(--text-xs);
  font-family: var(--font-mono);
  color: var(--text-muted);
  margin-bottom: 4px;
  display: flex;
  gap: var(--space-2);
  align-items: baseline;
}
.rt-round-badge {
  font-size: 10px;
  padding: 1px 6px;
  border-radius: 999px;
  background: var(--surface-3);
  border: 1px solid var(--border-subtle);
}
.rt-text {
  background: var(--surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: var(--space-3) var(--space-4);
  font-size: var(--text-sm);
  line-height: 1.65;
  word-break: break-word;
  white-space: pre-wrap;
}
.roundtable-footer {
  border-top: 1px solid var(--border-subtle);
  background: var(--surface);
  padding: var(--space-4) var(--space-5);
  flex-shrink: 0;
}
.roundtable-config {
  max-width: 900px;
  margin: 0 auto;
}

/* ===== DISPATCH RAW ===== */
.dispatch-layout { flex: 1; overflow-y: auto; }
.dispatch-body-area {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  min-height: 140px;
  resize: vertical;
  border-radius: var(--radius-md);
  line-height: 1.6;
}
.result-box {
  background: var(--bg);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: var(--space-3);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-all;
  max-height: 360px;
  overflow-y: auto;
  color: var(--text-muted);
}
.result-status {
  font-weight: 600;
  margin-bottom: var(--space-1);
  display: flex;
  align-items: center;
  gap: var(--space-2);
}
.result-status.ok { color: var(--green); }
.result-status.err { color: var(--red); }

/* ===== THREAD BROWSER ===== */
.thread-list { list-style: none; }
.thread-item {
  display: flex;
  gap: var(--space-3);
  align-items: center;
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--border-subtle);
  font-size: var(--text-sm);
  transition: background var(--transition);
  cursor: pointer;
}
.thread-item:last-child { border-bottom: none; }
.thread-item:hover { background: var(--surface-2); }
.thread-id {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--cyan-dim);
  min-width: 160px;
  flex-shrink: 0;
}
.thread-info { flex: 1; min-width: 0; }
.thread-name { font-weight: 500; }
.thread-participants {
  font-size: var(--text-xs);
  color: var(--text-muted);
  font-family: var(--font-mono);
}
.thread-badge {
  font-size: var(--text-xs);
  font-family: var(--font-mono);
  padding: 2px 8px;
  border-radius: 999px;
  border: 1px solid var(--border-subtle);
  color: var(--text-muted);
  flex-shrink: 0;
}

/* ===== GRAPH VIEWER ===== */
#graph-canvas-wrap {
  width: 100%;
  min-height: 420px;
  background: var(--surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  overflow: hidden;
  position: relative;
  margin-bottom: var(--space-4);
}
#graph-canvas {
  width: 100%;
  height: 420px;
  display: block;
}
.graph-legend {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  font-size: var(--text-xs);
  font-family: var(--font-mono);
  color: var(--text-muted);
  margin-top: var(--space-2);
}
.graph-legend-item { display: flex; align-items: center; gap: var(--space-1); }
.legend-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }

/* ===== MAILBOX ===== */
.mailbox-msg {
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--border-subtle);
  font-size: var(--text-sm);
  transition: background var(--transition);
}
.mailbox-msg:last-child { border-bottom: none; }
.mailbox-msg:hover { background: var(--surface-2); }
.mailbox-msg-header {
  display: flex;
  gap: var(--space-2);
  align-items: baseline;
  margin-bottom: var(--space-1);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
}
.mailbox-from { color: var(--cyan-dim); font-weight: 600; }
.mailbox-intent { color: var(--amber); }
.mailbox-ts { color: var(--text-faint); margin-left: auto; }
.mailbox-body-text {
  color: var(--text-muted);
  line-height: 1.5;
  font-size: var(--text-xs);
}
.unread-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: var(--cyan);
  flex-shrink: 0;
}

/* ===== SAMSARA ===== */
.samsara-cast {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: var(--space-3);
  margin-bottom: var(--space-4);
}
.cast-card {
  background: var(--surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  transition: border-color var(--transition);
}
.cast-card:hover { border-color: var(--border); }
.cast-name { font-weight: 600; margin-bottom: 2px; }
.cast-role {
  font-size: var(--text-xs);
  color: var(--text-muted);
  margin-bottom: var(--space-2);
}
.cast-oneliner {
  font-size: var(--text-xs);
  color: var(--text-faint);
  font-style: italic;
  line-height: 1.5;
}
.cast-provider {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  padding: 2px 6px;
  background: var(--surface-2);
  border-radius: var(--radius-sm);
  display: inline-block;
  margin-top: var(--space-2);
  color: var(--text-faint);
}

/* mode chips */
.mode-chips { display: flex; flex-wrap: wrap; gap: var(--space-2); margin-bottom: var(--space-3); }
.mode-chip {
  padding: 5px 14px;
  border-radius: 999px;
  border: 1px solid var(--border);
  font-size: var(--text-xs);
  font-family: var(--font-mono);
  color: var(--text-muted);
  cursor: pointer;
  transition: all var(--transition);
  user-select: none;
}
.mode-chip:hover { border-color: var(--purple-dim); color: var(--purple); }
.mode-chip.selected { background: var(--purple-dim); border-color: var(--purple); color: var(--purple); }

/* debate transcript */
.debate-turn {
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--border-subtle);
  font-size: var(--text-sm);
}
.debate-turn:last-child { border-bottom: none; }
.debate-turn-header {
  display: flex;
  gap: var(--space-2);
  align-items: baseline;
  margin-bottom: var(--space-1);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
}
.debate-speaker { font-weight: 700; }
.debate-role-badge {
  font-size: 10px;
  padding: 1px 6px;
  border-radius: 999px;
  background: var(--surface-3);
  border: 1px solid var(--border-subtle);
}
.debate-argument {
  color: var(--text-muted);
  line-height: 1.65;
  white-space: pre-wrap;
}

/* ===== TOPOLOGY NODES ===== */
.topo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: var(--space-3);
  margin-bottom: var(--space-6);
}
.node-card {
  background: var(--surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  position: relative;
  overflow: hidden;
}
.node-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
}
.node-card[data-node="frontend"]::before { background: var(--cyan); }
.node-card[data-node="api"]::before { background: var(--amber); }
.node-card[data-node="siddhartha"]::before { background: var(--purple); }
.node-card[data-node="comet"]::before { background: var(--blue); }
.node-name { font-size: var(--text-sm); font-weight: 600; margin-bottom: var(--space-1); display: flex; align-items: center; gap: var(--space-2); }
.node-url { font-family: var(--font-mono); font-size: var(--text-xs); color: var(--text-muted); }
.node-desc { font-size: var(--text-xs); color: var(--text-muted); margin-top: var(--space-2); line-height: 1.5; }
.node-status { display: flex; align-items: center; gap: var(--space-1); font-size: var(--text-xs); font-family: var(--font-mono); margin-top: var(--space-3); }
.node-badge {
  font-size: var(--text-xs);
  font-family: var(--font-mono);
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  font-weight: 500;
}
.badge-cyan { background: var(--cyan-glow); color: var(--cyan); }
.badge-amber { background: var(--amber-dim); color: var(--amber); }
.badge-purple { background: var(--purple-dim); color: var(--purple); }
.badge-blue { background: var(--blue-dim); color: var(--blue); }

/* ===== ROUTE TABLE ===== */
.route-group {
  background: var(--surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  overflow: hidden;
  margin-bottom: var(--space-3);
}
.route-group-header {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  background: var(--surface-2);
  border-bottom: 1px solid var(--border-subtle);
  cursor: pointer;
  user-select: none;
  transition: background var(--transition);
}
.route-group-header:hover { background: var(--surface-3); }
.route-group-header .chevron {
  width: 15px; height: 15px;
  color: var(--text-faint);
  transition: transform var(--transition);
  flex-shrink: 0;
}
.route-group-header.collapsed .chevron { transform: rotate(-90deg); }
.route-group-header .group-label { font-size: var(--text-sm); font-weight: 600; flex: 1; }
.route-group-header .group-count { font-size: var(--text-xs); font-family: var(--font-mono); color: var(--text-faint); }
.route-list { list-style: none; }
.route-list.hidden { display: none; }
.route-item {
  display: grid;
  grid-template-columns: 60px 1fr auto;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--border-subtle);
  font-size: var(--text-sm);
  transition: background var(--transition);
}
.route-item:last-child { border-bottom: none; }
.route-item:hover { background: var(--surface-2); }
.method-badge {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  font-weight: 600;
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  text-align: center;
  letter-spacing: 0.02em;
}
.method-GET    { background: var(--green-dim);  color: var(--green); }
.method-POST   { background: var(--blue-dim);   color: var(--blue); }
.method-DELETE { background: var(--red-dim);    color: var(--red); }
.route-path { font-family: var(--font-mono); font-size: var(--text-xs); color: var(--text); }
.route-desc { font-size: var(--text-xs); color: var(--text-muted); }
.btn-probe {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  padding: 3px 9px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  color: var(--text-muted);
  transition: all var(--transition);
  white-space: nowrap;
}
.btn-probe:hover { border-color: var(--cyan-dim); color: var(--cyan); background: var(--cyan-glow); }
.probe-result {
  grid-column: 1 / -1;
  margin-top: var(--space-2);
  background: var(--bg);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: var(--space-3);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  white-space: pre-wrap;
  word-break: break-all;
  max-height: 260px;
  overflow-y: auto;
  color: var(--text-muted);
}

/* ===== EMPTY STATE ===== */
.empty-state {
  text-align: center;
  padding: var(--space-10) var(--space-4);
  color: var(--text-faint);
  font-size: var(--text-sm);
}
.empty-icon { font-size: 2rem; margin-bottom: var(--space-3); opacity: 0.4; }

/* ===== LOADING ===== */
.spinner {
  width: 16px; height: 16px;
  border: 2px solid var(--border);
  border-top-color: var(--cyan);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  display: inline-block;
  flex-shrink: 0;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ===== CHIP PILLS FOR EXAMPLE FILLS ===== */
.chip-bar { display: flex; flex-wrap: wrap; gap: var(--space-2); margin-top: var(--space-2); }
.chip {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  padding: 3px 10px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  color: var(--text-muted);
  cursor: pointer;
  transition: all var(--transition);
  display: flex;
  align-items: center;
  gap: var(--space-1);
}
.chip:hover { border-color: var(--cyan-dim); color: var(--cyan); background: var(--cyan-glow); }
.chip-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }

/* ===== FOOTER ===== */
.app-footer {
  padding: var(--space-3) var(--space-5);
  border-top: 1px solid var(--border-subtle);
  text-align: center;
  font-size: var(--text-xs);
  color: var(--text-faint);
  background: var(--surface);
  flex-shrink: 0;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 640px) {
  .topbar-status { display: none; }
  .panel-body { padding: var(--space-3); }
  .chat-messages { padding: var(--space-3); }
  .roundtable-transcript { padding: var(--space-3); }
  .route-item { grid-template-columns: 55px 1fr; }
  .route-item .btn-probe { grid-column: 1 / -1; }
}
</style>
</head>
<body>
<div class="shell">

<!-- TOPBAR -->
<header class="topbar">
  <div class="topbar-logo">
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="17" stroke="var(--cyan-dim)" stroke-width="1.5" opacity="0.4"/>
      <circle cx="20" cy="20" r="9" stroke="var(--cyan)" stroke-width="1" stroke-dasharray="3 3" opacity="0.5"/>
      <circle cx="20" cy="20" r="3" fill="var(--cyan)"/>
      <line x1="20" y1="3" x2="20" y2="11" stroke="var(--cyan-dim)" stroke-width="1.2"/>
      <line x1="20" y1="29" x2="20" y2="37" stroke="var(--cyan-dim)" stroke-width="1.2"/>
      <line x1="3" y1="20" x2="11" y2="20" stroke="var(--cyan-dim)" stroke-width="1.2"/>
      <line x1="29" y1="20" x2="37" y2="20" stroke="var(--cyan-dim)" stroke-width="1.2"/>
      <circle cx="7" cy="7" r="2" fill="var(--purple)" opacity="0.7"/>
      <circle cx="33" cy="7" r="2" fill="var(--amber)" opacity="0.7"/>
      <circle cx="7" cy="33" r="2" fill="var(--green)" opacity="0.6"/>
      <circle cx="33" cy="33" r="2" fill="var(--blue)" opacity="0.6"/>
    </svg>
    <div>
      <div class="topbar-logo-text">Constellation Switchboard</div>
      <div class="topbar-logo-sub">soul-os.cc</div>
    </div>
  </div>
  <div class="topbar-status" id="topbar-status">
    <div class="status-pill" onclick="probeAll()" title="soul-os.cc" id="pill-frontend">
      <span class="status-dot checking"></span>
      <span>soul-os.cc</span>
    </div>
    <div class="status-pill" onclick="probeAll()" title="api.soul-os.cc" id="pill-api">
      <span class="status-dot checking"></span>
      <span>api gateway</span>
    </div>
    <div class="status-pill" onclick="probeAll()" title="siddartha" id="pill-siddhartha">
      <span class="status-dot checking"></span>
      <span>siddhartha</span>
    </div>
  </div>
  <div class="topbar-right">
    <button class="btn-sm" onclick="probeAll()">⟳ Pulse</button>
  </div>
</header>

<!-- TABS -->
<nav class="tabs-wrapper" role="tablist">
  <button class="tab-btn active" data-tab="chat" onclick="switchTab('chat')">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
    Chat
  </button>
  <button class="tab-btn" data-tab="roundtable" onclick="switchTab('roundtable')">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
    Roundtable
  </button>
  <button class="tab-btn" data-tab="mailbox" onclick="switchTab('mailbox')">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
    Mailbox
  </button>
  <button class="tab-btn" data-tab="threads" onclick="switchTab('threads')">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
    Threads
  </button>
  <button class="tab-btn" data-tab="graph" onclick="switchTab('graph')">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
    Graph
  </button>
  <button class="tab-btn" data-tab="samsara" onclick="switchTab('samsara')">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/></svg>
    Samsara
  </button>
  <button class="tab-btn" data-tab="dispatch" onclick="switchTab('dispatch')">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
    Raw Dispatch
  </button>
  <button class="tab-btn" data-tab="infra" onclick="switchTab('infra')">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
    Infra
  </button>
</nav>

<!-- CONTENT -->
<div class="content">

  <!-- ===== TAB: CHAT ===== -->
  <div class="tab-panel active" id="panel-chat">
    <div class="chat-layout">
      <div class="chat-messages" id="chat-messages">
        <div class="empty-state" id="chat-empty">
          <div class="empty-icon">✦</div>
          <p>Pick an agent and say something.</p>
          <p style="margin-top:var(--space-2);font-size:var(--text-xs);color:var(--text-faint)">Messages are memory-hydrated via Mem0.</p>
        </div>
      </div>
      <div class="chat-footer">
        <div class="chat-composer">
          <div class="chat-config">
            <span class="chat-config-label">agent:</span>
            <select id="chat-agent" style="width:auto">
              <option value="claude">Rostam (Claude)</option>
              <option value="orion">Orion (GPT-4o)</option>
              <option value="triptych">Triptych (Gemini)</option>
              <option value="mephistopheles">Mephistopheles (DeepSeek)</option>
              <option value="comet">Comet (Perplexity)</option>
            </select>
            <span class="chat-config-label" style="margin-left:var(--space-2)">intent:</span>
            <select id="chat-intent" style="width:auto">
              <option value="route">route</option>
              <option value="reflect">reflect</option>
              <option value="research">research</option>
              <option value="critique">critique</option>
              <option value="create">create</option>
              <option value="memory">memory</option>
            </select>
            <span class="chat-config-label" style="margin-left:var(--space-2)">via:</span>
            <select id="chat-via" style="width:auto">
              <option value="api">api.soul-os.cc</option>
              <option value="siddhartha">siddhartha (direct)</option>
            </select>
          </div>
          <div class="chat-input-row">
            <textarea id="chat-input" placeholder="Drop a thought, meme, question, or paste a link…" rows="1" onkeydown="chatKeydown(event)" oninput="autoResize(this)"></textarea>
            <button class="btn-send" id="chat-send-btn" onclick="sendChat()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ===== TAB: ROUNDTABLE ===== -->
  <div class="tab-panel" id="panel-roundtable">
    <div class="roundtable-layout">
      <div class="roundtable-transcript" id="rt-transcript">
        <div class="empty-state" id="rt-empty">
          <div class="empty-icon">⬡</div>
          <p>Configure agents and a seed, then ignite.</p>
          <p style="margin-top:var(--space-2);font-size:var(--text-xs);color:var(--text-faint)">Comet can't join — it doesn't do round-table (yet).</p>
        </div>
      </div>
      <div class="roundtable-footer">
        <div class="roundtable-config">
          <div class="agent-pills" id="rt-agent-pills">
            <!-- populated by JS -->
          </div>
          <div class="form-row">
            <div class="form-group grow">
              <label class="form-label">seed</label>
              <input type="text" id="rt-seed" placeholder="What should the constellation chew on?" />
            </div>
            <div class="form-group shrink" style="min-width:80px">
              <label class="form-label">rounds</label>
              <input type="number" id="rt-rounds" value="2" min="1" max="10" style="width:80px" />
            </div>
            <div class="form-group shrink" style="min-width:120px">
              <label class="form-label">mode</label>
              <select id="rt-mode">
                <option value="campfire">campfire</option>
                <option value="debate">debate</option>
                <option value="synthesis">synthesis</option>
              </select>
            </div>
            <div class="form-group shrink" style="align-self:flex-end">
              <button class="btn-sm primary" onclick="startRoundtable()">Ignite</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ===== TAB: MAILBOX ===== -->
  <div class="tab-panel" id="panel-mailbox">
    <div class="panel-body">
      <h2 class="section-heading">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
        Agent Mailbox
      </h2>
      <p class="section-sub">KV-backed inter-agent messages. Pull any agent's inbox.</p>

      <div class="card" style="margin-bottom:var(--space-4)">
        <div class="card-body-tight">
          <div class="form-row" style="margin-bottom:0;align-items:flex-end;gap:var(--space-2)">
            <div class="form-group shrink" style="min-width:160px">
              <label class="form-label">pull inbox for</label>
              <select id="mailbox-agent-select">
                <option value="claude">claude</option>
                <option value="orion">orion</option>
                <option value="triptych">triptych</option>
                <option value="mephistopheles">mephistopheles</option>
                <option value="comet">comet</option>
              </select>
            </div>
            <button class="btn-sm" style="align-self:flex-end" onclick="pullMailbox()">Pull</button>
            <button class="btn-sm" style="align-self:flex-end;margin-left:auto" onclick="openSendMessage()">✉ Send Message</button>
          </div>
        </div>
      </div>

      <div class="card" id="mailbox-messages-card" style="display:none">
        <div class="card-header">
          <span id="mailbox-card-title">Inbox</span>
          <button class="btn-sm" onclick="ackAllMailbox()" id="ack-all-btn">Ack All</button>
        </div>
        <div id="mailbox-body">
          <!-- messages -->
        </div>
      </div>

      <!-- Send Message Form -->
      <div class="card" id="send-message-form" style="display:none;margin-top:var(--space-4)">
        <div class="card-header">
          <span>Send Inter-Agent Message</span>
          <button class="btn-sm" onclick="document.getElementById('send-message-form').style.display='none'">✕ Close</button>
        </div>
        <div class="card-body">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">from</label>
              <select id="msg-from">
                <option value="claude">claude</option>
                <option value="orion">orion</option>
                <option value="triptych">triptych</option>
                <option value="mephistopheles">mephistopheles</option>
                <option value="comet">comet</option>
                <option value="harvey">harvey</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">to</label>
              <select id="msg-to">
                <option value="orion">orion</option>
                <option value="claude">claude</option>
                <option value="triptych">triptych</option>
                <option value="mephistopheles">mephistopheles</option>
                <option value="comet">comet</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">intent</label>
              <input type="text" id="msg-intent" placeholder="handoff, review, relay…" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">body</label>
              <textarea id="msg-body-text" rows="3" placeholder="Message body…"></textarea>
            </div>
          </div>
          <div style="display:flex;gap:var(--space-2);justify-content:flex-end;margin-top:var(--space-3)">
            <button class="btn-sm primary" onclick="sendMessage()">Send</button>
          </div>
          <div class="result-box" id="msg-result" style="display:none;margin-top:var(--space-3)"></div>
        </div>
      </div>
    </div>
  </div>

  <!-- ===== TAB: THREADS ===== -->
  <div class="tab-panel" id="panel-threads">
    <div class="panel-body">
      <h2 class="section-heading">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
        Conversation Threads
      </h2>
      <p class="section-sub">D1-persisted threads. Click a thread to view its trace.</p>

      <div style="display:flex;gap:var(--space-2);margin-bottom:var(--space-4);flex-wrap:wrap">
        <button class="btn-sm" onclick="loadThreads()">↻ Refresh</button>
        <button class="btn-sm primary" onclick="openNewThread()">+ New Thread</button>
      </div>

      <!-- new thread form -->
      <div class="card" id="new-thread-form" style="display:none;margin-bottom:var(--space-4)">
        <div class="card-header">
          <span>Open Thread</span>
          <button class="btn-sm" onclick="document.getElementById('new-thread-form').style.display='none'">✕</button>
        </div>
        <div class="card-body">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">thread name (optional)</label>
              <input type="text" id="new-thread-name" placeholder="e.g. Samsara debrief" />
            </div>
          </div>
          <button class="btn-sm primary" onclick="createThread()">Create</button>
          <div class="result-box" id="new-thread-result" style="display:none;margin-top:var(--space-3)"></div>
        </div>
      </div>

      <div class="card" id="threads-card">
        <div class="card-header">
          <span id="threads-card-title">Threads</span>
          <span class="spinner" id="threads-spinner" style="display:none"></span>
        </div>
        <ul class="thread-list" id="thread-list">
          <li style="padding:var(--space-4);text-align:center;color:var(--text-faint);font-size:var(--text-xs)">Click "Refresh" to load threads.</li>
        </ul>
      </div>

      <!-- thread detail -->
      <div class="card" id="thread-detail-card" style="display:none;margin-top:var(--space-4)">
        <div class="card-header">
          <span id="thread-detail-title">Thread</span>
          <button class="btn-sm" onclick="document.getElementById('thread-detail-card').style.display='none'">✕ Close</button>
        </div>
        <div class="card-body" id="thread-detail-body"></div>
      </div>
    </div>
  </div>

  <!-- ===== TAB: GRAPH ===== -->
  <div class="tab-panel" id="panel-graph">
    <div class="panel-body">
      <h2 class="section-heading">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
        Agent Conversation Graph
      </h2>
      <p class="section-sub">Directed edges between agents, weighted by traversal count.</p>

      <div style="display:flex;gap:var(--space-2);margin-bottom:var(--space-4);flex-wrap:wrap;align-items:center">
        <span class="form-label">focus agent:</span>
        <select id="graph-agent-select" style="width:auto" onchange="loadGraph()">
          <option value="">all agents</option>
          <option value="claude">claude</option>
          <option value="orion">orion</option>
          <option value="triptych">triptych</option>
          <option value="mephistopheles">mephistopheles</option>
          <option value="comet">comet</option>
        </select>
        <button class="btn-sm" onclick="loadGraph()">↻ Refresh</button>
      </div>

      <div id="graph-canvas-wrap">
        <canvas id="graph-canvas"></canvas>
        <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:var(--text-faint);font-size:var(--text-xs);text-align:center;pointer-events:none" id="graph-placeholder">
          Click Refresh to load graph data
        </div>
      </div>

      <div class="graph-legend" id="graph-legend">
        <div class="graph-legend-item"><span class="legend-dot" style="background:var(--purple)"></span>claude</div>
        <div class="graph-legend-item"><span class="legend-dot" style="background:var(--blue)"></span>orion</div>
        <div class="graph-legend-item"><span class="legend-dot" style="background:var(--amber)"></span>triptych</div>
        <div class="graph-legend-item"><span class="legend-dot" style="background:var(--red)"></span>mephistopheles</div>
        <div class="graph-legend-item"><span class="legend-dot" style="background:var(--cyan)"></span>comet</div>
      </div>

      <div class="card" style="margin-top:var(--space-4)">
        <div class="card-header">Agent State Snapshots</div>
        <div id="agent-state-body" class="card-body">
          <button class="btn-sm" onclick="loadAgentState()">Load Agent States</button>
        </div>
      </div>
    </div>
  </div>

  <!-- ===== TAB: SAMSARA ===== -->
  <div class="tab-panel" id="panel-samsara">
    <div class="panel-body">
      <h2 class="section-heading">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/></svg>
        Samsara — PvE Debate Engine
      </h2>
      <p class="section-sub">Structured philosophical debate. Protagonist vs antagonist LLMs via MindBridge routing.</p>

      <!-- Cast -->
      <div class="card" style="margin-bottom:var(--space-4)">
        <div class="card-header">Cast</div>
        <div class="card-body" style="padding-top:var(--space-3)">
          <div class="samsara-cast" id="samsara-cast">
            <!-- populated by JS -->
          </div>
        </div>
      </div>

      <!-- Configure debate -->
      <div class="card" style="margin-bottom:var(--space-4)">
        <div class="card-header">Configure Debate</div>
        <div class="card-body">
          <div class="form-row">
            <div class="form-group grow">
              <label class="form-label">paper title</label>
              <input type="text" id="debate-title" placeholder="e.g. The Pudgala and the Problem of Personal Identity" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group grow">
              <label class="form-label">thesis</label>
              <textarea id="debate-thesis" rows="2" placeholder="e.g. The pudgalavādin account of personal identity is defensible against both reductionist and nihilist objections…"></textarea>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">seed question (optional)</label>
              <input type="text" id="debate-seed" placeholder="e.g. What constitutes the basis for ethical continuity without a substantial self?" />
            </div>
            <div class="form-group shrink" style="min-width:80px">
              <label class="form-label">rounds</label>
              <input type="number" id="debate-rounds" value="1" min="1" max="5" style="width:80px" />
            </div>
          </div>
          <div style="margin-bottom:var(--space-3)">
            <div class="form-label" style="margin-bottom:var(--space-2)">mode</div>
            <div class="mode-chips" id="mode-chips">
              <div class="mode-chip selected" data-mode="structured_test" onclick="selectMode(this)">structured_test</div>
              <div class="mode-chip" data-mode="prosecution" onclick="selectMode(this)">prosecution</div>
              <div class="mode-chip" data-mode="roundtable" onclick="selectMode(this)">roundtable</div>
              <div class="mode-chip" data-mode="stress_test" onclick="selectMode(this)">stress_test</div>
            </div>
          </div>
          <div style="display:flex;gap:var(--space-2);align-items:center;flex-wrap:wrap">
            <button class="btn-sm primary" onclick="startDebate()">Run Debate</button>
            <label style="display:flex;align-items:center;gap:var(--space-2);font-size:var(--text-xs);color:var(--text-muted);cursor:pointer">
              <input type="checkbox" id="debate-reasoning" checked style="width:auto;cursor:pointer" />
              include_reasoning
            </label>
            <div class="spinner" id="debate-spinner" style="display:none"></div>
          </div>
          <div style="margin-top:var(--space-3);font-size:var(--text-xs);color:var(--text-faint);font-family:var(--font-mono)">
            MindBridge endpoint: <input type="text" id="mindbridge-url" placeholder="https://your-mindbridge.railway.app" style="display:inline-block;width:auto;min-width:280px;font-size:var(--text-xs);padding:2px 8px;margin-left:var(--space-2)" />
          </div>
        </div>
      </div>

      <!-- Debate transcript -->
      <div class="card" id="debate-result-card" style="display:none">
        <div class="card-header" id="debate-result-header">Transcript</div>
        <div id="debate-transcript-body">
          <!-- turns -->
        </div>
      </div>
    </div>
  </div>

  <!-- ===== TAB: DISPATCH ===== -->
  <div class="tab-panel" id="panel-dispatch">
    <div class="panel-body dispatch-layout">
      <h2 class="section-heading">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        Raw Dispatch
      </h2>
      <p class="section-sub">Craft and fire any request without writing curl. No JSON muscle memory required.</p>

      <div class="card" style="margin-bottom:var(--space-4)">
        <div class="card-body">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">endpoint</label>
              <select id="disp-endpoint" onchange="updateDispatchExample()">
                <option value="route">POST /api/route</option>
                <option value="dispatch">POST /dispatch</option>
                <option value="message">POST /message</option>
                <option value="chain">POST /chain</option>
                <option value="parietal">POST /parietal</option>
                <option value="converse">POST /converse</option>
                <option value="log">POST /log</option>
                <option value="chat">POST /v1/chat/completions</option>
                <option value="thread">POST /thread</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">target</label>
              <select id="disp-target">
                <option value="api">api.soul-os.cc</option>
                <option value="siddhartha">siddhartha (direct)</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">body (JSON)</label>
              <textarea id="disp-body" class="dispatch-body-area" rows="6" placeholder='{"userRequest":"@claude:route Hello"}'></textarea>
            </div>
          </div>
          <div class="chip-bar" id="disp-chips"><!-- populated --></div>
          <div style="display:flex;gap:var(--space-2);margin-top:var(--space-3)">
            <button class="btn-sm primary" onclick="fireDispatch()">Fire</button>
            <button class="btn-sm" onclick="clearDispatch()">Clear</button>
          </div>
        </div>
      </div>

      <div class="card" id="dispatch-result-card" style="display:none">
        <div class="card-header">
          <span id="dispatch-result-status" class="result-status">Response</span>
        </div>
        <div class="card-body" style="padding-top:0">
          <div class="result-box" id="dispatch-result-body"></div>
        </div>
      </div>
    </div>
  </div>

  <!-- ===== TAB: INFRA ===== -->
  <div class="tab-panel" id="panel-infra">
    <div class="panel-body">
      <h2 class="section-heading">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
        Infrastructure
      </h2>
      <p class="section-sub">Topology, route map, agents, and waypoints.</p>

      <!-- topology -->
      <div class="topo-grid" id="topo-grid">
        <div class="node-card" data-node="frontend">
          <div class="node-name"><span class="node-badge badge-cyan">UI</span>Cognitive Runtime</div>
          <div class="node-url">soul-os.cc</div>
          <div class="node-desc">Hono-based chat UI. D1-backed persistence. Binds API + AI + DB.</div>
          <div class="node-status" id="infra-status-frontend"><span class="status-dot checking"></span><span>checking…</span></div>
        </div>
        <div class="node-card" data-node="api">
          <div class="node-name"><span class="node-badge badge-amber">GW</span>API Gateway</div>
          <div class="node-url">api.soul-os.cc</div>
          <div class="node-desc">v2.0 proxy gateway. Zero-latency worker-to-worker binding to Siddhartha. CORS-enabled.</div>
          <div class="node-status" id="infra-status-api"><span class="status-dot checking"></span><span>checking…</span></div>
        </div>
        <div class="node-card" data-node="siddhartha">
          <div class="node-name"><span class="node-badge badge-purple">BE</span>Siddhartha</div>
          <div class="node-url">siddartha.harveytagalicud7.workers.dev</div>
          <div class="node-desc">Central Omnibus Router v4. Mem0 hydration, inter-agent messaging, D1 graph, Campfire, Parietal overlay.</div>
          <div class="node-status" id="infra-status-siddhartha"><span class="status-dot checking"></span><span>checking…</span></div>
        </div>
        <div class="node-card" data-node="comet">
          <div class="node-name"><span class="node-badge badge-blue">SVC</span>Comet Courier</div>
          <div class="node-url">comet-courier (internal binding)</div>
          <div class="node-desc">Perplexity sonar-pro search agent. Returns citations. Authenticated via COMET_SECRET.</div>
          <div class="node-status"><span class="status-dot online"></span><span style="color:var(--green)">bound</span></div>
        </div>
      </div>

      <!-- route map -->
      <h3 class="section-heading" style="margin-top:var(--space-6)">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
        Route Map
      </h3>
      <div id="infra-route-map"></div>

      <!-- agents -->
      <h3 class="section-heading" style="margin-top:var(--space-6)">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
        Constellation Agents
      </h3>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:var(--space-3);margin-bottom:var(--space-6)">
        <div class="cast-card"><div class="cast-name" style="color:var(--purple)">Claude · Rostam</div><div class="cast-role">Gnostic Architect</div><div class="cast-provider">claude-sonnet-4-*</div></div>
        <div class="cast-card"><div class="cast-name" style="color:var(--blue)">Orion</div><div class="cast-role">Foundry Keep</div><div class="cast-provider">gpt-4o</div></div>
        <div class="cast-card"><div class="cast-name" style="color:var(--amber)">Triptych</div><div class="cast-role">Commedia dell'Agente</div><div class="cast-provider">gemini-2.0-flash</div></div>
        <div class="cast-card"><div class="cast-name" style="color:var(--red)">Mephistopheles</div><div class="cast-role">Adversarial Reasoner</div><div class="cast-provider">deepseek-reasoner</div></div>
        <div class="cast-card"><div class="cast-name" style="color:var(--cyan)">Comet</div><div class="cast-role">The Courier</div><div class="cast-provider">perplexity sonar-pro</div></div>
      </div>

      <!-- waypoints -->
      <h3 class="section-heading">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
        Waypoints
      </h3>
      <div class="card">
        <div id="waypoints-body" style="padding:var(--space-3) var(--space-4);font-size:var(--text-xs);color:var(--text-muted)">
          <button class="btn-sm" onclick="loadWaypoints()">Load Waypoints</button>
        </div>
      </div>
    </div>
  </div>

</div><!-- /content -->

<footer class="app-footer">
  soul-os constellation switchboard v2 &nbsp;·&nbsp;
  <a href="https://github.com/harbz07/soul-os" target="_blank" rel="noopener noreferrer">github</a>
</footer>
</div><!-- /shell -->

<script>
// ===================================================================
// CONFIG
// ===================================================================
const API = {
  frontend:   'https://soul-os.cc',
  api:        'https://api.soul-os.cc',
  siddhartha: 'https://siddartha.harveytagalicud7.workers.dev',
};

const AGENT_META = {
  claude:           { label: 'Rostam',        color: 'var(--purple)', bg: 'var(--purple-dim)', abbr: 'RS' },
  orion:            { label: 'Orion',          color: 'var(--blue)',   bg: 'var(--blue-dim)',   abbr: 'OR' },
  triptych:         { label: 'Triptych',       color: 'var(--amber)',  bg: 'var(--amber-dim)',  abbr: 'TR' },
  mephistopheles:   { label: 'Mephisto',       color: 'var(--red)',    bg: 'var(--red-dim)',    abbr: 'ME' },
  comet:            { label: 'Comet',          color: 'var(--cyan)',   bg: 'var(--cyan-glow)',  abbr: 'CO' },
};

const SAMSARA_CAST = [
  { key: 'pudgalavadin', label: 'Pudgalavādin', role: 'protagonist', provider: 'anthropic · claude-opus-4-5', oneliner: 'The person is real — neither identical to nor different from the aggregates.' },
  { key: 'vasubandhu',   label: 'Vasubandhu',   role: 'antagonist',  provider: 'deepseek · deepseek-reasoner', oneliner: 'The aggregates are all there is. Self is a convenient designation, nothing more.' },
  { key: 'nagarjuna',    label: 'Nāgārjuna',    role: 'antagonist',  provider: 'anthropic · claude-sonnet-4-20250514', oneliner: 'Even the aggregates lack svabhāva. Śūnyatā undermines every foundation.' },
  { key: 'siderits',     label: 'Siderits',     role: 'antagonist',  provider: 'openai · gpt-4o', oneliner: 'Buddhist reductionism collapses into eliminativism without ethical rescue.' },
  { key: 'santideva',    label: 'Śāntideva',    role: 'antagonist',  provider: 'google · gemini-2.0-flash', oneliner: 'Only the non-self view grounds genuine bodhicitta and moral transformation.' },
  { key: 'carpenter',    label: 'Carpenter',    role: 'commentator', provider: 'openai · gpt-4o', oneliner: 'The synecdochal reading of pudgala may preserve person-talk without commitment.' },
];

const ROUTES = {
  api: [
    { method: 'GET',  path: '/',                    desc: 'Gateway manifest' },
    { method: 'GET',  path: '/health',              desc: 'Gateway + Siddhartha health' },
    { method: 'GET',  path: '/waypoints',           desc: 'Waypoint registry' },
    { method: 'POST', path: '/v1/chat/completions', desc: 'OpenAI-compatible chat' },
    { method: 'POST', path: '/api/route',           desc: 'Mem0-hydrated agent call' },
    { method: 'POST', path: '/dispatch',            desc: 'Passage → Notion / Discord' },
    { method: 'POST', path: '/message',             desc: 'Inter-agent message' },
    { method: 'POST', path: '/chain',               desc: 'Multi-hop chain' },
    { method: 'POST', path: '/parietal',            desc: 'Semantic gravity / overlay' },
    { method: 'POST', path: '/converse',            desc: 'Campfire round-table' },
    { method: 'POST', path: '/log',                 desc: 'Atlas session log' },
    { method: 'POST', path: '/thread',              desc: 'Open / name a D1 thread' },
    { method: 'GET',  path: '/threads',             desc: 'List all threads' },
    { method: 'GET',  path: '/thread/:id',          desc: 'Thread + traces' },
    { method: 'GET',  path: '/thread/:id/graph',    desc: 'Thread edge list' },
    { method: 'GET',  path: '/graph/:agent',        desc: 'Agent graph across threads' },
    { method: 'GET',  path: '/sessions',            desc: 'Recent sessions' },
    { method: 'GET',  path: '/agents/state',        desc: 'All agent state snapshots' },
  ],
  mailbox: [
    { method: 'GET',    path: '/mailbox/:agent',        desc: 'Pull messages' },
    { method: 'POST',   path: '/mailbox/:agent/ack',    desc: 'Acknowledge message' },
    { method: 'POST',   path: '/mailbox/:agent/clear',  desc: 'Clear inbox' },
    { method: 'POST',   path: '/reply',                 desc: 'Reply to message' },
  ],
};

// ===================================================================
// TAB SWITCHING
// ===================================================================
function switchTab(id) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === id));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.toggle('active', p.id === 'panel-' + id));
}

// ===================================================================
// STATUS PROBING
// ===================================================================
async function probeAll() {
  const checks = [
    { key: 'frontend',   url: API.frontend   + '/api/health', pillId: 'pill-frontend',   infraId: 'infra-status-frontend' },
    { key: 'api',        url: API.api        + '/health',     pillId: 'pill-api',        infraId: 'infra-status-api' },
    { key: 'siddhartha', url: API.siddhartha + '/health',     pillId: 'pill-siddhartha', infraId: 'infra-status-siddhartha' },
  ];

  checks.forEach(c => {
    const pill = document.getElementById(c.pillId);
    const infra = document.getElementById(c.infraId);
    if (pill) pill.innerHTML = '<span class="status-dot checking"></span><span>' + c.key + '</span>';
    if (infra) infra.innerHTML = '<span class="status-dot checking"></span><span>checking…</span>';
  });

  await Promise.all(checks.map(async c => {
    const pill  = document.getElementById(c.pillId);
    const infra = document.getElementById(c.infraId);
    try {
      const t0  = performance.now();
      const res = await fetch(c.url, { signal: AbortSignal.timeout(8000) });
      const ms  = Math.round(performance.now() - t0);
      const ok  = res.ok;
      if (pill)  pill.innerHTML  = '<span class="status-dot ' + (ok?'online':'offline') + '"></span><span style="color:var(--' + (ok?'green':'red') + ')">' + (ok ? ms+'ms' : res.status) + '</span>';
      if (infra) infra.innerHTML = '<span class="status-dot ' + (ok?'online':'offline') + '"></span><span style="color:var(--' + (ok?'green':'red') + ')">' + (ok ? ms+'ms' : res.status) + '</span>';
    } catch {
      if (pill)  pill.innerHTML  = '<span class="status-dot offline"></span><span style="color:var(--red)">unreachable</span>';
      if (infra) infra.innerHTML = '<span class="status-dot offline"></span><span style="color:var(--red)">unreachable</span>';
    }
  }));
}

// ===================================================================
// CHAT
// ===================================================================
let chatHistory = [];

function agentColor(name) { return (AGENT_META[name] || {}).color || 'var(--text)'; }
function agentAbbr(name)  { return (AGENT_META[name] || {}).abbr  || name.slice(0,2).toUpperCase(); }
function agentLabel(name) { return (AGENT_META[name] || {}).label || name; }

function autoResize(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 160) + 'px';
}

function chatKeydown(e) {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChat(); }
}

function appendChatMsg(role, agentName, text, meta) {
  const container = document.getElementById('chat-messages');
  const empty     = document.getElementById('chat-empty');
  if (empty) empty.remove();

  const color  = agentColor(agentName);
  const abbr   = agentAbbr(agentName);
  const label  = role === 'user' ? 'you' : agentLabel(agentName);

  const div = document.createElement('div');
  div.className = 'msg ' + role;
  div.innerHTML =
    '<div class="msg-avatar" style="background:' + (role==='user'?'var(--surface-3)':'var(--surface)') + ';color:' + color + ';border:1px solid var(--border-subtle)">' + abbr + '</div>' +
    '<div class="msg-body">' +
      '<div class="msg-agent">' + escHtml(label) + (meta ? ' <span style="color:var(--text-faint)">· '+escHtml(meta)+'</span>' : '') + '</div>' +
      '<div class="msg-bubble">' + escHtml(text) + '</div>' +
      '<div class="msg-meta">' + new Date().toLocaleTimeString() + '</div>' +
    '</div>';
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
  return div;
}

function appendThinking(agentName) {
  const container = document.getElementById('chat-messages');
  const div = document.createElement('div');
  div.className = 'msg assistant';
  div.id = 'thinking-bubble';
  div.innerHTML =
    '<div class="msg-avatar" style="background:var(--surface);color:' + agentColor(agentName) + ';border:1px solid var(--border-subtle)">' + agentAbbr(agentName) + '</div>' +
    '<div class="msg-body">' +
      '<div class="msg-agent">' + escHtml(agentLabel(agentName)) + '</div>' +
      '<div class="msg-bubble thinking"><div class="thinking-dots"><span></span><span></span><span></span></div></div>' +
    '</div>';
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
  return div;
}

async function sendChat() {
  const input  = document.getElementById('chat-input');
  const agent  = document.getElementById('chat-agent').value;
  const intent = document.getElementById('chat-intent').value;
  const via    = document.getElementById('chat-via').value;
  const text   = input.value.trim();
  if (!text) return;

  input.value = '';
  input.style.height = 'auto';
  document.getElementById('chat-send-btn').disabled = true;

  appendChatMsg('user', 'harvey', text, agent + ':' + intent);
  chatHistory.push({ role: 'user', content: text });

  const thinking = appendThinking(agent);
  const baseUrl  = via === 'api' ? API.api : API.siddhartha;

  try {
    const body = { userRequest: '@' + agent + ':' + intent + ' ' + text };
    const res  = await fetch(baseUrl + '/api/route', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    thinking.remove();

    const reply = data.response || data.content || data.reply || data.message || JSON.stringify(data, null, 2);
    const metaStr = data.model ? data.model : '';
    appendChatMsg('assistant', agent, reply, metaStr);
    chatHistory.push({ role: 'assistant', content: reply, agent });
  } catch (e) {
    thinking.remove();
    appendChatMsg('assistant', agent, 'Error: ' + e.message, '');
  }

  document.getElementById('chat-send-btn').disabled = false;
  input.focus();
}

// ===================================================================
// ROUNDTABLE
// ===================================================================
let rtSelectedAgents = ['claude', 'orion', 'triptych'];

function initRTPills() {
  const container = document.getElementById('rt-agent-pills');
  const available = ['claude','orion','triptych','mephistopheles'];
  container.innerHTML = available.map(a => {
    const m = AGENT_META[a];
    const sel = rtSelectedAgents.includes(a);
    return '<div class="agent-pill ' + (sel?'selected':'') + '" data-agent="' + a + '" ' +
      'style="color:'+m.color+';border-color:'+(sel?m.color:'var(--border)')+';background:'+(sel?m.bg:'transparent')+'" ' +
      'onclick="toggleRTAgent(this)">' +
      '<span class="dot" style="background:'+m.color+'"></span>' + escHtml(m.label) + '</div>';
  }).join('');
}

function toggleRTAgent(el) {
  const agent = el.dataset.agent;
  const m     = AGENT_META[agent];
  if (rtSelectedAgents.includes(agent)) {
    if (rtSelectedAgents.length <= 2) return;
    rtSelectedAgents = rtSelectedAgents.filter(a => a !== agent);
    el.classList.remove('selected');
    el.style.borderColor = 'var(--border)';
    el.style.background  = 'transparent';
  } else {
    rtSelectedAgents.push(agent);
    el.classList.add('selected');
    el.style.borderColor = m.color;
    el.style.background  = m.bg;
  }
}

async function startRoundtable() {
  const seed   = document.getElementById('rt-seed').value.trim();
  const rounds = parseInt(document.getElementById('rt-rounds').value) || 2;
  const mode   = document.getElementById('rt-mode').value;
  if (!seed) { alert('Enter a seed topic.'); return; }

  const transcript = document.getElementById('rt-transcript');
  const empty      = document.getElementById('rt-empty');
  if (empty) empty.remove();

  transcript.innerHTML = '<div style="padding:var(--space-4);text-align:center"><span class="spinner"></span> <span style="color:var(--text-muted);font-size:var(--text-xs);font-family:var(--font-mono)">Igniting roundtable…</span></div>';

  const body = {
    agents:  rtSelectedAgents,
    seed,
    rounds,
    mode,
    initiative: 'contextual_weighted_each_round',
  };

  try {
    const res  = await fetch(API.api + '/converse', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(body),
    });
    const data = await res.json();
    transcript.innerHTML = '';

    if (data.transcript && Array.isArray(data.transcript)) {
      data.transcript.forEach(turn => {
        const m   = AGENT_META[turn.agent] || {};
        const div = document.createElement('div');
        div.className = 'rt-turn';
        div.innerHTML =
          '<div class="rt-avatar" style="background:var(--surface);color:'+(m.color||'var(--text)')+';border:1px solid var(--border-subtle)">'+(m.abbr||turn.agent.slice(0,2).toUpperCase())+'</div>' +
          '<div class="rt-body">' +
            '<div class="rt-header">' +
              '<span style="color:'+(m.color||'var(--text)')+'">'+escHtml(m.label||turn.agent)+'</span>' +
              '<span class="rt-round-badge">round '+turn.round+'</span>' +
              (turn.model ? '<span style="color:var(--text-faint)">'+escHtml(turn.model)+'</span>' : '') +
            '</div>' +
            '<div class="rt-text">'+escHtml(turn.response||turn.text||'')+'</div>' +
          '</div>';
        transcript.appendChild(div);
      });
    } else {
      const pre = document.createElement('pre');
      pre.style.cssText = 'padding:var(--space-4);font-size:var(--text-xs);font-family:var(--font-mono);color:var(--text-muted);white-space:pre-wrap';
      pre.textContent = JSON.stringify(data, null, 2);
      transcript.appendChild(pre);
    }
    transcript.scrollTop = transcript.scrollHeight;
  } catch (e) {
    transcript.innerHTML = '<div style="padding:var(--space-4);color:var(--red);font-size:var(--text-xs);font-family:var(--font-mono)">Error: ' + escHtml(e.message) + '</div>';
  }
}

// ===================================================================
// MAILBOX
// ===================================================================
async function pullMailbox() {
  const agent = document.getElementById('mailbox-agent-select').value;
  const card  = document.getElementById('mailbox-messages-card');
  const body  = document.getElementById('mailbox-body');
  const title = document.getElementById('mailbox-card-title');

  card.style.display = 'block';
  title.textContent  = 'Inbox: ' + agent;
  body.innerHTML     = '<div style="padding:var(--space-4);text-align:center"><span class="spinner"></span></div>';

  try {
    const res  = await fetch(API.siddhartha + '/mailbox/' + agent);
    const data = await res.json();
    const msgs = data.messages || data || [];

    if (!msgs.length) {
      body.innerHTML = '<div style="padding:var(--space-4);text-align:center;color:var(--text-faint);font-size:var(--text-xs)">Inbox empty.</div>';
      return;
    }

    body.innerHTML = msgs.map(m =>
      '<div class="mailbox-msg">' +
        '<div class="mailbox-msg-header">' +
          (m.read === false ? '<span class="unread-dot"></span>' : '') +
          '<span class="mailbox-from">' + escHtml(m.from||'?') + '</span>' +
          ' → <span>' + escHtml(m.to||agent) + '</span>' +
          '<span class="mailbox-intent">' + escHtml(m.intent||'') + '</span>' +
          '<span class="mailbox-ts">' + (m.timestamp ? new Date(m.timestamp).toLocaleString() : '') + '</span>' +
        '</div>' +
        '<div class="mailbox-body-text">' + escHtml(typeof m.body === 'object' ? JSON.stringify(m.body) : (m.body||'')) + '</div>' +
        (m.msg_id ? '<div style="font-size:10px;font-family:var(--font-mono);color:var(--text-faint);margin-top:4px">' + escHtml(m.msg_id) + '</div>' : '') +
      '</div>'
    ).join('');
  } catch (e) {
    body.innerHTML = '<div style="padding:var(--space-4);color:var(--red);font-size:var(--text-xs);font-family:var(--font-mono)">Error: ' + escHtml(e.message) + '</div>';
  }
}

function openSendMessage() {
  document.getElementById('send-message-form').style.display = 'block';
  document.getElementById('send-message-form').scrollIntoView({ behavior: 'smooth' });
}

async function sendMessage() {
  const from   = document.getElementById('msg-from').value;
  const to     = document.getElementById('msg-to').value;
  const intent = document.getElementById('msg-intent').value.trim() || 'handoff';
  const body   = document.getElementById('msg-body-text').value.trim();
  const res_el = document.getElementById('msg-result');

  if (!body) { alert('Enter a message body.'); return; }

  res_el.style.display = 'block';
  res_el.textContent   = 'Sending…';

  try {
    const res  = await fetch(API.api + '/message', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ from, to, intent, body }),
    });
    const data = await res.json();
    res_el.textContent = JSON.stringify(data, null, 2);
  } catch (e) {
    res_el.textContent = 'Error: ' + e.message;
  }
}

async function ackAllMailbox() {
  const agent = document.getElementById('mailbox-agent-select').value;
  try {
    await fetch(API.siddhartha + '/mailbox/' + agent + '/ack', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
    pullMailbox();
  } catch (e) { alert('Ack failed: ' + e.message); }
}

// ===================================================================
// THREADS
// ===================================================================
function openNewThread() {
  const f = document.getElementById('new-thread-form');
  f.style.display = f.style.display === 'none' ? 'block' : 'none';
}

async function loadThreads() {
  const list    = document.getElementById('thread-list');
  const spinner = document.getElementById('threads-spinner');
  const title   = document.getElementById('threads-card-title');
  spinner.style.display = 'inline-block';

  try {
    const res  = await fetch(API.siddhartha + '/threads');
    const data = await res.json();
    const threads = data.threads || data || [];
    title.textContent = 'Threads (' + threads.length + ')';
    spinner.style.display = 'none';

    if (!threads.length) {
      list.innerHTML = '<li style="padding:var(--space-4);text-align:center;color:var(--text-faint);font-size:var(--text-xs)">No threads yet.</li>';
      return;
    }

    list.innerHTML = threads.map(t =>
      '<li class="thread-item" onclick="loadThreadDetail(\'' + escAttr(t.id||t.thread_id) + '\')">' +
        '<div class="thread-id">' + escHtml((t.id||t.thread_id||'').slice(0,20)) + '…</div>' +
        '<div class="thread-info">' +
          '<div class="thread-name">' + escHtml(t.name || 'Unnamed thread') + '</div>' +
          '<div class="thread-participants">' + escHtml(t.participants || '') + '</div>' +
        '</div>' +
        '<div class="thread-badge">' + escHtml(t.status || 'open') + '</div>' +
      '</li>'
    ).join('');
  } catch (e) {
    spinner.style.display = 'none';
    list.innerHTML = '<li style="padding:var(--space-4);color:var(--red);font-size:var(--text-xs);font-family:var(--font-mono)">Error: ' + escHtml(e.message) + '</li>';
  }
}

async function loadThreadDetail(id) {
  const card  = document.getElementById('thread-detail-card');
  const title = document.getElementById('thread-detail-title');
  const body  = document.getElementById('thread-detail-body');
  card.style.display = 'block';
  title.textContent  = 'Thread: ' + id.slice(0,16) + '…';
  body.innerHTML     = '<span class="spinner"></span>';
  card.scrollIntoView({ behavior: 'smooth' });

  try {
    const res  = await fetch(API.siddhartha + '/thread/' + id);
    const data = await res.json();

    let html = '<div style="font-family:var(--font-mono);font-size:var(--text-xs);color:var(--text-muted);margin-bottom:var(--space-3)">' +
      'id: ' + escHtml(data.id||id) + ' · status: ' + escHtml(data.status||'?') + ' · turns: ' + (data.turn_count||0) +
      '</div>';

    const traces = data.traces || [];
    if (traces.length) {
      html += '<div style="margin-bottom:var(--space-2);font-size:var(--text-xs);font-family:var(--font-mono);color:var(--text-faint)">' + traces.length + ' traces</div>';
      traces.forEach(tr => {
        const m = AGENT_META[tr.agent] || {};
        html +=
          '<div style="padding:var(--space-2) 0;border-bottom:1px solid var(--border-subtle)">' +
            '<div style="display:flex;gap:var(--space-2);font-family:var(--font-mono);font-size:var(--text-xs);color:var(--text-muted);margin-bottom:4px">' +
              '<span style="color:'+(m.color||'var(--text)')+'">'+escHtml(tr.agent||'?')+'</span>' +
              '<span>round '+tr.round+'</span>' +
              (tr.model ? '<span style="color:var(--text-faint)">'+escHtml(tr.model)+'</span>' : '') +
            '</div>' +
            '<div style="font-size:var(--text-xs);color:var(--text-muted);line-height:1.6;white-space:pre-wrap">' + escHtml((tr.response||'').slice(0,400)) + (tr.response && tr.response.length > 400 ? '…' : '') + '</div>' +
          '</div>';
      });
    } else {
      html += '<div style="color:var(--text-faint);font-size:var(--text-xs)">No traces yet.</div>';
    }

    body.innerHTML = html;
  } catch (e) {
    body.innerHTML = '<span style="color:var(--red);font-size:var(--text-xs);font-family:var(--font-mono)">Error: ' + escHtml(e.message) + '</span>';
  }
}

async function createThread() {
  const name   = document.getElementById('new-thread-name').value.trim();
  const res_el = document.getElementById('new-thread-result');
  res_el.style.display = 'block';
  res_el.textContent   = 'Creating…';
  try {
    const res  = await fetch(API.siddhartha + '/thread', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ name: name || undefined }),
    });
    const data = await res.json();
    res_el.textContent = JSON.stringify(data, null, 2);
    loadThreads();
  } catch (e) {
    res_el.textContent = 'Error: ' + e.message;
  }
}

// ===================================================================
// GRAPH
// ===================================================================
let graphData = null;

async function loadGraph() {
  const agentSel = document.getElementById('graph-agent-select').value;
  const ph       = document.getElementById('graph-placeholder');
  ph.textContent = 'Loading…';

  const url = agentSel
    ? API.siddhartha + '/graph/' + agentSel
    : API.siddhartha + '/agents/state';

  try {
    const res  = await fetch(url);
    graphData  = await res.json();
    ph.style.display = 'none';
    drawGraph(graphData, agentSel);
  } catch (e) {
    ph.textContent = 'Error: ' + e.message;
  }
}

function drawGraph(data, focusAgent) {
  const canvas  = document.getElementById('graph-canvas');
  const ctx     = canvas.getContext('2d');
  const wrap    = document.getElementById('graph-canvas-wrap');
  canvas.width  = wrap.clientWidth;
  canvas.height = 420;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Build node + edge sets from response
  const nodeMap = {};
  const edges   = [];

  // edges might be under data.edges or data.graph or top-level array
  const rawEdges = data.edges || data.graph || (Array.isArray(data) ? data : []);

  rawEdges.forEach(e => {
    const from = e.from_agent || e.from || e.source;
    const to   = e.to_agent   || e.to   || e.target;
    if (from && to) {
      nodeMap[from] = true;
      nodeMap[to]   = true;
      edges.push({ from, to, weight: e.weight || e.count || 1, intent: e.intent || '' });
    }
  });

  // also add agents from state
  const agents = Object.keys(AGENT_META);
  agents.forEach(a => { nodeMap[a] = true; });

  const nodes = Object.keys(nodeMap);
  const total = nodes.length;
  const cx    = canvas.width / 2;
  const cy    = canvas.height / 2;
  const r     = Math.min(cx, cy) - 60;

  const pos = {};
  nodes.forEach((n, i) => {
    const angle = (i / total) * 2 * Math.PI - Math.PI / 2;
    pos[n] = { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  });

  // Draw edges
  edges.forEach(e => {
    const from = pos[e.from];
    const to   = pos[e.to];
    if (!from || !to) return;
    const meta = AGENT_META[e.from] || {};
    const w    = Math.min(1 + e.weight * 0.5, 4);

    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.strokeStyle = (meta.color || 'var(--border)').replace('var(--', '').replace(')', '');

    // resolve CSS vars manually
    const colorMap = {
      purple: '#a78bfa', blue: '#60a5fa', amber: '#f59e0b',
      red: '#f87171', cyan: '#4fd1c5', green: '#34d399',
      border: '#252d3f',
    };
    ctx.strokeStyle = colorMap[Object.keys(colorMap).find(k => (meta.color||'').includes(k))] || '#252d3f';
    ctx.globalAlpha = 0.5;
    ctx.lineWidth   = w;
    ctx.stroke();
    ctx.globalAlpha = 1;

    // arrowhead
    const dx   = to.x - from.x;
    const dy   = to.y - from.y;
    const len  = Math.sqrt(dx*dx + dy*dy);
    const nx   = dx/len;
    const ny   = dy/len;
    const nr   = 16; // node radius offset
    const ax   = to.x - nx*nr;
    const ay   = to.y - ny*nr;
    const aw   = 6;
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(ax - nx*8 - ny*aw, ay - ny*8 + nx*aw);
    ctx.lineTo(ax - nx*8 + ny*aw, ay - ny*8 - nx*aw);
    ctx.closePath();
    ctx.fillStyle = ctx.strokeStyle;
    ctx.globalAlpha = 0.6;
    ctx.fill();
    ctx.globalAlpha = 1;
  });

  // Draw nodes
  nodes.forEach(n => {
    const p    = pos[n];
    const meta = AGENT_META[n] || {};
    const colorMap = {
      purple: '#a78bfa', blue: '#60a5fa', amber: '#f59e0b',
      red: '#f87171', cyan: '#4fd1c5', green: '#34d399',
    };
    const col  = colorMap[Object.keys(colorMap).find(k => (meta.color||'').includes(k))] || '#404858';
    const isFocus = n === focusAgent;

    ctx.beginPath();
    ctx.arc(p.x, p.y, isFocus ? 18 : 13, 0, 2 * Math.PI);
    ctx.fillStyle = '#111520';
    ctx.fill();
    ctx.strokeStyle = col;
    ctx.lineWidth   = isFocus ? 2.5 : 1.5;
    ctx.stroke();

    ctx.fillStyle   = col;
    ctx.font        = 'bold 9px "JetBrains Mono", monospace';
    ctx.textAlign   = 'center';
    ctx.textBaseline= 'middle';
    ctx.fillText((meta.abbr || n.slice(0,2).toUpperCase()), p.x, p.y);

    ctx.fillStyle   = '#6b7280';
    ctx.font        = '10px "General Sans", sans-serif';
    ctx.fillText(meta.label || n, p.x, p.y + (isFocus ? 28 : 24));
  });
}

async function loadAgentState() {
  const body = document.getElementById('agent-state-body');
  body.innerHTML = '<span class="spinner"></span>';
  try {
    const res  = await fetch(API.siddhartha + '/agents/state');
    const data = await res.json();
    const states = data.agents || data || [];
    if (!states.length) { body.innerHTML = '<div style="color:var(--text-faint);font-size:var(--text-xs)">No agent state data yet.</div>'; return; }
    body.innerHTML = '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:var(--space-3)">' +
      states.map(s => {
        const m = AGENT_META[s.agent] || {};
        return '<div style="background:var(--surface-2);border:1px solid var(--border-subtle);border-radius:var(--radius-md);padding:var(--space-3)">' +
          '<div style="font-weight:600;color:'+(m.color||'var(--text)')+';margin-bottom:4px">' + escHtml(m.label||s.agent) + '</div>' +
          '<div style="font-family:var(--font-mono);font-size:var(--text-xs);color:var(--text-faint)">turns: ' + (s.lifetime_turns||0) + '</div>' +
          '<div style="font-family:var(--font-mono);font-size:var(--text-xs);color:var(--text-faint)">last: ' + (s.last_seen ? new Date(s.last_seen).toLocaleString() : 'never') + '</div>' +
          '</div>';
      }).join('') + '</div>';
  } catch (e) {
    body.innerHTML = '<span style="color:var(--red);font-size:var(--text-xs);font-family:var(--font-mono)">Error: ' + escHtml(e.message) + '</span>';
  }
}

// ===================================================================
// SAMSARA
// ===================================================================
function initSamsaraCast() {
  const grid = document.getElementById('samsara-cast');
  const roleColors = { protagonist: 'var(--cyan)', antagonist: 'var(--red)', commentator: 'var(--amber)' };
  grid.innerHTML = SAMSARA_CAST.map(c =>
    '<div class="cast-card">' +
      '<div class="cast-name" style="color:' + (roleColors[c.role]||'var(--text)') + '">' + escHtml(c.label) + '</div>' +
      '<div class="cast-role">' + escHtml(c.role) + '</div>' +
      '<div class="cast-oneliner">"' + escHtml(c.oneliner) + '"</div>' +
      '<div class="cast-provider">' + escHtml(c.provider) + '</div>' +
    '</div>'
  ).join('');
}

function selectMode(el) {
  document.querySelectorAll('#mode-chips .mode-chip').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
}

async function startDebate() {
  const mindbridgeUrl = document.getElementById('mindbridge-url').value.trim();
  if (!mindbridgeUrl) { alert('Enter the MindBridge Router URL (e.g. https://your-app.railway.app)'); return; }

  const title     = document.getElementById('debate-title').value.trim();
  const thesis    = document.getElementById('debate-thesis').value.trim();
  const seed      = document.getElementById('debate-seed').value.trim();
  const rounds    = parseInt(document.getElementById('debate-rounds').value) || 1;
  const mode      = document.querySelector('#mode-chips .mode-chip.selected')?.dataset.mode || 'structured_test';
  const reasoning = document.getElementById('debate-reasoning').checked;

  if (!title || !thesis) { alert('Enter a paper title and thesis.'); return; }

  const spinner = document.getElementById('debate-spinner');
  const card    = document.getElementById('debate-result-card');
  const header  = document.getElementById('debate-result-header');
  const body    = document.getElementById('debate-transcript-body');

  spinner.style.display = 'inline-block';
  card.style.display    = 'block';
  header.textContent    = 'Running debate (' + mode + ')…';
  body.innerHTML        = '<div style="padding:var(--space-4);text-align:center"><span class="spinner"></span></div>';
  card.scrollIntoView({ behavior: 'smooth' });

  try {
    const payload = { paper_title: title, thesis, mode, rounds, include_reasoning: reasoning };
    if (seed) payload.test_questions = [seed];

    const res  = await fetch(mindbridgeUrl + '/v1/debate', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    });
    const data = await res.json();
    spinner.style.display = 'none';
    header.textContent    = 'Transcript — ' + escHtml(title);

    const turns = data.turns || data.transcript || [];
    if (!turns.length) {
      body.innerHTML = '<pre style="padding:var(--space-4);font-size:var(--text-xs);font-family:var(--font-mono);color:var(--text-muted);white-space:pre-wrap">' + escHtml(JSON.stringify(data, null, 2)) + '</pre>';
      return;
    }

    const roleColors = { protagonist: 'var(--cyan)', antagonist: 'var(--red)', commentator: 'var(--amber)', judge: 'var(--green)' };
    body.innerHTML = turns.map(t =>
      '<div class="debate-turn">' +
        '<div class="debate-turn-header">' +
          '<span class="debate-speaker" style="color:' + (roleColors[t.role]||'var(--text)') + '">' + escHtml(t.speaker||'?') + '</span>' +
          '<span class="debate-role-badge">' + escHtml(t.role||'') + '</span>' +
          (t.model ? '<span style="color:var(--text-faint);font-size:10px">' + escHtml(t.model) + '</span>' : '') +
        '</div>' +
        '<div class="debate-argument">' + escHtml(t.argument || t.response || t.content || '') + '</div>' +
      '</div>'
    ).join('');

    if (data.summary) {
      body.innerHTML += '<div style="padding:var(--space-4);background:var(--surface-2);border-top:1px solid var(--border-subtle)">' +
        '<div style="font-size:var(--text-xs);font-family:var(--font-mono);color:var(--text-muted);margin-bottom:var(--space-2)">summary</div>' +
        '<pre style="font-size:var(--text-xs);color:var(--text-muted);white-space:pre-wrap">' + escHtml(typeof data.summary === 'object' ? JSON.stringify(data.summary, null, 2) : data.summary) + '</pre>' +
        '</div>';
    }
  } catch (e) {
    spinner.style.display = 'none';
    body.innerHTML = '<div style="padding:var(--space-4);color:var(--red);font-size:var(--text-xs);font-family:var(--font-mono)">Error: ' + escHtml(e.message) + '</div>';
  }
}

// ===================================================================
// RAW DISPATCH
// ===================================================================
const DISPATCH_EXAMPLES = {
  route:    [
    { label: 'Ask Rostam',       color: 'var(--purple)', body: { userRequest: '@claude:route What is the current state of the Constellation?' } },
    { label: 'Ask Orion',        color: 'var(--blue)',   body: { userRequest: '@orion:route Summarize recent foundry activity' } },
    { label: 'Ask Triptych',     color: 'var(--amber)',  body: { userRequest: '@triptych:route What patterns do you see across agents?' } },
    { label: 'Ask Mephisto',     color: 'var(--red)',    body: { userRequest: '@mephistopheles:reflect What am I not seeing?' } },
    { label: 'Comet research',   color: 'var(--cyan)',   body: { userRequest: '@comet:research Pudgalavada personal identity Buddhism 2025' } },
  ],
  dispatch: [
    { label: 'To Notion',   color: 'var(--cyan)', body: { source: 'switchboard', destination: 'notion', payload: 'A new insight has surfaced.' } },
    { label: 'To Discord',  color: 'var(--blue)', body: { source: 'switchboard', destination: 'discord', payload: 'Signal from the Constellation.' } },
  ],
  message: [
    { label: 'Claude → Orion',   color: 'var(--purple)', body: { from: 'claude', to: 'orion',   intent: 'handoff', body: 'Passing context to the foundry.' } },
    { label: 'Orion → Triptych', color: 'var(--blue)',   body: { from: 'orion',  to: 'triptych', intent: 'review',  body: 'Cross-reference this.' } },
    { label: 'Comet → Claude',   color: 'var(--cyan)',   body: { from: 'comet',  to: 'claude',   intent: 'relay',   body: 'New research findings.' } },
  ],
  chain: [
    { label: '3-hop',      color: 'var(--amber)', body: { origin: 'claude', chain: ['claude','orion','triptych'],                        goal: 'Evaluate learning trajectory.' } },
    { label: 'Full sweep', color: 'var(--green)', body: { origin: 'claude', chain: ['claude','orion','triptych','mephistopheles'],        goal: 'Full constellation assessment.' } },
  ],
  parietal: [
    { label: 'Surface dormant', color: 'var(--purple)', body: { context: 'What forgotten waypoints need attention?' } },
    { label: 'Narrative gravity', color: 'var(--cyan)', body: { context: 'narrative growth and recurring themes' } },
  ],
  converse: [
    { label: 'Campfire (2 rounds)', color: 'var(--amber)', body: { agents: ['claude','orion','triptych'], seed: 'What is the constellation becoming?', rounds: 2, mode: 'campfire' } },
    { label: 'Mephisto + Rostam',   color: 'var(--red)',   body: { agents: ['claude','mephistopheles'],   seed: 'Where is the blindspot?',              rounds: 2, mode: 'debate'   } },
  ],
  log: [
    { label: 'Session event', color: 'var(--green)', body: { event: 'switchboard_test', detail: 'Testing quick dispatch.' } },
  ],
  chat: [
    { label: 'Chat Rostam',  color: 'var(--purple)', body: { messages: [{ role: 'user', content: 'Hello Rostam. State of the Constellation?' }] } },
    { label: 'Quick Q',      color: 'var(--cyan)',   body: { messages: [{ role: 'user', content: 'Which agents are online?' }] } },
  ],
  thread: [
    { label: 'New thread', color: 'var(--cyan)', body: { name: 'Samsara debrief' } },
  ],
};

function updateDispatchExample() {
  const endpoint = document.getElementById('disp-endpoint').value;
  const chips    = document.getElementById('disp-chips');
  const examples = DISPATCH_EXAMPLES[endpoint] || [];
  chips.innerHTML = examples.map((ex, i) =>
    '<button class="chip" onclick="fillDispatch(\'' + endpoint + '\',' + i + ')">' +
      '<span class="chip-dot" style="background:' + ex.color + '"></span>' + escHtml(ex.label) +
    '</button>'
  ).join('');
}

function fillDispatch(endpoint, i) {
  const ex  = DISPATCH_EXAMPLES[endpoint][i];
  const inp = document.getElementById('disp-body');
  inp.value = JSON.stringify(ex.body, null, 2);
  inp.style.borderColor = 'var(--cyan)';
  setTimeout(() => { inp.style.borderColor = ''; }, 600);
}

async function fireDispatch() {
  const endpoint  = document.getElementById('disp-endpoint').value;
  const target    = document.getElementById('disp-target').value;
  const bodyStr   = document.getElementById('disp-body').value.trim() || '{}';
  const resultCard = document.getElementById('dispatch-result-card');
  const resultSt   = document.getElementById('dispatch-result-status');
  const resultBody = document.getElementById('dispatch-result-body');

  const pathMap = {
    route:    '/api/route',
    dispatch: '/dispatch',
    message:  '/message',
    chain:    '/chain',
    parietal: '/parietal',
    converse: '/converse',
    log:      '/log',
    chat:     '/v1/chat/completions',
    thread:   '/thread',
  };

  const url = (target === 'api' ? API.api : API.siddhartha) + pathMap[endpoint];
  resultCard.style.display = 'block';
  resultSt.className       = 'result-status';
  resultSt.textContent     = 'Sending…';
  resultBody.textContent   = '';
  resultCard.scrollIntoView({ behavior: 'smooth' });

  let body;
  try { body = JSON.parse(bodyStr); } catch { resultBody.textContent = 'Body must be valid JSON.'; return; }

  try {
    const t0   = performance.now();
    const res  = await fetch(url, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(body),
    });
    const ms   = Math.round(performance.now() - t0);
    const ct   = res.headers.get('content-type') || '';
    let rb;
    if (ct.includes('json')) { rb = JSON.stringify(await res.json(), null, 2); }
    else { rb = await res.text(); }

    resultSt.className   = 'result-status ' + (res.ok ? 'ok' : 'err');
    resultSt.textContent = 'POST ' + url + ' → ' + res.status + ' ' + res.statusText + ' (' + ms + 'ms)';
    resultBody.textContent = rb;
  } catch (e) {
    resultSt.className   = 'result-status err';
    resultSt.textContent = 'ERROR';
    resultBody.textContent = e.message;
  }
}

function clearDispatch() {
  document.getElementById('disp-body').value = '';
  document.getElementById('dispatch-result-card').style.display = 'none';
}

// ===================================================================
// INFRA — ROUTE MAP + WAYPOINTS
// ===================================================================
function renderInfraRoutes() {
  const container = document.getElementById('infra-route-map');
  const groups = [
    { label: 'api.soul-os.cc', color: 'var(--amber)', routes: ROUTES.api },
    { label: 'Mailbox / KV',   color: 'var(--cyan)',  routes: ROUTES.mailbox },
  ];

  container.innerHTML = groups.map(g => {
    const probeable = g.routes.filter(r => r.method === 'GET' && !r.path.includes(':') && !r.path.includes('*'));
    return '<div class="route-group" style="margin-bottom:var(--space-3)">' +
      '<div class="route-group-header" onclick="toggleGroup(this)">' +
        '<svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>' +
        '<span class="group-label" style="color:' + g.color + '">' + escHtml(g.label) + '</span>' +
        '<span class="group-count">' + g.routes.length + ' routes</span>' +
      '</div>' +
      '<ul class="route-list">' +
        g.routes.map((r, i) =>
          '<li class="route-item" id="ri-' + g.label.replace(/[^a-z0-9]/gi,'_') + '-' + i + '">' +
            '<span class="method-badge method-' + r.method + '">' + r.method + '</span>' +
            '<div>' +
              '<div class="route-path">' + escHtml(r.path) + '</div>' +
              '<div class="route-desc">' + escHtml(r.desc) + '</div>' +
            '</div>' +
            (r.method === 'GET' && !r.path.includes(':') && !r.path.includes('*')
              ? '<button class="btn-probe" onclick="probeInfraRoute(\'' + escAttr(g.label) + '\',' + i + ')">Probe</button>'
              : '<span></span>') +
          '</li>'
        ).join('') +
      '</ul>' +
    '</div>';
  }).join('');
}

async function probeInfraRoute(groupLabel, i) {
  const groupKey = groupLabel.replace(/[^a-z0-9]/gi, '_');
  const item  = document.getElementById('ri-' + groupKey + '-' + i);
  if (!item) return;

  const group  = ROUTES[groupLabel === 'api.soul-os.cc' ? 'api' : 'mailbox'];
  const route  = group[i];
  const url    = API.api + route.path;
  const btn    = item.querySelector('.btn-probe');
  const exist  = item.querySelector('.probe-result');
  if (exist) { exist.remove(); return; }

  if (btn) { btn.textContent = '…'; btn.style.opacity = '0.5'; }

  const box = document.createElement('div');
  box.className  = 'probe-result';
  box.style.gridColumn = '1/-1';
  box.style.marginTop  = 'var(--space-2)';

  try {
    const t0  = performance.now();
    const res = await fetch(url);
    const ms  = Math.round(performance.now() - t0);
    const ct  = res.headers.get('content-type') || '';
    let rb;
    if (ct.includes('json')) rb = JSON.stringify(await res.json(), null, 2);
    else rb = await res.text();
    box.textContent = res.status + ' ' + res.statusText + ' (' + ms + 'ms)\n\n' + rb;
    box.style.color = res.ok ? 'var(--green)' : 'var(--red)';
  } catch (e) {
    box.textContent = 'ERROR: ' + e.message;
    box.style.color = 'var(--red)';
  }

  item.appendChild(box);
  if (btn) { btn.textContent = 'Probe'; btn.style.opacity = ''; }
}

function toggleGroup(header) {
  header.classList.toggle('collapsed');
  header.nextElementSibling.classList.toggle('hidden');
}

async function loadWaypoints() {
  const body = document.getElementById('waypoints-body');
  body.innerHTML = '<span class="spinner"></span>';
  try {
    const res  = await fetch(API.siddhartha + '/waypoints');
    const data = await res.json();
    body.innerHTML = '<ul style="list-style:none">' +
      Object.entries(data).map(([k,v]) =>
        '<li style="display:flex;align-items:baseline;gap:var(--space-3);padding:var(--space-2) 0;border-bottom:1px solid var(--border-subtle);font-size:var(--text-xs)">' +
          '<span style="font-family:var(--font-mono);color:var(--cyan-dim);min-width:200px;flex-shrink:0">' + escHtml(k) + '</span>' +
          '<span style="color:var(--text-muted);word-break:break-all">' +
            (typeof v === 'string' && v.startsWith('http')
              ? '<a href="' + escAttr(v) + '" target="_blank" rel="noopener noreferrer">' + escHtml(v) + '</a>'
              : escHtml(String(v))) +
          '</span>' +
        '</li>'
      ).join('') +
    '</ul>';
  } catch (e) {
    body.innerHTML = '<span style="color:var(--red);font-size:var(--text-xs);font-family:var(--font-mono)">Error: ' + escHtml(e.message) + '</span>';
  }
}

// ===================================================================
// UTILS
// ===================================================================
function escHtml(str) {
  if (typeof str !== 'string') str = String(str);
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}
function escAttr(str) {
  if (typeof str !== 'string') str = String(str);
  return str.replace(/"/g, '&quot;');
}

// ===================================================================
// INIT
// ===================================================================
initRTPills();
initSamsaraCast();
renderInfraRoutes();
updateDispatchExample();
probeAll();
</script>
</body>
</html>
`;
