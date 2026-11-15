# -*- coding: utf-8 -*-
with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

in_place_block = """  // Cập nhật đè giao diện tại chỗ (Seamless in-place update) nếu bảng đã tồn tại
  if(options && options.inPlace && document.getElementById('checkXeTbody')){
    const tb = document.getElementById('checkXeTbody');
    const nf = document.getElementById('kpiNoFaultVal');
    const uc = document.getElementById('kpiUncheckedVal');
    const ck = document.getElementById('kpiCheckedVal');
    const rc = document.getElementById('kpiRecheckVal');
    const tt = document.getElementById('kpiTotalVal');
    const cd = document.getElementById('checkXeFilterCountDisplay');
    if(nf) nf.textContent = noFaultList.length;
    if(uc) uc.textContent = uncheckedList.length;
    if(ck) ck.textContent = checkedList.length;
    if(rc) rc.textContent = recheckList.length;
    if(tt) tt.textContent = totalAll;
    if(cd) cd.textContent = `Hiển thị ${filtered.length} / ${totalAll} xe`;
    if(tb) tb.innerHTML = rowsHtml || `<tr><td colspan="${state.checkXe.viewMode === 'card' ? 10 : 13}" style="text-align:center;padding:36px;color:var(--text-muted);font-size:13px">Không tìm thấy xe nào phù hợp với bộ lọc hiện tại.</td></tr>`;
    return;
  }"""

content = "".join(lines)
# Remove all occurrences first
content = content.replace(in_place_block, "")

# Now locate the EXACT place inside renderCheckXe right before:
# el.innerHTML = `
#     <style>
#       .custom-cat-container {
target_spot = "  el.innerHTML = `\n    <style>\n      .custom-cat-container {"
if target_spot in content:
    content = content.replace(target_spot, in_place_block + "\n\n" + target_spot)
    print("Placed in_place_block accurately inside renderCheckXe!")
else:
    print("target_spot not found!")

with open('_build/app_template2.html', 'w', encoding='utf-8') as f:
    f.write(content)
