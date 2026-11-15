import io

with io.open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. newRecord
text = text.replace(
    'isReturnLevel1: false, isReturnLevel2: false, isReturned: false, returnLevelLabel: \'\', rejectReason: \'\',',
    'isReturnLevel1: false, isReturnLevel2: false, isReturned: false, isCancelled: false, returnLevelLabel: \'\', rejectReason: \'\','
)

# 2. parseFile1Sheet
text = text.replace(
    'rec.isReturned = f1RetStat.isReturned;\n    rec.returnLevelLabel = f1RetStat.returnLevelLabel;',
    'rec.isReturned = f1RetStat.isReturned;\n    rec.isCancelled = Boolean(f1RetStat.isCancelled);\n    rec.returnLevelLabel = f1RetStat.returnLevelLabel;'
)

# 3. parseDealerPortalJson
text = text.replace(
    'rec.isReturned = retStat.isReturned;\n    rec.returnLevelLabel = retStat.returnLevelLabel;',
    'rec.isReturned = retStat.isReturned;\n    rec.isCancelled = Boolean(retStat.isCancelled);\n    rec.returnLevelLabel = retStat.returnLevelLabel;'
)

with io.open('_build/app_template2.html', 'w', encoding='utf-8') as f:
    f.write(text)

print('Added rec.isCancelled in newRecord, parseFile1Sheet, and parseDealerPortalJson!')
