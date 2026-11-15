# -*- coding: utf-8 -*-
with open('_build/temp_main_test.js', 'r', encoding='utf-8') as f:
    text = f.read()

open_p = text.count('(')
close_p = text.count(')')
open_b = text.count('{')
close_b = text.count('}')
open_sq = text.count('[')
close_sq = text.count(']')

print(f"Parentheses: ( {open_p} vs ) {close_p} (diff: {open_p - close_p})")
print(f"Braces: {{ {open_b} vs }} {close_b} (diff: {open_b - close_b})")
print(f"Square brackets: [ {open_sq} vs ] {close_sq} (diff: {open_sq - close_sq})")
