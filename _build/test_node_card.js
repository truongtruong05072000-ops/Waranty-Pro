
const car1 = {
  code: 'N54511-261104-009',
  plate: '29C2-07744',
  vin: 'RPXP1LHHVPE060424',
  model: 'Evo 200',
  diagnosis: 'LỖI ĐV',
  inspect_summary: 'Biển số: 29C2-07744 | Số khung: RPXP1LHHVPE060424 | ODO: | % PIN: Lỗi Esim LỖI ĐV Phụ kiện: Họ và tên tài xế: Y Đa Wik Kbuôr | Số điện thoại: 0886074790',
  faults: ['Lỗi Esim'],
  dms_warranty_code: 'N54511-WO-261104-0012',
  dms_warranty_status: 'checking'
};

const categories = [
  { id: 'all', name: 'Tất cả hạng mục', icon: '📋' },
  { id: 'topcover', name: 'Lỗi nút TopCover', icon: '🔘', keywords: ['topcover', 'top cover', 'nút top', 'nut top'] },
  { id: 'motor', name: 'Lỗi động cơ', icon: '⚡', keywords: ['động cơ', 'dong co', 'motor', 'số máy', 'so may'] },
  { id: 'rear_shock', name: 'Lỗi giảm sóc sau', icon: '🛞', keywords: ['giảm sóc sau', 'giảm xóc sau', 'giam soc sau', 'giam xoc sau', 'phuộc sau', 'nhún sau'] },
  { id: 'front_shock', name: 'Lỗi giảm xóc trước', icon: '🚲', keywords: ['giảm xóc trước', 'giảm sóc trước', 'giam xoc truoc', 'giam soc truoc', 'phuộc trước', 'nhún trước'] },
  { id: 'pin', name: 'Lỗi PIN', icon: '🔋', keywords: ['pin', 'battery', 'bms', 'cell', 'lắp pin', 'tháo pin'] },
  { id: 'charger', name: 'Lỗi sạc', icon: '🔌', keywords: ['sạc', 'sac', 'charger', 'củ sạc', 'bộ sạc'] },
  { id: 'esim', name: 'Lỗi Esim', icon: '📶', keywords: ['esim', 'e-sim', 'sim', 'mất sóng', 'mat song', '4g'] },
  { id: 'hmi', name: 'Lỗi HMI', icon: '🖥️', keywords: ['hmi', 'màn hình', 'man hinh', 'đồng hồ', 'dong ho', 'display'] },
  { id: 'mcu', name: 'Lỗi MCU', icon: '🎛️', keywords: ['mcu', 'điều khiển động cơ', 'dieu khien dong co', 'motor controller'] },
  { id: 'scu', name: 'Lỗi SCU', icon: '🔑', keywords: ['scu', 'smartkey', 'smart key', 'chìa khóa', 'chia khoa', 'khóa thông minh'] },
  { id: 'dcdc', name: 'Lỗi DC - DC', icon: '⚡', keywords: ['dc - dc', 'dc-dc', 'dcdc', 'hạ áp', 'ha ap', '12v'] },
  { id: 'harness', name: 'Lỗi bộ dây điện', icon: '🧵', keywords: ['bộ dây điện', 'bo day dien', 'dây điện', 'day dien', 'dây sườn', 'giắc điện', 'chập điện', 'harness'] },
  { id: 'other', name: 'Lỗi khác', icon: '🛠️', keywords: [] }
];

function matchCategoryFromFaults(faults, fallbackTxt = '') {
  const faultList = Array.isArray(faults) ? faults.filter(Boolean) : (typeof faults === 'string' && faults.trim() ? [faults.trim()] : []);
  
  if (faultList.length > 0) {
    const fCombined = faultList.join(' ').toLowerCase();
    for (let i = 1; i < categories.length - 1; i++) {
      const cat = categories[i];
      if (cat.keywords && cat.keywords.some(kw => fCombined.includes(kw)) || cat.name.toLowerCase() === fCombined || fCombined.includes(cat.name.toLowerCase())) {
        return cat;
      }
    }
    // Nếu có fault từ ServiceOS nhưng chưa nằm trong 12 nhóm chính, tạo nhóm chuẩn theo ServiceOS
    return { id: 'custom_' + faultList[0].toLowerCase().replace(/[^a-z0-9]/g, '_'), name: faultList[0], icon: '🛠️' };
  }

  // Nếu không có faults, mới dùng fallback text (không lấy chuỗi inspect_summary checklist)
  const cleanFallback = String(fallbackTxt || '').toLowerCase();
  for (let i = 1; i < categories.length - 1; i++) {
    const cat = categories[i];
    if (cat.keywords && cat.keywords.some(kw => cleanFallback.includes(kw))) {
      return cat;
    }
  }
  return categories[categories.length - 1]; // Lỗi khác
}

const cat1 = matchCategoryFromFaults(car1.faults, car1.diagnosis);
console.log('Car 1 Category:', cat1.name, cat1.icon);
