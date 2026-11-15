import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    content = f.read()

calc_code = r'''  // THỐNG KÊ TỶ LỆ TRẢ VỀ (CẤP 1 & CẤP 2 TRẢ VỀ)
  const monthRecs = recs.filter(r => r.cm === tYm || (!tYm && r.cm));
  const targetRecs = monthRecs.length > 0 ? monthRecs : recs;
  const totalClaimsCount = targetRecs.length;
  const returnL1List = targetRecs.filter(r => r.isReturnLevel1);
  const returnL2List = targetRecs.filter(r => r.isReturnLevel2);
  const totalReturnedList = targetRecs.filter(r => r.isReturned);
  const returnRate = totalClaimsCount > 0 ? (totalReturnedList.length / totalClaimsCount * 100) : 0;
  const isReturnRateOk = returnRate <= 1.0;
  const returnMetrics = {
    totalClaimsCount,
    returnL1Count: returnL1List.length,
    returnL2Count: returnL2List.length,
    totalReturnedCount: totalReturnedList.length,
    returnRate,
    isReturnRateOk,
    returnL1List,
    returnL2List,
    totalReturnedList
  };

  // THỐNG KÊ PHÂN LOẠI NHÓM KHÁCH HÀNG (GSM, BSHIP, KHÁCH LẺ, DOANH NGHIỆP)
  const custMap = {
    gsm: { id: 'gsm', name: 'GSM (Xanh SM)', tag: 'GSM', badgeClass: 'cust-gsm', color: '#06b6d4', rev: 0, cnt: 0, cars: 0, pct: 0 },
    bship: { id: 'bship', name: 'Bship', tag: 'BSHIP', badgeClass: 'cust-bship', color: '#10b981', rev: 0, cnt: 0, cars: 0, pct: 0 },
    retail: { id: 'retail', name: 'Khách lẻ', tag: 'Khách lẻ', badgeClass: 'cust-retail', color: '#38bdf8', rev: 0, cnt: 0, cars: 0, pct: 0 },
    corp: { id: 'corp', name: 'Doanh nghiệp khác', tag: 'Doanh nghiệp', badgeClass: 'cust-corp', color: '#a855f7', rev: 0, cnt: 0, cars: 0, pct: 0 }
  };
  for(const r of targetRecs){
    const gid = (r.customerGroup && r.customerGroup.id) || 'retail';
    if(custMap[gid]){
      custMap[gid].rev += r.total;
      custMap[gid].cnt++;
    }
  }
  const allCheckOrders = (state.checkXe && state.checkXe.orders) || [];
  allCheckOrders.forEach(o => {
    const gid = (o.customerGroup && o.customerGroup.id) || 'retail';
    if(custMap[gid]) custMap[gid].cars++;
  });
  const totalCustRev = Object.values(custMap).reduce((s, g) => s + g.rev, 0) || 1;
  Object.values(custMap).forEach(g => {
    g.pct = Math.round((g.rev / totalCustRev) * 100);
  });
  const customerBreakdown = {
    groups: Object.values(custMap),
    totalRev: totalCustRev,
    totalClaims: totalClaimsCount,
    totalCars: allCheckOrders.length
  };

  // CẢNH BÁO LỆNH SỬA CHỮA BẢO HÀNH CHƯA LÀM ĐỀ XUẤT
  const unsubmittedWarrantyOrders = allCheckOrders.filter(o => o.isUnsubmittedWarranty);'''

old_section = r'''  state.computed = {
    recs, months, months3, parts3, rev3, cnt3, total3, revAvg, cntAvg, parts3Money, labor3, scale,
    plan, planMajor, planMinorAgg, planPartsMoney, planLabor, planLaborRest, propsNeed, propsNeedBase, avgPerProp,
    target: t, expected, remaining, daysLeft, dailyRate: daysLeft ? remainingPlan / daysLeft : null,
    preparedInfo, coveredParts, partsShare, partsTarget, remainingParts, scale2, planOthersMoney, expectedPlan, remainingPlan,
    doneAgg, doneCnt, doneLabor, doneTotal, donePartsMoney,
    histDaily, curDaily, elapsedDays, cycleDays, ratio, projection, inCycle,
    // THỐNG KÊ TỶ LỆ TRẢ VỀ (CẤP 1 & CẤP 2 TRẢ VỀ)
  const monthRecs = recs.filter(r => r.cm === tYm || (!tYm && r.cm));
  const targetRecs = monthRecs.length > 0 ? monthRecs : recs;
  const totalClaimsCount = targetRecs.length;
  const returnL1List = targetRecs.filter(r => r.isReturnLevel1);
  const returnL2List = targetRecs.filter(r => r.isReturnLevel2);
  const totalReturnedList = targetRecs.filter(r => r.isReturned);
  const returnRate = totalClaimsCount > 0 ? (totalReturnedList.length / totalClaimsCount * 100) : 0;
  const isReturnRateOk = returnRate <= 1.0;
  const returnMetrics = {
    totalClaimsCount,
    returnL1Count: returnL1List.length,
    returnL2Count: returnL2List.length,
    totalReturnedCount: totalReturnedList.length,
    returnRate,
    isReturnRateOk,
    returnL1List,
    returnL2List,
    totalReturnedList
  };

  // THỐNG KÊ PHÂN LOẠI NHÓM KHÁCH HÀNG (GSM, BSHIP, KHÁCH LẺ, DOANH NGHIỆP)
  const custMap = {
    gsm: { id: 'gsm', name: 'GSM (Xanh SM)', tag: 'GSM', badgeClass: 'cust-gsm', color: '#06b6d4', rev: 0, cnt: 0, cars: 0, pct: 0 },
    bship: { id: 'bship', name: 'Bship', tag: 'BSHIP', badgeClass: 'cust-bship', color: '#10b981', rev: 0, cnt: 0, cars: 0, pct: 0 },
    retail: { id: 'retail', name: 'Khách lẻ', tag: 'Khách lẻ', badgeClass: 'cust-retail', color: '#38bdf8', rev: 0, cnt: 0, cars: 0, pct: 0 },
    corp: { id: 'corp', name: 'Doanh nghiệp khác', tag: 'Doanh nghiệp', badgeClass: 'cust-corp', color: '#a855f7', rev: 0, cnt: 0, cars: 0, pct: 0 }
  };
  for(const r of targetRecs){
    const gid = (r.customerGroup && r.customerGroup.id) || 'retail';
    if(custMap[gid]){
      custMap[gid].rev += r.total;
      custMap[gid].cnt++;
    }
  }
  const allCheckOrders = (state.checkXe && state.checkXe.orders) || [];
  allCheckOrders.forEach(o => {
    const gid = (o.customerGroup && o.customerGroup.id) || 'retail';
    if(custMap[gid]) custMap[gid].cars++;
  });
  const totalCustRev = Object.values(custMap).reduce((s, g) => s + g.rev, 0) || 1;
  Object.values(custMap).forEach(g => {
    g.pct = Math.round((g.rev / totalCustRev) * 100);
  });
  const customerBreakdown = {
    groups: Object.values(custMap),
    totalRev: totalCustRev,
    totalClaims: totalClaimsCount,
    totalCars: allCheckOrders.length
  };

  // CẢNH BÁO LỆNH SỬA CHỮA BẢO HÀNH CHƯA LÀM ĐỀ XUẤT
  const unsubmittedWarrantyOrders = allCheckOrders.filter(o => o.isUnsubmittedWarranty);

  verdict, vClass, vIcon, verdictDetail, bestRev3: rev3.length ? Math.max(...rev3) : 0,
    returnMetrics, customerBreakdown, unsubmittedWarrantyOrders,
    unknownStatus: [...unknownStatus.entries()], noDate
  };'''

new_section = calc_code + r'''

  state.computed = {
    recs, months, months3, parts3, rev3, cnt3, total3, revAvg, cntAvg, parts3Money, labor3, scale,
    plan, planMajor, planMinorAgg, planPartsMoney, planLabor, planLaborRest, propsNeed, propsNeedBase, avgPerProp,
    target: t, expected, remaining, daysLeft, dailyRate: daysLeft ? remainingPlan / daysLeft : null,
    preparedInfo, coveredParts, partsShare, partsTarget, remainingParts, scale2, planOthersMoney, expectedPlan, remainingPlan,
    doneAgg, doneCnt, doneLabor, doneTotal, donePartsMoney,
    histDaily, curDaily, elapsedDays, cycleDays, ratio, projection, inCycle,
    verdict, vClass, vIcon, verdictDetail, bestRev3: rev3.length ? Math.max(...rev3) : 0,
    returnMetrics, customerBreakdown, unsubmittedWarrantyOrders,
    unknownStatus: [...unknownStatus.entries()], noDate
  };'''

if old_section in content:
    content = content.replace(old_section, new_section, 1)
    print("Fixed computeAll calculations placement.")
else:
    print("Error: old_section not found!")
    sys.exit(1)

with open('_build/app_template2.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Saved app_template2.html successfully.")
