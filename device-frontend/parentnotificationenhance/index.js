/* ─────────────────────────────────────────────────────
   GeoFence Guardian — app.js
   Handles: SSE connection, status updates, feed rendering
───────────────────────────────────────────────────── */

// ── State ──────────────────────────────────────────
let isInside    = true;
let isConnected = true;
let notifCount  = 0;
let eventSource = null;

// ── Helpers ────────────────────────────────────────

function getTime() {
  return new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

// ── Status Card ────────────────────────────────────

function updateStatus(inside) {
  isInside = inside;

  const card       = document.getElementById('statusCard');
  const icon       = document.getElementById('statusIcon');
  const value      = document.getElementById('statusValue');
  const lastUpdated = document.getElementById('lastUpdated');
  const lastEvent  = document.getElementById('lastEvent');

  const state = inside ? 'inside' : 'outside';

  card.className  = `status-card ${state}`;
  icon.className  = `status-icon ${state}`;
  icon.textContent = inside ? '✅' : '❌';
  value.className = `status-value ${state}`;
  value.textContent = inside ? 'INSIDE SAFE ZONE' : 'OUTSIDE SAFE ZONE';
  lastUpdated.textContent = getTime();
  lastEvent.textContent   = inside ? 'Entered' : 'Exited';
}

// ── Notification Feed ──────────────────────────────

function addNotification(type) {
  // Remove empty state placeholder
  const empty = document.getElementById('feedEmpty');
  if (empty) empty.remove();

  notifCount++;
  document.getElementById('feedCount').textContent = notifCount;

  const list    = document.getElementById('feedList');
  const item    = document.createElement('div');
  const isEnter = type === 'enter';

  item.className = 'feed-item';
  item.innerHTML = `
    <div class="feed-item-icon ${isEnter ? 'enter' : 'exit'}">${isEnter ? '📥' : '📤'}</div>
    <div class="feed-item-content">
      <div class="feed-item-msg">
        Device <span class="${isEnter ? 'enter-keyword' : 'exit-keyword'}">${isEnter ? 'ENTERED' : 'EXITED'}</span> safe zone
      </div>
      <div class="feed-item-time">${getTime()}</div>
    </div>
  `;

  // Newest on top
  list.insertBefore(item, list.firstChild);
}

function clearFeed() {
  const list = document.getElementById('feedList');
  list.innerHTML = '<div class="feed-empty" id="feedEmpty">No notifications yet. Waiting for events…</div>';
  notifCount = 0;
  document.getElementById('feedCount').textContent = '0';
}

// ── Connection Status ──────────────────────────────

function setConnectionState(connected) {
  isConnected = connected;
  const dot  = document.getElementById('statusDot');
  const text = document.getElementById('statusText');

  dot.className    = connected ? 'status-dot' : 'status-dot disconnected';
  text.textContent = connected ? 'Live Connected' : 'Disconnected';
}

function toggleConnection() {
  setConnectionState(!isConnected);
}

// ── SSE ────────────────────────────────────────────

function connectSSE() {
  // TODO: replace '/api/events' with your actual SSE endpoint
  // eventSource = new EventSource('/api/events');
  //
  // eventSource.onopen = () => setConnectionState(true);
  //
  // eventSource.onmessage = (e) => {
  //   const data = JSON.parse(e.data);
  //   // Expected payload: { type: 'enter' | 'exit', device: string }
  //   updateStatus(data.type === 'enter');
  //   addNotification(data.type);
  // };
  //
  // eventSource.onerror = () => setConnectionState(false);
}

// ── Demo (simulate SSE events) ─────────────────────

function simulateEvent(type) {
  if (!isConnected) return;
  updateStatus(type === 'enter');
  addNotification(type);
}

// ── Init ───────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('lastUpdated').textContent = getTime();
  connectSSE();
});
