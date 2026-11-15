# -*- coding: utf-8 -*-
import sys, re

with open('_build/logo_base64.txt', 'r', encoding='utf-8') as f:
    logo_base64 = f.read().strip()

with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Update <title> and add Favicon & Three.js CDN in <head>
head_addition = f'''<link rel="icon" type="image/jpeg" href="{logo_base64}">
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>'''

if '<link rel="icon"' not in html:
    html = html.replace('<meta name="viewport" content="width=device-width, initial-scale=1">', 
                        '<meta name="viewport" content="width=device-width, initial-scale=1">\n' + head_addition)
    print("Added favicon and Three.js CDN to <head>")

# 2. Update Brand Group in <header class="app-header">
old_brand = """    <div class="brand-group">
      <div class="brand-icon">⚡</div>
      <div>
        <div class="brand-title">
          BẢO HÀNH PRO
          <span class="brand-badge">v2.0 Modern</span>
        </div>
        <div class="brand-subtitle">Phân tích Bảo hành &amp; Lập Kế hoạch Doanh thu</div>
      </div>
    </div>"""

new_brand = f"""    <div class="brand-group">
      <div class="brand-3d-emblem-wrap" id="brand3dContainer" title="Logo 3D NT - Rê chuột để tương tác xoay 3D">
        <canvas id="canvas3dLogo" width="46" height="46"></canvas>
        <img class="brand-logo-img" src="{logo_base64}" alt="NT Logo">
      </div>
      <div>
        <div class="brand-title">
          NT BẢO HÀNH PRO
          <span class="brand-badge" id="badge3DTag">v3.0 3D PRO</span>
        </div>
        <div class="brand-subtitle">Hệ thống Quản trị &amp; Phân tích Bảo hành Xe điện Chuyên sâu</div>
      </div>
    </div>"""

if old_brand in html:
    html = html.replace(old_brand, new_brand)
    print("Updated brand group with 3D logo container!")
else:
    print("Warning: old_brand not matched exactly, trying regex...")
    pattern = re.compile(r'<div class="brand-group">.*?</div>\s*</div>\s*</div>', re.DOTALL)
    if pattern.search(html):
        html = pattern.sub(new_brand, html, count=1)
        print("Replaced brand group via regex!")

# 3. Update Gate screen with the luxury NT logo
old_gate_logo = '<div class="gate-logo">🔒</div>'
new_gate_logo = f'''<div class="gate-logo" style="width:84px;height:84px;border-radius:50%;overflow:hidden;border:2.5px solid #38bdf8;box-shadow:0 0 25px rgba(56,189,248,0.4);margin:0 auto 14px;background:#090d16">
  <img src="{logo_base64}" alt="NT Logo" style="width:100%;height:100%;object-fit:cover;display:block">
</div>'''

if old_gate_logo in html:
    html = html.replace(old_gate_logo, new_gate_logo)
    print("Updated gate modal logo!")

# 4. Insert 3D Background Canvas right after <body>
if '<canvas id="bg3dCanvas"' not in html:
    bg_canvas_html = '<canvas id="bg3dCanvas" style="position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:-1;pointer-events:none;opacity:0.38"></canvas>'
    html = html.replace('<body>', '<body>\n' + bg_canvas_html)
    print("Added bg3dCanvas after <body>")

# 5. Add 3D WebGL Three.js script at the end of scripts
threejs_init_script = f"""
// =====================================================================
// THREE.JS 3D INTERACTIVE EMBLEM & AMBIENT TELEMETRY MATRIX (NT BRAND)
// =====================================================================
(function() {{
  const LOGO_DATA_URI = "{logo_base64}";
  
  // 1. Interactive 3D NT Coin Emblem in Brand Header
  function init3DLogo() {{
    const canvas = document.getElementById('canvas3dLogo');
    if (!canvas || !window.THREE) return;
    
    try {{
      const renderer = new THREE.WebGLRenderer({{ canvas: canvas, alpha: true, antialias: true }});
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(46, 46);
      
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
      camera.position.set(0, 0, 3.4);
      
      // Ánh sáng mô phỏng kim loại sáng bóng (Chrome / Metallic)
      const ambLight = new THREE.AmbientLight(0xffffff, 0.7);
      scene.add(ambLight);
      
      const dirLight1 = new THREE.DirectionalLight(0x38bdf8, 2.8);
      dirLight1.position.set(2, 3, 4);
      scene.add(dirLight1);
      
      const dirLight2 = new THREE.DirectionalLight(0xffffff, 1.8);
      dirLight2.position.set(-2, -1, 3);
      scene.add(dirLight2);
      
      // Nạp Texture Logo NT của người dùng
      const loader = new THREE.TextureLoader();
      loader.load(LOGO_DATA_URI, function(texture) {{
        texture.center.set(0.5, 0.5);
        texture.rotation = 0;
        
        // Mặt trước và mặt sau: Texture Logo NT
        const faceMat = new THREE.MeshStandardMaterial({{
          map: texture,
          metalness: 0.9,
          roughness: 0.18,
          envMapIntensity: 1.2
        }});
        
        // Viền kim loại mạ Crom xanh bóng
        const sideMat = new THREE.MeshStandardMaterial({{
          color: 0x94a3b8,
          metalness: 0.98,
          roughness: 0.12,
          emissive: 0x0284c7,
          emissiveIntensity: 0.25
        }});
        
        // Khối huân chương 3D hình trụ (Cylinder)
        const geometry = new THREE.CylinderGeometry(1.28, 1.28, 0.18, 48);
        const materials = [sideMat, faceMat, faceMat];
        const coin = new THREE.Mesh(geometry, materials);
        coin.rotation.x = Math.PI / 2;
        scene.add(coin);
        
        // Ẩn ảnh 2D fallback khi WebGL sẵn sàng
        const fallbackImg = document.querySelector('.brand-logo-img');
        if (fallbackImg) fallbackImg.style.display = 'none';
        canvas.style.display = 'block';
        
        let targetRotX = Math.PI / 2;
        let targetRotY = 0;
        let isHovered = false;
        let spinVelocity = 0;
        
        // Tương tác chuột: rê chuột qua logo hoặc header để xoay 3D
        const container = document.getElementById('brand3dContainer');
        if (container) {{
          container.addEventListener('mouseenter', () => {{
            isHovered = true;
            spinVelocity = 0.28;
          }});
          container.addEventListener('mouseleave', () => {{
            isHovered = false;
            targetRotX = Math.PI / 2;
            targetRotY = 0;
          }});
          container.addEventListener('click', () => {{
            spinVelocity = 0.5; // Xoay vòng nhanh khi click
          }});
          
          window.addEventListener('mousemove', (e) => {{
            if (isHovered) {{
              const rect = container.getBoundingClientRect();
              const relX = (e.clientX - (rect.left + rect.width / 2)) / 50;
              const relY = (e.clientY - (rect.top + rect.height / 2)) / 50;
              targetRotY = relX * 0.9;
              targetRotX = (Math.PI / 2) + (-relY * 0.9);
            }}
          }});
        }}
        
        // Vòng lặp Render 60 FPS
        let angle = 0;
        function animate() {{
          requestAnimationFrame(animate);
          if (document.hidden) return;
          
          if (spinVelocity > 0.005) {{
            coin.rotation.z += spinVelocity;
            spinVelocity *= 0.94;
          }} else {{
            angle += 0.015;
            // Hiệu ứng bồng bềnh 3D nhẹ nhàng
            const idleX = Math.PI / 2 + Math.sin(angle * 0.8) * 0.12;
            const idleY = Math.cos(angle * 0.6) * 0.16;
            
            coin.rotation.x += ((isHovered ? targetRotX : idleX) - coin.rotation.x) * 0.1;
            coin.rotation.y += ((isHovered ? targetRotY : idleY) - coin.rotation.y) * 0.1;
          }}
          
          renderer.render(scene, camera);
        }}
        animate();
      }}, undefined, function(err) {{
        console.warn('3D Logo fallback to 2D image');
      }});
      
    }} catch(e) {{
      console.warn('WebGL 3D Logo error:', e);
    }}
  }}

  // 2. Ambient 3D Cyber Matrix Particles in Background
  function init3DBackground() {{
    const canvas = document.getElementById('bg3dCanvas');
    if (!canvas || !window.THREE) return;
    
    try {{
      const renderer = new THREE.WebGLRenderer({{ canvas: canvas, alpha: true, antialias: false, powerPreference: 'low-power' }});
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.setSize(window.innerWidth, window.innerHeight);
      
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
      camera.position.z = 400;
      
      // 120 điểm hạt phát sáng xanh Cyber kết nối
      const particleCount = 90;
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const velocities = [];
      
      for (let i = 0; i < particleCount; i++) {{
        positions[i * 3] = (Math.random() - 0.5) * 800;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 600;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 400;
        velocities.push({{
          x: (Math.random() - 0.5) * 0.35,
          y: (Math.random() - 0.5) * 0.35,
          z: (Math.random() - 0.5) * 0.2
        }});
      }}
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      
      const pMaterial = new THREE.PointsMaterial({{
        color: 0x38bdf8,
        size: 3.5,
        transparent: true,
        opacity: 0.65,
        blending: THREE.AdditiveBlending
      }});
      
      const particles = new THREE.Points(geometry, pMaterial);
      scene.add(particles);
      
      window.addEventListener('resize', () => {{
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }});
      
      let mouseX = 0, mouseY = 0;
      window.addEventListener('mousemove', (e) => {{
        mouseX = (e.clientX - window.innerWidth / 2) * 0.05;
        mouseY = (e.clientY - window.innerHeight / 2) * 0.05;
      }});
      
      function renderBg() {{
        requestAnimationFrame(renderBg);
        if (document.hidden) return;
        
        const pos = geometry.attributes.position.array;
        for (let i = 0; i < particleCount; i++) {{
          pos[i * 3] += velocities[i].x;
          pos[i * 3 + 1] += velocities[i].y;
          pos[i * 3 + 2] += velocities[i].z;
          
          if (pos[i * 3] < -400 || pos[i * 3] > 400) velocities[i].x *= -1;
          if (pos[i * 3 + 1] < -300 || pos[i * 3 + 1] > 300) velocities[i].y *= -1;
          if (pos[i * 3 + 2] < -200 || pos[i * 3 + 2] > 200) velocities[i].z *= -1;
        }}
        geometry.attributes.position.needsUpdate = true;
        
        particles.rotation.y += 0.0008;
        camera.position.x += (mouseX - camera.position.x) * 0.02;
        camera.position.y += (-mouseY - camera.position.y) * 0.02;
        camera.lookAt(scene.position);
        
        renderer.render(scene, camera);
      }}
      renderBg();
    }} catch(e) {{
      console.warn('3D Background error:', e);
    }}
  }}

  // Khởi động khi tải xong trang
  if (document.readyState === 'loading') {{
    document.addEventListener('DOMContentLoaded', () => {{
      init3DLogo();
      init3DBackground();
    }});
  }} else {{
    init3DLogo();
    init3DBackground();
  }}
}})();
"""

if 'THREE.JS 3D INTERACTIVE EMBLEM' not in html:
    html = html.replace('</body>', threejs_init_script + '\n</body>')
    print("Added Three.js 3D initialization script!")

# 6. Apply Cyber Titanium Luxury Theme in CSS
# Replace :root and top styling with luxury dark carbon + cyan chrome theme
dark_luxury_css = """/* ================= NT Cyber Titanium Luxury Design System ================= */
:root {
  --bg: #090d16;
  --surface: #101726;
  --surface-alt: #182235;
  --surface-glass: rgba(16, 23, 38, 0.85);
  --border: #1e293b;
  --border-glow: rgba(56, 189, 248, 0.28);
  --border-light: #24324a;
  --text-main: #f8fafc;
  --text-muted: #94a3b8;
  --text-light: #64748b;
  
  --brand-navy: #060911;
  --brand-navy-light: #0d1424;
  --primary: #38bdf8;
  --primary-hover: #0284c7;
  --primary-soft: rgba(56, 189, 248, 0.12);
  
  --emerald: #10b981;
  --emerald-soft: rgba(16, 185, 129, 0.12);
  --emerald-border: rgba(16, 185, 129, 0.35);
  
  --amber: #f59e0b;
  --amber-soft: rgba(245, 158, 11, 0.12);
  --amber-border: rgba(245, 158, 11, 0.35);
  
  --rose: #f43f5e;
  --rose-soft: rgba(244, 63, 94, 0.12);
  --rose-border: rgba(244, 63, 94, 0.35);
  
  --indigo: #6366f1;
  --indigo-soft: rgba(99, 102, 241, 0.12);
  
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;
  --radius-full: 9999px;
  
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 14px rgba(0, 0, 0, 0.45);
  --shadow-lg: 0 10px 30px -5px rgba(0, 0, 0, 0.65);
}

body {
  background-color: var(--bg);
  background-image: 
    radial-gradient(at 0% 0%, rgba(56, 189, 248, 0.08) 0px, transparent 50%),
    radial-gradient(at 100% 0%, rgba(99, 102, 241, 0.08) 0px, transparent 50%),
    radial-gradient(at 50% 100%, rgba(15, 23, 42, 0.6) 0px, transparent 70%);
  background-attachment: fixed;
  color: var(--text-main);
}

/* Header & 3D Logo Styling */
.app-header {
  background: rgba(9, 13, 22, 0.88);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border-glow);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

.brand-3d-emblem-wrap {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle, #1e293b 0%, #090d16 100%);
  border: 1.5px solid rgba(56, 189, 248, 0.6);
  box-shadow: 0 0 15px rgba(56, 189, 248, 0.35), inset 0 0 10px rgba(0, 0, 0, 0.8);
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
}
.brand-3d-emblem-wrap:hover {
  transform: scale(1.08);
  border-color: #38bdf8;
  box-shadow: 0 0 22px rgba(56, 189, 248, 0.6), inset 0 0 10px rgba(56, 189, 248, 0.4);
}
.brand-3d-emblem-wrap canvas {
  width: 46px;
  height: 46px;
  display: block;
}
.brand-logo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.brand-title {
  color: #ffffff;
  font-weight: 800;
  letter-spacing: 0.6px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.brand-badge {
  background: linear-gradient(135deg, #0284c7, #38bdf8);
  color: #ffffff;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(56, 189, 248, 0.4);
}
.brand-subtitle {
  color: var(--text-muted);
  font-size: 11.5px;
}

/* Nav Tabs */
.nav-tabbar {
  background: rgba(13, 19, 32, 0.92);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
}
.nav-tab {
  color: var(--text-muted);
  font-weight: 600;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}
.nav-tab:hover {
  color: #38bdf8;
  background: rgba(56, 189, 248, 0.05);
}
.nav-tab.active {
  color: #38bdf8;
  border-bottom-color: #38bdf8;
  background: rgba(56, 189, 248, 0.08);
  text-shadow: 0 0 12px rgba(56, 189, 248, 0.4);
}

/* Cards & Glassmorphism */
.card {
  background: var(--surface-glass);
  backdrop-filter: blur(14px);
  border: 1px solid var(--border-glow);
  box-shadow: var(--shadow-md);
  border-radius: var(--radius-lg);
}
.card-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}
.card-title {
  color: #ffffff;
}

/* Context / Stat Bar */
.context-bar {
  background: rgba(16, 23, 38, 0.9);
  border-bottom: 1px solid var(--border);
}

/* Inputs, Selects & Buttons */
.field-input, .field-select, .select {
  background: #0d1524;
  border: 1px solid #24324a;
  color: #f8fafc;
}
.field-input:focus, .field-select:focus, .select:focus {
  border-color: #38bdf8;
  box-shadow: 0 0 0 2px rgba(56, 189, 248, 0.2);
}

.btn {
  background: linear-gradient(135deg, #0284c7, #2563eb);
  color: #ffffff;
  border: 1px solid #38bdf8;
  box-shadow: 0 2px 10px rgba(37, 99, 235, 0.35);
  font-weight: 600;
}
.btn:hover {
  background: linear-gradient(135deg, #0369a1, #1d4ed8);
  box-shadow: 0 4px 14px rgba(56, 189, 248, 0.45);
}
.btn.secondary {
  background: #182235;
  color: #e2e8f0;
  border: 1px solid #334155;
  box-shadow: none;
}
.btn.secondary:hover {
  background: #24324a;
  border-color: #475569;
  color: #ffffff;
}

/* Tables */
.table-wrap table {
  background: transparent;
}
.table-wrap th {
  background: #0e1626 !important;
  color: #94a3b8;
  border-bottom: 1px solid #24324a;
  font-size: 11.5px;
  letter-spacing: 0.4px;
}
.table-wrap td {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  color: #e2e8f0;
}
.table-wrap tr:hover td {
  background: rgba(56, 189, 248, 0.04) !important;
}

/* CheckXe Rows */
.row-unchecked td {
  background: rgba(244, 63, 94, 0.04);
}
.row-recheck td {
  background: rgba(245, 158, 11, 0.04);
}
.row-checked td {
  background: rgba(16, 185, 129, 0.04);
}

/* KPI Cards */
.kpi-card {
  background: rgba(16, 23, 38, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

/* Custom Category Pills */
.custom-cat-container {
  background: rgba(16, 23, 38, 0.8) !important;
  border: 1px solid var(--border-glow) !important;
}
.custom-cat-header {
  color: #38bdf8 !important;
}
.custom-cat-pill {
  background: #141d2e !important;
  border: 1px solid #24324a !important;
  color: #cbd5e1 !important;
}
.custom-cat-pill:hover {
  background: #1e293b !important;
  border-color: #38bdf8 !important;
  color: #ffffff !important;
}
.custom-cat-pill.active {
  background: rgba(56, 189, 248, 0.15) !important;
  border-color: #38bdf8 !important;
  color: #38bdf8 !important;
  box-shadow: 0 0 12px rgba(56, 189, 248, 0.3) !important;
}
.date-filter-bar {
  background: rgba(16, 23, 38, 0.8) !important;
  border: 1px solid var(--border-glow) !important;
}
.date-chip {
  background: #141d2e !important;
  border: 1px solid #24324a !important;
  color: #cbd5e1 !important;
}
.date-chip:hover {
  background: #1e293b !important;
  color: #ffffff !important;
}
.date-chip.active {
  background: #0284c7 !important;
  border-color: #38bdf8 !important;
  color: #ffffff !important;
}
.scope-toggle-btn {
  background: #141d2e !important;
  border: 1px solid #24324a !important;
  color: #94a3b8 !important;
}
.scope-toggle-btn.active {
  background: #0284c7 !important;
  color: #ffffff !important;
  border-color: #38bdf8 !important;
}
.filter-header-row th {
  background: #0a1120 !important;
  border-bottom: 2px solid #24324a !important;
}
.col-filter-input, .col-filter-select {
  background: #0d1524 !important;
  border: 1px solid #24324a !important;
  color: #f8fafc !important;
}
.col-filter-input:focus, .col-filter-select:focus {
  border-color: #38bdf8 !important;
  box-shadow: 0 0 0 1px #38bdf8 !important;
}
.gate-modal {
  background: #101726 !important;
  border: 1px solid rgba(56, 189, 248, 0.4) !important;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.8) !important;
  color: #f8fafc !important;
}
.gate-modal h2 {
  color: #ffffff !important;
}
.gate-modal input {
  background: #090d16 !important;
  border: 1px solid #24324a !important;
  color: #ffffff !important;
}
"""

# Replace CSS system
old_css_root_pos = html.find('/* ================= Modern SaaS Design System ================= */')
if old_css_root_pos != -1:
    end_root_pos = html.find('/* Base & Layout */', old_css_root_pos)
    if end_root_pos == -1: end_root_pos = html.find('* { box-sizing:', old_css_root_pos)
    # Append dark luxury CSS right after the root
    html = html[:old_css_root_pos] + dark_luxury_css + '\n' + html[old_css_root_pos:]
    print("Injected Dark Luxury Cyber Titanium CSS system!")
else:
    # Just add before </style>
    style_end = html.find('</style>')
    html = html[:style_end] + '\n' + dark_luxury_css + '\n' + html[style_end:]
    print("Injected Dark Luxury CSS before </style>!")

with open('_build/app_template2.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Finished applying 3D redesign to app_template2.html!")
