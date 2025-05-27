# Typography System - Airbnb Style Professional Design

## Overview
Bu proje Airbnb tarzında profesyonel bir typography sistemi kullanır. Sistem semantic isimlendirme, tutarlı spacing ve optimal readability için tasarlanmıştır.

## Quick Start

### Yeni Sistem (Önerilen)
```typescript
import { TEXT_STYLES } from '../constants';

// Component'te kullanım
<Text style={TEXT_STYLES.heading1}>Page Title</Text>
<Text style={TEXT_STYLES.bodyMedium}>Body text content</Text>
<Text style={[TEXT_STYLES.caption, { color: COLORS.textMuted }]}>Caption text</Text>
```

### Eski Sistem (Deprecated)
```typescript
// ❌ Artık kullanmayın
<Text style={{ fontSize: FONT_SIZE.MD, fontWeight: '500' }}>Text</Text>

// ✅ Bunun yerine kullanın
<Text style={TEXT_STYLES.bodyMedium}>Text</Text>
```

## Typography Hierarchy

### Display Sizes (Hero & Landing)
- `TEXT_STYLES.displayLarge` - 40px - Hero titles, landing pages
- `TEXT_STYLES.displayMedium` - 36px - Section headers
- `TEXT_STYLES.displaySmall` - 32px - Page titles

### Headings (Content Hierarchy)
- `TEXT_STYLES.heading1` - 28px - Main page headings
- `TEXT_STYLES.heading2` - 24px - Section headings
- `TEXT_STYLES.heading3` - 20px - Subsection headings
- `TEXT_STYLES.heading4` - 18px - Card titles, important labels

### Body Text (Content & UI)
- `TEXT_STYLES.bodyLarge` - 16px - Primary body text, important content
- `TEXT_STYLES.bodyMedium` - 14px - Standard body text, descriptions
- `TEXT_STYLES.bodySmall` - 12px - Secondary text, captions

### UI Components
- `TEXT_STYLES.buttonLarge` - 16px - Primary buttons
- `TEXT_STYLES.buttonMedium` - 14px - Secondary buttons
- `TEXT_STYLES.buttonSmall` - 12px - Small buttons, chips

### Labels & Navigation
- `TEXT_STYLES.labelLarge` - 14px - Form labels, important labels
- `TEXT_STYLES.labelMedium` - 12px - Standard labels
- `TEXT_STYLES.labelSmall` - 10px - Small labels, badges
- `TEXT_STYLES.tabLabel` - 11px - Bottom navigation labels
- `TEXT_STYLES.navigationTitle` - 17px - Navigation bar titles

### Special Cases
- `TEXT_STYLES.caption` - 10px - Image captions, fine print
- `TEXT_STYLES.overline` - 10px - Category labels, overlines (UPPERCASE)

## Common Use Cases

### Page Headers
```typescript
<Text style={TEXT_STYLES.heading1}>Welcome to MyCheff</Text>
<Text style={TEXT_STYLES.bodyMedium}>Discover amazing recipes</Text>
```

### Cards
```typescript
<Text style={TEXT_STYLES.heading4}>Recipe Title</Text>
<Text style={TEXT_STYLES.bodySmall}>Italian Cuisine</Text>
<Text style={TEXT_STYLES.caption}>25 min</Text>
```

### Buttons
```typescript
<Text style={[TEXT_STYLES.buttonLarge, { color: COLORS.white }]}>
  Get Started
</Text>
```

### Forms
```typescript
<Text style={TEXT_STYLES.labelMedium}>Email Address</Text>
<TextInput style={TEXT_STYLES.bodyMedium} />
```

## Migration Guide

### Step 1: Import TEXT_STYLES
```typescript
import { TEXT_STYLES, COLORS } from '../constants';
```

### Step 2: Replace Old Styles
```typescript
// Before
const styles = StyleSheet.create({
  title: {
    fontSize: FONT_SIZE.XL,
    fontWeight: '600',
    lineHeight: 24,
  },
  body: {
    fontSize: FONT_SIZE.MD,
    lineHeight: 20,
  }
});

// After
const styles = StyleSheet.create({
  title: {
    ...TEXT_STYLES.heading4,
    color: COLORS.textPrimary,
  },
  body: {
    ...TEXT_STYLES.bodyMedium,
    color: COLORS.textSecondary,
  }
});
```

### Step 3: Update Components
```typescript
// Before
<Text style={styles.title}>Title</Text>

// After
<Text style={[TEXT_STYLES.heading4, { color: COLORS.textPrimary }]}>Title</Text>
```

## Best Practices

### 1. Semantic Usage
- Heading'leri hierarchy'ye göre kullanın (h1 > h2 > h3 > h4)
- Body text için uygun boyutu seçin (large > medium > small)
- UI component'leri için özel stilleri kullanın

### 2. Color Combinations
```typescript
// Primary text
<Text style={[TEXT_STYLES.bodyMedium, { color: COLORS.textPrimary }]}>

// Secondary text
<Text style={[TEXT_STYLES.bodySmall, { color: COLORS.textSecondary }]}>

// Muted text
<Text style={[TEXT_STYLES.caption, { color: COLORS.textMuted }]}>
```

### 3. Accessibility
- Minimum 12px font size kullanın
- Yeterli contrast ratio sağlayın
- Line height'ları readability için optimize edilmiştir

### 4. Performance
- TEXT_STYLES spread operator ile kullanın
- Gereksiz style override'lardan kaçının
- StyleSheet.create() ile combine edin

## Examples in Components

### NavigationBar
```typescript
<Text style={[TEXT_STYLES.tabLabel, { color: isActive ? COLORS.primary : COLORS.textSecondary }]}>
  {tab.label}
</Text>
```

### ScreenHeader
```typescript
<Text style={[TEXT_STYLES.navigationTitle, { color: COLORS.textPrimary }]}>
  {title}
</Text>
```

### RecipeCard
```typescript
<Text style={[TEXT_STYLES.heading4, { color: COLORS.textPrimary }]}>
  {recipe.title}
</Text>
<Text style={[TEXT_STYLES.bodySmall, { color: COLORS.textSecondary }]}>
  {recipe.category}
</Text>
```

## Backward Compatibility

Eski FONT_SIZE değerleri hala çalışır ama deprecated'dir:
- `FONT_SIZE.XS` → `TEXT_STYLES.caption`
- `FONT_SIZE.SM` → `TEXT_STYLES.bodySmall`
- `FONT_SIZE.MD` → `TEXT_STYLES.bodyMedium`
- `FONT_SIZE.LG` → `TEXT_STYLES.bodyLarge`
- `FONT_SIZE.XL` → `TEXT_STYLES.heading4`

## Design Tokens

Sistem aşağıdaki design token'ları kullanır:
- **Font Family**: Inter (Regular, Medium, SemiBold, Bold)
- **Font Sizes**: 10px - 40px (responsive scaling)
- **Line Heights**: Optimal readability için calculated
- **Letter Spacing**: Airbnb standards'a göre fine-tuned

Bu sistem ile tutarlı, profesyonel ve accessible bir typography deneyimi sağlayabilirsiniz. 