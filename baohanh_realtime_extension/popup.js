document.addEventListener('DOMContentLoaded', () => {
  chrome.runtime.sendMessage({ type: 'GET_STATUS' }, (res) => {
    if (res) {
      if (res.ordersCount > 0) {
        document.getElementById('infoServiceOs').textContent = `Đã đồng bộ ${res.ordersCount} xe gần nhất`;
      }
      if (res.claimsCount > 0) {
        document.getElementById('infoDealer').textContent = `Đã đồng bộ ${res.claimsCount} đề xuất gần nhất`;
      }
    }
  });

  document.getElementById('btnOpenApp').addEventListener('click', () => {
    chrome.tabs.create({ url: 'file:///c:/Users/nhu%20truong/OneDrive/Tài%20liệu/bảo%20hành/PhanTichBaoHanh.html' });
  });
});
