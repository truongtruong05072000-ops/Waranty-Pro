# -*- coding: utf-8 -*-
import sys, re

# Read current app_template2.html to keep all underlying helper functions intact
with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    orig = f.read()

# Let's inspect what helper functions exist from line 220 to 800
print("Original template loaded. Size:", len(orig))
