#!/usr/bin/env python3
from PIL import Image, ImageDraw, ImageFont
import os

# Create uploads/recipes directory if not exists
os.makedirs('public/uploads/recipes', exist_ok=True)

# Sample Turkish recipes with colors
recipes = [
    ('doner-kebab.jpg', 'Döner Kebab', '#8B4513'),
    ('adana-kebab.jpg', 'Adana Kebabı', '#DC143C'),
    ('iskender-kebab.jpg', 'İskender Kebab', '#CD853F'),
    ('lahmacun.jpg', 'Lahmacun', '#FF6347'),
    ('karniyarik.jpg', 'Karnıyarık', '#9932CC'),
    ('menemen.jpg', 'Menemen', '#FFD700'),
    ('su-boregi.jpg', 'Su Böreği', '#F0E68C'),
    ('manti.jpg', 'Mantı', '#FFA500'),
    ('baklava.jpg', 'Baklava', '#DAA520'),
    ('pilav.jpg', 'Bulgur Pilavı', '#DEB887')
]

print("🎨 Creating sample recipe images...")

for filename, title, color in recipes:
    # Create 800x600 image
    img = Image.new('RGB', (800, 600), color)
    draw = ImageDraw.Draw(img)
    
    # Try to use a decent font, fallback to default
    try:
        font = ImageFont.truetype('/System/Library/Fonts/Arial.ttf', 48)
        small_font = ImageFont.truetype('/System/Library/Fonts/Arial.ttf', 24)
    except:
        try:
            font = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 48)
            small_font = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 24)
        except:
            font = ImageFont.load_default()
            small_font = ImageFont.load_default()
    
    # Add title text
    text_bbox = draw.textbbox((0, 0), title, font=font)
    text_width = text_bbox[2] - text_bbox[0]
    text_height = text_bbox[3] - text_bbox[1]
    
    # Center the text
    x = (800 - text_width) // 2
    y = (600 - text_height) // 2
    
    # Add shadow for better readability
    draw.text((x+3, y+3), title, fill='black', font=font)
    # Add main text
    draw.text((x, y), title, fill='white', font=font)
    
    # Add 'MyCheff Sample' at bottom
    sample_text = 'MyCheff Sample Recipe'
    sample_bbox = draw.textbbox((0, 0), sample_text, font=small_font)
    sample_width = sample_bbox[2] - sample_bbox[0]
    draw.text((401, 551), sample_text, fill='black', font=small_font)
    draw.text((400, 550), sample_text, fill='white', font=small_font)
    
    # Save image
    img.save(f'public/uploads/recipes/{filename}', 'JPEG', quality=90)
    print(f'✅ Created: {filename}')

print('\n🎉 All recipe images created successfully!')
print('📁 Images saved to: public/uploads/recipes/') 