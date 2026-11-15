# -*- coding: utf-8 -*-
with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Remove the 4th script before </body>
tag = '<script>\n// =========================================================\n// HIỆU ỨNG TƯƠNG TÁC 3D MƯỢT MÀ CHO LOGO NT'
pos = html.find(tag)
if pos != -1:
    end = html.find('</script>', pos) + 9
    html = html[:pos] + html[end:]
    print("Removed standalone 4th script tag.")

# Now find the end of the 3rd script (the main app script)
main_script_end = html.rfind('</script>')
if main_script_end != -1:
    emblem_js = """
// =========================================================
// HIỆU ỨNG TƯƠNG TÁC 3D MƯỢT MÀ CHO LOGO NT (3D PERSPECTIVE)
// =========================================================
(function() {
  function setupEmblemInteraction() {
    const emblem = document.querySelector('.brand-emblem-wrap');
    if (!emblem) return;
    
    let isHovered = false;
    emblem.addEventListener('mouseenter', () => { isHovered = true; });
    emblem.addEventListener('mouseleave', () => {
      isHovered = false;
      emblem.style.transform = 'perspective(400px) rotateX(0deg) rotateY(0deg) scale(1)';
    });
    
    emblem.addEventListener('mousemove', (e) => {
      if (!isHovered) return;
      const rect = emblem.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotX = -(y / (rect.height / 2)) * 22;
      const rotY = (x / (rect.width / 2)) * 22;
      emblem.style.transform = `perspective(400px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.12)`;
    });
    
    emblem.addEventListener('click', () => {
      emblem.style.transition = 'transform 0.65s cubic-bezier(0.34, 1.56, 0.64, 1)';
      emblem.style.transform = 'perspective(400px) rotateY(360deg) scale(1.18)';
      setTimeout(() => {
        emblem.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease';
        emblem.style.transform = 'perspective(400px) rotateX(0deg) rotateY(0deg) scale(1)';
      }, 700);
    });
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupEmblemInteraction);
  } else {
    setupEmblemInteraction();
  }
})();
"""
    html = html[:main_script_end] + emblem_js + '\n' + html[main_script_end:]
    print("Injected emblem interaction into main script!")

with open('_build/app_template2.html', 'w', encoding='utf-8') as f:
    f.write(html)
