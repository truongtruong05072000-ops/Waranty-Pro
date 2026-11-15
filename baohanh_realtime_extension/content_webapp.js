// Content script chạy trên tab Web App Bảo Hành PRO
(function() {
  // Chỉ chạy nếu trang web hiện tại là Bảo Hành PRO
  function isBaoHanhApp() {
    return document.title.includes('BẢO HÀNH') || 
           document.getElementById('overviewContent') !== null ||
           document.getElementById('checkXeTbody') !== null ||
           document.getElementById('ctxRealtimeChip') !== null;
  }

  // Lắng nghe thông điệp từ Extension Background
  chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    if (!msg || !msg.type) return;
    if (msg.type === 'SERVICEOS_REALTIME' || msg.type === 'DEALER_PORTAL_REALTIME') {
      window.postMessage(msg, '*');
      sendResponse({ received: true });
    }
  });

  // Thông báo cho Extension biết tab Web App đang mở
  try {
    if (isBaoHanhApp()) {
      chrome.runtime.sendMessage({ type: 'WEBAPP_REGISTER' });
      window.postMessage({ type: 'EXTENSION_CONNECTED', version: '2.0.0' }, '*');
    }
  } catch(e){}
})();
