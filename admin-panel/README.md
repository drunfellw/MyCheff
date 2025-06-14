# MyCheff Admin Panel

Professional admin panel for MyCheff recipe management system built with Next.js 15, Material-UI, and TypeScript.

## 🚀 Features

- **Modern UI**: Beautiful Material-UI design with custom theme
- **Responsive Design**: Mobile-first responsive layout
- **Real-time Data**: React Query for efficient data fetching and caching
- **Form Management**: React Hook Form with validation
- **Data Tables**: Advanced DataGrid with sorting, filtering, and pagination
- **Multi-language Management**: Complete language administration
- **Recipe Management**: Full CRUD operations for recipes
- **User Management**: User administration and analytics
- **Category Management**: Recipe category administration
- **Analytics Dashboard**: Comprehensive statistics and insights
- **Type Safety**: Full TypeScript support

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI Library**: Material-UI (MUI) v6
- **State Management**: React Query (TanStack Query)
- **Forms**: React Hook Form
- **Language**: TypeScript
- **Styling**: Material-UI Theme System
- **HTTP Client**: Axios
- **Data Grid**: MUI X DataGrid

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Dashboard page
│   ├── languages/         # Language management
│   ├── recipes/           # Recipe management
│   ├── categories/        # Category management
│   ├── users/             # User management
│   ├── analytics/         # Analytics page
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── Layout/            # Layout components
│   └── Providers.tsx      # Global providers
├── lib/                   # Utilities and configurations
│   ├── api.ts            # API client and types
│   └── theme.ts          # Material-UI theme
└── types/                # TypeScript type definitions
```

## 🛠️ Installation

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MyCheff Backend API running

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd admin-panel
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

## 🔧 Environment Variables

Create a `.env.local` file with the following variables:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

## 📊 Features Overview

### Dashboard
- **Statistics Cards**: Key metrics and KPIs
- **Recent Activity**: Latest recipes, users, and activities
- **Quick Actions**: Fast access to common tasks
- **Analytics Charts**: Visual data representation

### Language Management
- **CRUD Operations**: Create, read, update, delete languages
- **Status Management**: Activate/deactivate languages
- **Sorting**: Custom sort order for display
- **Validation**: Form validation with error handling

### Recipe Management
- **Advanced Search**: Filter and search recipes
- **Category Assignment**: Organize recipes by categories
- **Multi-language Support**: Manage translations
- **Media Management**: Handle recipe images
- **Ingredient Management**: Recipe-ingredient relationships

### User Management
- **User Profiles**: View and edit user information
- **Subscription Status**: Premium user management
- **Activity Tracking**: User engagement metrics
- **Bulk Operations**: Mass user operations

### Category Management
- **Translation Support**: Multi-language categories
- **Icon Management**: Category icons and colors
- **Recipe Count**: Track recipes per category
- **Hierarchical Structure**: Category organization

### Analytics
- **Usage Statistics**: Platform usage metrics
- **Popular Content**: Most viewed recipes and categories
- **User Engagement**: User activity analysis
- **Performance Metrics**: System performance data

## 🎨 UI Components

### Layout Components
- **AdminLayout**: Main layout with sidebar navigation
- **Sidebar**: Collapsible navigation menu
- **Header**: Top navigation with user menu
- **Breadcrumbs**: Navigation breadcrumbs

### Data Components
- **DataGrid**: Advanced table with sorting and filtering
- **StatCard**: Statistics display cards
- **Charts**: Various chart components
- **Forms**: Reusable form components

### Utility Components
- **Loading States**: Loading indicators
- **Error Boundaries**: Error handling
- **Modals**: Dialog components
- **Notifications**: Toast notifications

## 🔒 Authentication

The admin panel includes:

- **JWT Token Management**: Automatic token handling
- **Route Protection**: Protected admin routes
- **Session Management**: Persistent login sessions
- **Role-based Access**: Admin-only features

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Tablet Support**: Tablet-friendly layouts
- **Desktop**: Full desktop experience
- **Adaptive UI**: Components adapt to screen size

## 🚀 Performance

- **Code Splitting**: Automatic code splitting with Next.js
- **Image Optimization**: Next.js image optimization
- **Caching**: React Query caching strategies
- **Bundle Analysis**: Optimized bundle sizes

## 🧪 Development

### Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Linting
npm run lint

# Type checking
npm run type-check
```

### Code Quality

- **TypeScript**: Full type safety
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Husky**: Git hooks for quality checks

## 🚀 Deployment

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker Deployment

```bash
# Build image
docker build -t mycheff-admin .

# Run container
docker run -p 3000:3000 mycheff-admin
```

### Environment Setup

Ensure the following environment variables are set:

- `NEXT_PUBLIC_API_URL`: Backend API URL
- `NEXTAUTH_SECRET`: NextAuth secret (if using NextAuth)
- `NEXTAUTH_URL`: Application URL (if using NextAuth)

## 🔧 Customization

### Theme Customization

Edit `src/lib/theme.ts` to customize the Material-UI theme:

```typescript
export const theme = createTheme({
  palette: {
    primary: {
      main: '#FF6B6B', // Your brand color
    },
    // ... other theme options
  },
});
```

### Adding New Pages

1. Create page in `src/app/[page-name]/page.tsx`
2. Add route to sidebar in `AdminLayout.tsx`
3. Create API functions in `src/lib/api.ts`
4. Add React Query hooks as needed

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please contact the development team.

## 🔗 Related Projects

- [MyCheff Backend](../mycheff-backend) - NestJS API backend
- [MyCheff Mobile](../mycheff-frontend) - React Native mobile app
