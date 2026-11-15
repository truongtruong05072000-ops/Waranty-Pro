// ==UserScript==
// @name         Bảo Hành PRO — Realtime Sync Bridge
// @namespace    https://anthinhtech.vn/
// @version      2.3.0
// @description  Tự động đẩy chuẩn xác 535 xe từ ServiceOS và đề xuất bảo hành từ Dealer Portal sang Web Bảo Hành PRO thời gian thực (Zero-click)
// @author       Bảo Hành PRO
// @match        https://att-serviceos.anthinhtech.vn/*
// @match        https://dealer-portal.vinfast.com/*
// @match        https://dealerportal.vinfast.com/*
// @match        http://localhost:*/*
// @match        http://127.0.0.1:*/*
// @match        https://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// @grant        GM_setClipboard
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';
    console.log('[Bảo Hành PRO Userscript] Đang chạy Realtime Sync Bridge v2.3.0...');

    const bc = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('BAOHANH_REALTIME_SYNC') : null;

    function broadcastServiceOs(orders) {
        if (!Array.isArray(orders) || orders.length === 0) return;
        const activeOrders = orders.filter(w => {
            const st = String(w.status || '').toLowerCase();
            return st !== 'delivered' && st !== 'cancelled' && st !== 'đã giao' && st !== 'hủy';
        });

        if (typeof GM_setValue === 'function') {
            try { GM_setValue('bh_serviceos_orders', { orders: activeOrders, timestamp: Date.now() }); } catch(e){}
        }
        if (bc) bc.postMessage({ type: 'SERVICEOS_REALTIME', orders: activeOrders, timestamp: Date.now() });
        try {
            localStorage.setItem('bh_realtime_serviceos_event', JSON.stringify({ orders: activeOrders, timestamp: Date.now() }));
        } catch(e){}
    }

    function broadcastDealerPortal(claims) {
        const list = Array.isArray(claims) ? claims : (claims.data || claims.rows || claims.items || []);
        if (!Array.isArray(list) || list.length === 0) return;

        if (typeof GM_setValue === 'function') {
            try { GM_setValue('bh_dealer_claims', { claims: list, timestamp: Date.now() }); } catch(e){}
        }
        if (bc) bc.postMessage({ type: 'DEALER_PORTAL_REALTIME', claims: list, timestamp: Date.now() });
        try {
            localStorage.setItem('bh_realtime_dealer_event', JSON.stringify({ claims: list, timestamp: Date.now() }));
        } catch(e){}
    }

    // Lắng nghe trên tab Web App Bảo Hành PRO nếu dùng Userscript
    if (typeof GM_addValueChangeListener === 'function') {
        GM_addValueChangeListener('bh_serviceos_orders', function(name, oldVal, newVal) {
            if (newVal && newVal.orders) {
                window.postMessage({ type: 'SERVICEOS_REALTIME', orders: newVal.orders, timestamp: newVal.timestamp }, '*');
            }
        });
        GM_addValueChangeListener('bh_dealer_claims', function(name, oldVal, newVal) {
            if (newVal && newVal.claims) {
                window.postMessage({ type: 'DEALER_PORTAL_REALTIME', claims: newVal.claims, timestamp: newVal.timestamp }, '*');
            }
        });
    }

    // Helper trích xuất mảng dữ liệu
    function extractList(json) {
        if (!json) return [];
        if (Array.isArray(json)) return json;
        if (json.data && Array.isArray(json.data)) return json.data;
        if (json.data && typeof json.data === 'object') {
            if (Array.isArray(json.data.items)) return json.data.items;
            if (Array.isArray(json.data.content)) return json.data.content;
            if (Array.isArray(json.data.rows)) return json.data.rows;
            if (Array.isArray(json.data.records)) return json.data.records;
            if (Array.isArray(json.data.claims)) return json.data.claims;
            if (Array.isArray(json.data.orders)) return json.data.orders;
        }
        if (Array.isArray(json.rows)) return json.rows;
        if (Array.isArray(json.items)) return json.items;
        if (Array.isArray(json.content)) return json.content;
        if (Array.isArray(json.records)) return json.records;
        if (Array.isArray(json.claims)) return json.claims;
        if (Array.isArray(json.orders)) return json.orders;
        return [];
    }

    function isDealerClaims(list) {
        if (!Array.isArray(list) || list.length === 0) return false;
        return list.slice(0, 10).some(item => Boolean(
            item && (
                item.warrantyClaimNumber || 
                item.claimNumber || 
                (item.workOrderNumber && String(item.workOrderNumber).includes('WO')) ||
                (item.claimTo && item.claimType) ||
                (item.totalRequestedAmountInclTax !== undefined)
            )
        ));
    }

    // 1. Hook fetch & XHR
    function handleCapturedData(url, json) {
        if (!json || typeof json !== 'object') return;
        const host = location.hostname;

        // ServiceOS Work Orders
        if (host.includes('anthinhtech.vn')) {
            const rows = extractList(json);
            if (rows.length > 0 && rows[0] && (rows[0].plate !== undefined || rows[0].vin !== undefined || rows[0].code !== undefined)) {
                broadcastServiceOs(rows);
            }
            return;
        }

        // Dealer Portal Warranty Claims
        if (host.includes('vinfast.com')) {
            const list = extractList(json);
            if (isDealerClaims(list)) {
                broadcastDealerPortal(list);
            }
        }
    }

    const origFetch = window.fetch;
    window.fetch = async function(...args) {
        const res = await origFetch.apply(this, args);
        try {
            const clone = res.clone();
            const url = (args[0] && typeof args[0] === 'string') ? args[0] : (args[0]?.url || '');
            clone.json().then(data => handleCapturedData(url, data)).catch(() => {});
        } catch(e){}
        return res;
    };

    const origOpen = XMLHttpRequest.prototype.open;
    const origSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.open = function(method, url) {
        this.__reqUrl = url;
        return origOpen.apply(this, arguments);
    };
    XMLHttpRequest.prototype.send = function() {
        this.addEventListener('load', function() {
            try {
                if (this.responseType === '' || this.responseType === 'text') {
                    const data = JSON.parse(this.responseText);
                    handleCapturedData(this.__reqUrl || '', data);
                }
            } catch(e){}
        });
        return origSend.apply(this, arguments);
    };

    // 2. Kéo full xe từ ServiceOS đúng chi nhánh
    let isFetchingServiceOs = false;
    async function fetchFullServiceOs() {
        if (isFetchingServiceOs || !location.hostname.includes('anthinhtech.vn')) return;
        isFetchingServiceOs = true;
        try {
            let branchId = '';
            try { branchId = (window.S && window.S.branch) || localStorage.getItem('branch') || ''; } catch(e){}
            const branchParam = branchId ? `&branch_id=${branchId}` : '';

            const res1 = await fetch(`/api/work-orders?status=active${branchParam}&page=1&page_size=200`, { credentials: 'include' });
            if (!res1.ok) { isFetchingServiceOs = false; return; }
            const data1 = await res1.json();
            const rows1 = extractList(data1);
            const total = data1.total || rows1.length;
            let all = [...rows1];

            if (total > rows1.length) {
                const totalPages = Math.ceil(total / 200);
                const promises = [];
                for (let p = 2; p <= Math.min(totalPages, 20); p++) {
                    promises.push(
                        fetch(`/api/work-orders?status=active${branchParam}&page=${p}&page_size=200`, { credentials: 'include' })
                            .then(r => r.ok ? r.json() : null)
                            .then(d => d ? extractList(d) : [])
                            .catch(() => [])
                    );
                }
                const otherPages = await Promise.all(promises);
                for (const pRows of otherPages) {
                    if (Array.isArray(pRows)) all = all.concat(pRows);
                }
            }
            if (all.length > 0) {
                broadcastServiceOs(all);
            }
        } catch(e){} finally {
            isFetchingServiceOs = false;
        }
    }

    if (location.host.includes('anthinhtech.vn')) {
        setTimeout(fetchFullServiceOs, 1500);
        setInterval(fetchFullServiceOs, 15000);
    }
})();
