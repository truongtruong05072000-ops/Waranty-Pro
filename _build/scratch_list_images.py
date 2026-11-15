import os, glob
from PIL import Image

# Check recent user images
images = glob.glob('C:/Users/nhu truong/.gemini/antigravity/brain/1642bb09-600f-467a-9926-cfa7d8c6626b/.user_uploaded/*')
images.sort(key=os.path.getmtime, reverse=True)
for img_path in images[:10]:
    try:
        im = Image.open(img_path)
        print(f"{os.path.basename(img_path)}: {im.size}, {im.format}")
    except Exception as e:
        print(f"{img_path}: {e}")
