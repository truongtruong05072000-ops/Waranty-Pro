# -*- coding: utf-8 -*-
import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    text = f.read()

pos_start = text.find('function getConsoleSnippetCode')
pos_end = text.find('// 1-Click Sync flow: Copies code and opens ServiceOS', pos_start)

if pos_start == -1 or pos_end == -1:
    print('Failed to find getConsoleSnippetCode block!')
    sys.exit(1)

new_block = r'''function getConsoleSnippetCode(targetUrl){
  let t = targetUrl || window.location.href;
  if(!t || t.startsWith('file:')) t = 'http://localhost:8787/PhanTichBaoHanh.html';
  const cleanTarget = t.split('#')[0];
  return `(async()=>{
  let allRows=[],p=1,total=Infinity;
  while(allRows.length<total){
    const r=await fetch('/api/work-orders?status=active&page='+p+'&page_size=200',{credentials:'same-origin'});
    if(!r.ok)throw new Error('HTTP '+r.status);
    const d=await r.json();
    const rows=d.rows||d.items||[];
    if(!rows.length)break;
    allRows=allRows.concat(rows);
    total=d.total||d.count||rows.length;
    if(allRows.length>=total||rows.length<200)break;
    p++;
    if(p>50)break;
  }
  if(!allRows.length){alert('⚠️ Không tìm thấy xe nào trong mục "Xe đang trong xưởng"!');return;}

  const wRows=allRows.filter(w=>(w.warranty_kinds&&w.warranty_kinds.length>0)||w.warranty_status||w.battery_serial_old||w.motor_serial_old||(w.faults&&w.faults.length>0)||w.dms_warranty_code);
  if(wRows.length>0){
    await Promise.all(wRows.map(async(w)=>{
      try{
        const [dRes,dpRes]=await Promise.all([
          fetch('/api/work-orders/'+w.id,{credentials:'same-origin'}).catch(()=>null),
          fetch('/api/dealer-portal/work-orders/'+w.id,{credentials:'same-origin'}).catch(()=>null)
        ]);
        if(dRes&&dRes.ok){
          const dt=await dRes.json();
          const wo=dt.work_order||dt;
          if(wo.warranty_extra) w.warranty_extra=wo.warranty_extra;
          if(wo.dms_warranty_code) w.dms_warranty_code=wo.dms_warranty_code;
          if(wo.dms_claim_code) w.dms_claim_code=wo.dms_claim_code;
          if(wo.dms_ro_code) w.dms_ro_code=wo.dms_ro_code;
          if(wo.inspection_notes) w.inspection_notes=wo.inspection_notes;
        }
        if(dpRes&&dpRes.ok){
          const dp=await dpRes.json();
          if(dp&&Array.isArray(dp.claims)&&dp.claims.length>0){
            w.dealer_claims=dp.claims;
            const extra={...(w.warranty_extra||{})};
            const kinds=w.warranty_kinds||Object.keys(extra)||['pin'];
            for(const c of dp.claims){
              const wRo=(c.work_order||'').trim();
              if(wRo&&!w.dms_warranty_code) w.dms_warranty_code=wRo;
              const cNum=(c.number||c.claim_code||'').trim();
              if(cNum&&!w.dms_claim_code) w.dms_claim_code=cNum;
              let mk=kinds.find(k=>{
                const row=extra[k]||{};
                const rw=(row.warranty_code||'').trim();
                return(rw&&wRo&&rw.toUpperCase()===wRo.toUpperCase());
              })||(kinds.length===1?kinds[0]:null)||kinds[0];
              if(mk){
                const row={...(extra[mk]||{})};
                if(!row.warranty_code&&wRo) row.warranty_code=wRo;
                if(!row.claim_code&&cNum) row.claim_code=cNum;
                if(row.claim_amount==null&&c.amount!=null) row.claim_amount=c.amount;
                if(!row.claim_submitted_at&&(c.submitted_at||c.created_at)) row.claim_submitted_at=c.submitted_at||c.created_at;
                if(!row.claim_approved_at&&c.approved_at) row.claim_approved_at=c.approved_at;
                if(c.status&&!row.claim_status) row.claim_status=c.status;
                if(!row.serial_old&&c.serial_old) row.serial_old=c.serial_old;
                if(!row.serial_new&&c.serial_new) row.serial_new=c.serial_new;
                if(!row.dien_giai&&c.dien_giai) row.dien_giai=c.dien_giai;
                extra[mk]=row;
              }
            }
            w.warranty_extra=extra;
          }
        }
      }catch(e){}
    }));
  }

  const orders=allRows.map((w,i)=>({
    ...w,
    id:'ord_'+(w.code||i),
    wo:w.code||w.dms_ro_code||'—',
    plate:w.plate||'—',
    vin:w.vin||'—',
    vehicle:w.model||'—',
    customer:w.customer_name||'—',
    tech:w.technician_name||'Chưa phân công',
    diagnosis:w.diagnosis||w.symptoms||w.content||'',
    faults:w.faults||[],
    note:(w.foreman_note||w.advisor_note||'').trim(),
    status:w.status_label||w.status||'Trong xưởng',
    warrantyStatus:w.warranty_status||w.dms_warranty_status||'',
    pinSerial:w.battery_serial_old||w.battery_serial_new||'',
    motorSerial:w.motor_serial_old||w.motor_serial_new||'',
    chargerSerial:'',
    removedAt:w.parts_removed_at||w.motor_removed_at||'',
    bhCode:w.dms_warranty_code||w.bh_order_code||'',
    claimCode:w.dms_claim_code||'',
    warranty_kinds:w.warranty_kinds||[],
    warranty_extra:w.warranty_extra||{},
    dealer_claims:w.dealer_claims||[],
    dateStr:(w.received_at||w.created_at||'').slice(0,10)||new Date().toISOString().slice(0,10)
  }));

  const json=JSON.stringify(orders);
  try{navigator.clipboard.writeText(json)}catch(e){}
  const targetUrl='${cleanTarget}#serviceos='+encodeURIComponent(json);
  const win=window.open(targetUrl,'_blank');
  let toast=document.getElementById('bh-toast');
  if(!toast){
    toast=document.createElement('div');
    toast.id='bh-toast';
    toast.style.cssText='position:fixed;top:20px;right:20px;z-index:999999;background:#059669;color:#fff;padding:12px 24px;border-radius:10px;font-size:15px;font-weight:bold;box-shadow:0 8px 24px rgba(0,0,0,0.3);font-family:sans-serif;';
    document.body.appendChild(toast);
  }
  toast.innerHTML='✅ Đã kéo đầy đủ '+orders.length+' xe kèm Lệnh BH & ĐXBH! Đang mở Bảo Hành PRO...';
  setTimeout(()=>toast.remove(),4000);
  if(!win){alert('⚡ Đã lấy đầy đủ '+orders.length+' xe kèm Lệnh BH & ĐXBH! Trình duyệt đã chặn popup. Hãy quay lại Bảo Hành PRO và bấm Ctrl+V.');}
})().catch(err=>alert('Lỗi: '+err.message));`;
}

// Generate Userscript for Tampermonkey
function getUserscriptCode(targetUrl){
  const cleanTarget = (targetUrl || window.location.href).split('#')[0];
  return `// ==UserScript==
// @name         Bảo Hành PRO - Đồng bộ ServiceOS
// @namespace    https://phan-tich-bao-hanh.pages.dev/
// @version      2.5
// @description  Tự động thêm nút lấy xe kèm Lệnh BH & ĐXBH trực tiếp từ ServiceOS Dashboard sang Bảo Hành PRO
// @match        https://att-serviceos.anthinhtech.vn/*
// @grant        none
// ==/UserScript==

(function() {
  'use strict';
  function injectBtn() {
    if (document.getElementById('btn-sync-baohanhpro')) return;
    const btn = document.createElement('button');
    btn.id = 'btn-sync-baohanhpro';
    btn.innerHTML = '⚡ Gửi xe sang Bảo Hành PRO';
    btn.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:999999;background:linear-gradient(135deg,#2563eb,#1d4ed8);color:#fff;border:none;padding:12px 22px;border-radius:50px;font-weight:700;font-size:14px;cursor:pointer;box-shadow:0 6px 20px rgba(37,99,235,0.45);display:flex;align-items:center;gap:8px;transition:all 0.2s;font-family:sans-serif;';
    btn.onmouseover = () => btn.style.transform = 'translateY(-2px) scale(1.03)';
    btn.onmouseout = () => btn.style.transform = 'translateY(0) scale(1)';
    btn.onclick = async function() {
      btn.innerHTML = '⏳ Đang kéo dữ liệu xe & Lệnh BH / ĐXBH...';
      try {
        let allRows=[],p=1,total=Infinity;
        while(allRows.length<total){
          const res = await fetch('/api/work-orders?status=active&page='+p+'&page_size=200', { credentials: 'same-origin' });
          if(!res.ok) throw new Error('HTTP ' + res.status);
          const d = await res.json();
          const rows = d.rows || d.items || [];
          if (!rows.length) break;
          allRows = allRows.concat(rows);
          total = d.total || d.count || rows.length;
          if (allRows.length >= total || rows.length < 200) break;
          p++;
          if(p>50) break;
        }
        if (!allRows.length) { alert('⚠️ Không có xe nào trong mục "Xe đang trong xưởng"!'); btn.innerHTML = '⚡ Gửi xe sang Bảo Hành PRO'; return; }

        const wRows = allRows.filter(w => (w.warranty_kinds && w.warranty_kinds.length > 0) || w.warranty_status || w.battery_serial_old || w.motor_serial_old || (w.faults && w.faults.length > 0) || w.dms_warranty_code);
        if (wRows.length > 0) {
          btn.innerHTML = '⏳ Đang kéo Lệnh BH & ĐXBH (' + wRows.length + ' xe)...';
          await Promise.all(wRows.map(async (w) => {
            try {
              const [dRes, dpRes] = await Promise.all([
                fetch('/api/work-orders/' + w.id, { credentials: 'same-origin' }).catch(() => null),
                fetch('/api/dealer-portal/work-orders/' + w.id, { credentials: 'same-origin' }).catch(() => null)
              ]);
              if (dRes && dRes.ok) {
                const dt = await dRes.json();
                const wo = dt.work_order || dt;
                if (wo.warranty_extra) w.warranty_extra = wo.warranty_extra;
                if (wo.dms_warranty_code) w.dms_warranty_code = wo.dms_warranty_code;
                if (wo.dms_claim_code) w.dms_claim_code = wo.dms_claim_code;
                if (wo.dms_ro_code) w.dms_ro_code = wo.dms_ro_code;
                if (wo.inspection_notes) w.inspection_notes = wo.inspection_notes;
              }
              if (dpRes && dpRes.ok) {
                const dp = await dpRes.json();
                if (dp && Array.isArray(dp.claims) && dp.claims.length > 0) {
                  w.dealer_claims = dp.claims;
                  const extra = { ...(w.warranty_extra || {}) };
                  const kinds = w.warranty_kinds || Object.keys(extra) || ['pin'];
                  for (const c of dp.claims) {
                    const wRo = (c.work_order || '').trim();
                    if (wRo && !w.dms_warranty_code) w.dms_warranty_code = wRo;
                    const cNum = (c.number || c.claim_code || '').trim();
                    if (cNum && !w.dms_claim_code) w.dms_claim_code = cNum;
                    let mk = kinds.find(k => {
                      const row = extra[k] || {};
                      const rw = (row.warranty_code || '').trim();
                      return (rw && wRo && rw.toUpperCase() === wRo.toUpperCase());
                    }) || (kinds.length === 1 ? kinds[0] : null) || kinds[0];
                    if (mk) {
                      const row = { ...(extra[mk] || {}) };
                      if (!row.warranty_code && wRo) row.warranty_code = wRo;
                      if (!row.claim_code && cNum) row.claim_code = cNum;
                      if (row.claim_amount == null && c.amount != null) row.claim_amount = c.amount;
                      if (!row.claim_submitted_at && (c.submitted_at || c.created_at)) row.claim_submitted_at = c.submitted_at || c.created_at;
                      if (!row.claim_approved_at && c.approved_at) row.claim_approved_at = c.approved_at;
                      if (c.status && !row.claim_status) row.claim_status = c.status;
                      if (!row.serial_old && c.serial_old) row.serial_old = c.serial_old;
                      if (!row.serial_new && c.serial_new) row.serial_new = c.serial_new;
                      if (!row.dien_giai && c.dien_giai) row.dien_giai = c.dien_giai;
                      extra[mk] = row;
                    }
                  }
                  w.warranty_extra = extra;
                }
              }
            } catch(e) {}
          }));
        }

        const orders = allRows.map((w, i) => ({
          ...w,
          id: 'ord_' + (w.code || i),
          wo: w.code || w.dms_ro_code || '—',
          plate: w.plate || '—',
          vin: w.vin || '—',
          vehicle: w.model || '—',
          customer: w.customer_name || '—',
          tech: w.technician_name || 'Chưa phân công',
          diagnosis: w.diagnosis || w.symptoms || w.content || '',
          faults: w.faults || [],
          note: (w.foreman_note || w.advisor_note || '').trim(),
          status: w.status_label || w.status || 'Trong xưởng',
          warrantyStatus: w.warranty_status || w.dms_warranty_status || '',
          pinSerial: w.battery_serial_old || w.battery_serial_new || '',
          motorSerial: w.motor_serial_old || w.motor_serial_new || '',
          chargerSerial: '',
          removedAt: w.parts_removed_at || w.motor_removed_at || '',
          bhCode: w.dms_warranty_code || w.bh_order_code || '',
          claimCode: w.dms_claim_code || '',
          warranty_kinds: w.warranty_kinds || [],
          warranty_extra: w.warranty_extra || {},
          dealer_claims: w.dealer_claims || [],
          dateStr: (w.received_at || w.created_at || '').slice(0, 10) || new Date().toISOString().slice(0, 10)
        }));

        const json = JSON.stringify(orders);
        try { navigator.clipboard.writeText(json); } catch(e){}
        const targetUrl = '${cleanTarget}#serviceos=' + encodeURIComponent(json);
        window.open(targetUrl, '_blank');
        btn.innerHTML = '✅ Đã gửi ' + orders.length + ' xe kèm Lệnh BH & ĐXBH!';
        setTimeout(() => btn.innerHTML = '⚡ Gửi xe sang Bảo Hành PRO', 3500);
      } catch(e) {
        alert('Lỗi: ' + e.message);
        btn.innerHTML = '⚡ Gửi xe sang Bảo Hành PRO';
      }
    };
    document.body.appendChild(btn);
  }
  setInterval(injectBtn, 1500);
})();`;
}

'''

text = text[:pos_start] + new_block + text[pos_end:]

with open('_build/app_template2.html', 'w', encoding='utf-8') as f:
    f.write(text)

print('Updated getConsoleSnippetCode and getUserscriptCode successfully in _build/app_template2.html.')
