import io

with io.open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    text = f.read()

old_fn = '''function isSettledOrHigher(st, raw) {
  if (raw && typeof raw === 'object') {
    if (raw.completed_at || raw.settlement_date || raw.settled_at || raw.repair_done_at || raw.delivered_at || raw.ngay_quyet_toan || raw.ngay_hoan_thanh || raw.completedDate) {
      return true;
    }
  }
  if (!st) return false;
  const s = norm(String(st));
  return s.includes('quyet toan') || 
         s.includes('hoan thanh') || 
         s.includes('giao xe') || 
         s.includes('thanh toan') || 
         s.includes('nghiem thu') || 
         s.includes('waiting_approval') || 
         s.includes('settled') || 
         s.includes('settlement') || 
         s.includes('completed') || 
         s.includes('closed') || 
         s.includes('paid') || 
         s.includes('waiting_payment') || 
         s.includes('delivered') ||
         s.includes('repair_done');
}'''

new_fn = '''function isSettledOrHigher(st, raw) {
  if (raw && typeof raw === 'object') {
    if (raw.completed_at || raw.settlement_date || raw.settled_at || raw.repair_done_at || raw.delivered_at || raw.ngay_quyet_toan || raw.ngay_hoan_thanh || raw.completedDate) {
      return true;
    }
  }
  if (!st) return false;
  const rawStr = String(st).toLowerCase();
  const s = norm(String(st));
  return s.includes('quyet toan') || 
         s.includes('hoan thanh') || 
         s.includes('giao xe') || 
         s.includes('thanh toan') || 
         s.includes('nghiem thu') || 
         s.includes('waiting approval') || 
         rawStr.includes('waiting_approval') || 
         s.includes('settled') || 
         s.includes('settlement') || 
         s.includes('completed') || 
         s.includes('closed') || 
         s.includes('paid') || 
         s.includes('waiting payment') || 
         rawStr.includes('waiting_payment') || 
         s.includes('delivered') ||
         s.includes('repair done') ||
         rawStr.includes('repair_done');
}'''

text = text.replace(old_fn, new_fn)

with io.open('_build/app_template2.html', 'w', encoding='utf-8') as f:
    f.write(text)

print('Updated isSettledOrHigher to handle space-normalized strings!')
