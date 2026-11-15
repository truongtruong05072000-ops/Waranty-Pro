# -*- coding: utf-8 -*-
import io, sys
sys.stdout.reconfigure(encoding='utf-8')

with io.open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add setCheckXeViewMode
target1 = '''window.setCheckXeColFilter = function(key, val){
  state.checkXe[key] = val;
  renderCheckXe();
};'''

replace1 = '''window.setCheckXeColFilter = function(key, val){
  state.checkXe[key] = val;
  renderCheckXe();
};

window.setCheckXeViewMode = function(mode){
  state.checkXe.viewMode = mode;
  renderCheckXe();
};'''

if target1 in content:
    content = content.replace(target1, replace1, 1)
    print("Added window.setCheckXeViewMode!")
else:
    print("Warning: target1 not found with exact newlines, trying with normalized newlines...")
    # try normalized
    target1_norm = target1.replace('\r\n', '\n')
    content_norm = content.replace('\r\n', '\n')
    if target1_norm in content_norm:
        content_norm = content_norm.replace(target1_norm, replace1.replace('\r\n', '\n'), 1)
        content = content_norm
        print("Added window.setCheckXeViewMode (normalized)!")
    else:
        print("ERROR: target1 still not found!")

# 2. Add noFaultList in renderCheckXe
target2 = '''function renderCheckXe(){
  const allOrders = state.checkXe.orders || [];
  const totalAll = allOrders.length;
  
  // Phân loại theo 4 quy tắc
  const uncheckedList = allOrders.filter(o => o.checkStatus.code === 'unchecked');
  const recheckList = allOrders.filter(o => o.checkStatus.code === 'recheck');
  const checkedList = allOrders.filter(o => o.checkStatus.code === 'checked');
  const normalList = allOrders.filter(o => o.checkStatus.code === 'normal');

  // Tổng số xe trong diện theo dõi lỗi
  const issueOrders = allOrders.filter(o => o.checkStatus.code !== 'normal');
  const totalIssue = issueOrders.length;'''

replace2 = '''function renderCheckXe(){
  const allOrders = state.checkXe.orders || [];
  const totalAll = allOrders.length;
  
  // Phân loại theo quy tắc nghiệp vụ
  const noFaultList = allOrders.filter(o => o.checkStatus.code === 'no_fault' || o.checkStatus.code === 'normal');
  const uncheckedList = allOrders.filter(o => o.checkStatus.code === 'unchecked');
  const recheckList = allOrders.filter(o => o.checkStatus.code === 'recheck');
  const checkedList = allOrders.filter(o => o.checkStatus.code === 'checked');
  const normalList = noFaultList;

  // Tổng số xe trong diện theo dõi lỗi (loại trừ xe không lỗi)
  const issueOrders = allOrders.filter(o => o.checkStatus.code !== 'no_fault' && o.checkStatus.code !== 'normal');
  const totalIssue = issueOrders.length;'''

if target2 in content:
    content = content.replace(target2, replace2, 1)
    print("Added noFaultList to renderCheckXe!")
else:
    target2_norm = target2.replace('\r\n', '\n')
    content_norm = content.replace('\r\n', '\n')
    if target2_norm in content_norm:
        content_norm = content_norm.replace(target2_norm, replace2.replace('\r\n', '\n'), 1)
        content = content_norm
        print("Added noFaultList to renderCheckXe (normalized)!")
    else:
        print("ERROR: target2 not found!")

with io.open('_build/app_template2.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Saved _build/app_template2.html successfully!")
