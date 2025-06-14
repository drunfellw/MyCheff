# MyCheff - Professional Recipe App 🍽️

A modern, cross-platform recipe application built with React Native, Expo, and TypeScript. Features beautiful UI components, responsive design, and professional architecture patterns.

## 🚀 Features

### ✨ User Experience
- **Responsive Design**: Optimized for phones, tablets, and web
- **Beautiful UI**: Modern design system with consistent styling
- **Smooth Animations**: Fluid transitions and micro-interactions
- **Cross-Platform**: iOS, Android, and Web support

### 🏗️ Architecture
- **TypeScript Support**: Type-safe development with comprehensive interfaces
- **Component-Based**: Reusable, maintainable components
- **Professional Structure**: Organized codebase following best practices
- **Constants & Themes**: Centralized design system

### 🛠️ Technical Stack
- **Framework**: React Native with Expo
- **Language**: JavaScript with TypeScript support
- **Icons**: Expo Vector Icons
- **Styling**: StyleSheet with responsive utilities
- **State Management**: React Hooks
- **Platform**: Cross-platform (iOS, Android, Web)

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (optional but recommended)

### Setup
```bash
# Clone the repository
git clone <repository-url>
cd mycheff-frontend

# Install dependencies
npm install

# Start the development server
npm start

# Run on specific platform
npm run ios      # iOS Simulator
npm run android  # Android Emulator
npm run web      # Web Browser
```

## 📁 Project Structure

```
mycheff-frontend/
├── App.tsx                 # Main application entry point
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
│
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── SearchBar.js   # Advanced search component
│   │   ├── ScrollMenu.js  # Horizontal category menu
│   │   ├── RecipeCard.js  # Recipe display card
│   │   └── NavigationBar.js # Bottom navigation
│   │
│   ├── screens/           # Application screens
│   │   └── HomeScreen.js  # Main home screen
│   │
│   ├── hooks/             # Custom React hooks
│   │   └── useCategories.ts # Category management hook
│   │
│   ├── services/          # Data services and API
│   │   └── mockData.ts    # Mock data for development
│   │
│   ├── types/             # TypeScript type definitions
│   │   └── index.ts       # All application types
│   │
│   ├── constants/         # Application constants
│   │   └── index.ts       # Colors, spacing, configuration
│   │
│   ├── utils/             # Utility functions
│   │   └── responsive.ts  # Responsive design utilities
│   │
│   └── styles/            # Global styles and themes
│       └── index.ts       # Global StyleSheet definitions
│
└── assets/                # Static assets
    ├── images/            # Image files
    └── icons/             # Custom icons
```

## 🎨 Design System

### Colors
```javascript
const COLORS = {
  primary: '#F93A3B',        // Brand red
  background: '#FBFBFE',     // Light background
  textPrimary: '#230606',    // Dark text
  textSecondary: '#9C9C9C',  // Muted text
  white: '#FFFFFF',          // Pure white
  border: '#E0E0E0',         // Light border
};
```

### Typography
- **Headings**: Inter font family, multiple weights
- **Body Text**: Responsive sizing with proper line heights
- **Responsive**: Scales with device dimensions

### Spacing
```javascript
const SPACING = {
  xs: 4,    sm: 8,    md: 12,
  lg: 16,   xl: 24,   xxl: 32,   xxxl: 48
};
```

## 🧩 Components

### SearchBar
Advanced search component with:
- Animated focus states
- Dual placeholder text
- Filter button integration
- Full keyboard support

### ScrollMenu
Horizontal category navigation:
- Smooth scrolling
- Active state indicators
- Icon + text labels
- Responsive sizing

### RecipeCard
Recipe display cards featuring:
- Image placeholders
- Recipe metadata
- Favorite functionality
- Responsive grid layout

### NavigationBar
Bottom navigation with:
- Icon + label tabs
- Active state highlighting
- Smooth animations

## 📱 Responsive Design

The app uses a comprehensive responsive system:

- **Breakpoints**: Phone (< 768px), Tablet (768-1024px), Large Tablet (> 1024px)
- **Grid System**: 2 columns (phone), 3 columns (tablet), 4 columns (large tablet)
- **Font Scaling**: Automatic scaling with min/max constraints
- **Spacing**: Device-appropriate spacing and padding

## 🔧 Development

### Available Scripts
```bash
npm start          # Start Expo development server
npm run android    # Run on Android
npm run ios        # Run on iOS
npm run web        # Run on Web
npm run eject      # Eject from Expo (irreversible)
```

### Code Quality
- **TypeScript**: Comprehensive type definitions
- **JSDoc**: Detailed component documentation
- **Consistent Naming**: Clear, descriptive naming conventions
- **Modular Architecture**: Separation of concerns

### Performance Optimizations
- **useCallback**: Memoized event handlers
- **useMemo**: Expensive calculations memoization
- **Responsive Loading**: Efficient image handling
- **Animation**: Native driver usage where possible

## 🚧 Future Enhancements

### Planned Features
- [ ] Recipe detail screens
- [ ] User authentication
- [ ] Favorites persistence
- [ ] Search filters
- [ ] Recipe creation
- [ ] Social sharing
- [ ] Offline support
- [ ] Push notifications

### Technical Improvements
- [ ] API integration
- [ ] State management (Redux/Zustand)
- [ ] Unit testing (Jest)
- [ ] E2E testing (Detox)
- [ ] Performance monitoring
- [ ] Analytics integration

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support, email support@mycheff.com or create an issue in this repository.

---

**Built with ❤️ using React Native, Expo, and TypeScript** 