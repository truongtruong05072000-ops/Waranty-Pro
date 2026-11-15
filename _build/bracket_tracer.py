# -*- coding: utf-8 -*-
with open('_build/temp_main_test.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Tokenize brackets outside strings and regex
stack = []
lines = text.split('\n')

in_string = False
str_char = ''
in_line_comment = False
in_block_comment = False

for line_no, line in enumerate(lines, 1):
    i = 0
    in_line_comment = False
    while i < len(line):
        ch = line[i]
        nxt = line[i+1] if i + 1 < len(line) else ''
        
        if in_block_comment:
            if ch == '*' and nxt == '/':
                in_block_comment = False
                i += 2
                continue
            i += 1
            continue
            
        if in_string:
            if ch == '\\':
                i += 2
                continue
            if ch == str_char:
                in_string = False
            i += 1
            continue
            
        if ch == '/' and nxt == '/':
            break # line comment
        if ch == '/' and nxt == '*':
            in_block_comment = True
            i += 2
            continue
            
        if ch in ('"', "'", '`'):
            in_string = True
            str_char = ch
            i += 1
            continue
            
        if ch in '({[':
            stack.append((ch, line_no, i))
        elif ch in ')}]':
            if not stack:
                print(f"Extra closing {ch} at line {line_no}:{i}")
            else:
                top, t_line, t_col = stack.pop()
                expected = {'(': ')', '{': '}', '[': ']'}[top]
                if ch != expected:
                    print(f"Mismatched bracket at line {line_no}:{i}: expected {expected} for {top} from line {t_line}")
                    break
        i += 1

print(f"Remaining unclosed items on stack: {len(stack)}")
for item in stack[-5:]:
    print(f"Unclosed {item[0]} at line {item[1]}:{item[2]}")
