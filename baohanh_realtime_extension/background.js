// Background Service Worker (Manifest V3)
let lastOrders = [];
let lastClaims = [];
let lastOrdersTime = 0;
let lastClaimsTime = 0;

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (!msg || !msg.type) return;

  if (msg.type === 'SERVICEOS_REALTIME') {
    lastOrders = msg.orders || [];
    lastOrdersTime = Date.now();
    // Chuyển tiếp tới tất cả các tab Web App Bảo Hành PRO
    forwardToWebApp(msg);
    sendResponse({ ok: true, forwardedToTabs: true });
  } else if (msg.type === 'DEALER_PORTAL_REALTIME') {
    lastClaims = msg.claims || [];
    lastClaimsTime = Date.now();
    forwardToWebApp(msg);
    sendResponse({ ok: true, forwardedToTabs: true });
  } else if (msg.type === 'GET_STATUS') {
    sendResponse({
      ordersCount: lastOrders.length,
      ordersTime: lastOrdersTime,
      claimsCount: lastClaims.length,
      claimsTime: lastClaimsTime
    });
  }
});

function forwardToWebApp(msg) {
  chrome.tabs.query({}, (tabs) => {
    for (const tab of tabs) {
      if (!tab.id) continue;
      // Gửi tới tất cả các tab có thể là web Bảo Hành
      try {
        chrome.tabs.sendMessage(tab.id, msg).catch(() => {});
      } catch(e){}
    }
  });
}
