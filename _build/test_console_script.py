# test console script syntax with node if available
import subprocess, sys

script = r"""
const fetch = () => Promise.resolve({
  json: () => Promise.resolve({
    rows: [
      { code: 'WO-001', plate: '29A-12345', model: 'Feliz S', technician_name: 'Nguyen Van A', faults: ['Hong pin'], foreman_note: 'Da thay pin', status: 'active', received_at: '2026-10-30T10:00:00Z' }
    ]
  })
});
const window = { open: (u, t) => console.log('Opened:', u.slice(0, 50)) };
const navigator = { clipboard: { writeText: () => Promise.resolve() } };
const document = { getElementById: () => null, createElement: () => ({ style: {} }), body: { appendChild: () => {} } };

fetch('/api/work-orders?status=active&page=1&page_size=250',{credentials:'same-origin'}).then(r=>r.json()).then(d=>{const rows=d.rows||d.items||[];if(!rows.length){console.log('Không có xe trong xưởng!');return;}const orders=rows.map((w,i)=>({id:'ord_'+(w.code||i),wo:w.code||w.dms_ro_code||'—',plate:w.plate||'—',vin:w.vin||'—',vehicle:w.model||'—',customer:w.customer_name||'—',tech:w.technician_name||'Chưa phân công',issue:[w.source==='retail'?w.customer_name:'',w.faults&&w.faults.length?w.faults.join(', '):w.symptoms||''].filter(Boolean).join(' · ')||w.content||'Kiểm tra',note:(w.foreman_note||'').trim(),status:w.status_label||w.status||'Trong xưởng',dateStr:(w.received_at||w.created_at||'').slice(0,10)||new Date().toLocaleDateString('vi-VN'),isChecked:Boolean((w.foreman_note||'').trim()&&(w.foreman_note||'').trim()!=='—'&&(w.foreman_note||'').trim().toLowerCase()!=='none')}));const json=JSON.stringify(orders);const targetUrl='https://example.com#serviceos='+encodeURIComponent(json);window.open(targetUrl,'_blank');console.log('Success! Count:', orders.length);});
"""

p = subprocess.run(['node', '-e', script], capture_output=True, text=True)
print('STDOUT:', p.stdout)
print('STDERR:', p.stderr)
print('Exit code:', p.returncode)
