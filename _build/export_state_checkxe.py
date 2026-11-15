import io

with io.open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Export window.state right after const state = { ... };
text = text.replace(
    '  inventory: new Map(),\n  invFileName: \'\'\n};',
    '  inventory: new Map(),\n  invFileName: \'\'\n};\nwindow.state = state;'
)

# 2. Export window.loadCheckXeOrders
text = text.replace(
    'function loadCheckXeOrders(){',
    'function loadCheckXeOrders(){\n  window.loadCheckXeOrders = loadCheckXeOrders;'
)

with io.open('_build/app_template2.html', 'w', encoding='utf-8') as f:
    f.write(text)

print('Exported window.state and window.loadCheckXeOrders!')
