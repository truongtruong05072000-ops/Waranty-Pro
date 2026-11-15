import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/renderCheckXe_full.js', 'r', encoding='utf-8') as f:
    code = f.read()

# Let's inspect the card mode row rendering (around index 13800 to 16000)
idx_card = code.find("if(state.checkXe.viewMode === 'card') {")
print("=== CARD ROW HTML ===")
print(code[idx_card:idx_card+2500])

print("\n=== TABLE ROW HTML ===")
idx_table = code.find("// MẶC ĐỊNH: CHẾ ĐỘ XEM CỘT CHI TIẾT")
print(code[idx_table:idx_table+3000])
