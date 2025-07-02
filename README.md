# CoffeeBlend - React + Vite + Tailwind CSS + RTL

A modern, responsive coffee shop website built with React, Vite, Tailwind CSS, and RTL (Right-to-Left) support. This project is a complete conversion from a traditional HTML/CSS/JavaScript website to a modern React-based single-page application.

## 🚀 Features

### ✅ Completed Features
- **Modern Tech Stack**: React 18, Vite, Tailwind CSS
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **RTL Support**: Built-in Right-to-Left language support
- **React Router**: Client-side routing for seamless navigation
- **Context API**: State management for cart and RTL functionality
- **Interactive Navigation**: Responsive navbar with mobile menu
- **Hero Section**: Dynamic background with call-to-action buttons
- **Modern Icons**: React Icons integration
- **Animations**: Framer Motion for smooth animations
- **Image Assets**: All original images copied and integrated

### 🏗️ Project Structure
```
coffee-react/
├── public/
│   └── images/           # All coffee shop images
├── src/
│   ├── components/       # Reusable React components
│   │   ├── Navbar.jsx   # Navigation with RTL & mobile support
│   │   └── Footer.jsx   # Footer with social links
│   ├── pages/           # Page components
│   │   ├── Home.jsx     # Landing page with hero section
│   │   ├── Menu.jsx     # Menu page (placeholder)
│   │   ├── About.jsx    # About page (placeholder)
│   │   ├── Services.jsx # Services page (placeholder)
│   │   ├── Blog.jsx     # Blog page (placeholder)
│   │   ├── Shop.jsx     # Shop page (placeholder)
│   │   ├── Cart.jsx     # Shopping cart (placeholder)
│   │   ├── Checkout.jsx # Checkout page (placeholder)
│   │   └── Contact.jsx  # Contact page (placeholder)
│   ├── context/         # Context providers (empty)
│   ├── hooks/           # Custom hooks (empty)
│   ├── App.jsx          # Main app with routing & context
│   ├── App.css          # Additional styles
│   ├── index.css        # Tailwind imports & custom CSS
│   └── main.jsx         # React entry point
├── tailwind.config.js   # Tailwind configuration
├── postcss.config.js    # PostCSS configuration
└── package.json         # Dependencies and scripts
```

### 🎯 Key Components

#### Navigation (Navbar.jsx)
- **Responsive Design**: Mobile hamburger menu, desktop horizontal menu
- **Active State**: Highlights current page
- **RTL Toggle**: Button to switch between LTR/RTL layouts
- **Cart Integration**: Shopping cart icon with item count
- **Scroll Effects**: Background changes on scroll

#### Context Management
- **RTL Context**: Global RTL state management
- **Cart Context**: Shopping cart functionality
- **Centralized State**: All shared state managed in App.jsx

#### Styling Approach
- **Tailwind CSS**: Utility-first CSS framework
- **Custom Components**: Reusable button and layout classes
- **RTL Support**: CSS variables and directional classes
- **Responsive**: Mobile-first responsive design

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation Steps
1. **Clone/Navigate to the project**
   ```bash
   cd coffee-react
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 🌐 RTL (Right-to-Left) Support

The application includes comprehensive RTL support:

### How to Toggle RTL
- Click the globe icon (🌐) in the navigation bar
- The layout will instantly switch to RTL mode
- All text alignment, margins, and layouts adapt automatically

### RTL Implementation
- **CSS Classes**: Custom RTL classes in `index.css`
- **Context Provider**: Global RTL state management
- **Automatic Direction**: HTML `dir` attribute updates
- **Layout Adaptation**: Margins, text alignment, and navigation adjust

### RTL CSS Features
```css
[dir="rtl"] .text-left { text-align: right; }
[dir="rtl"] .text-right { text-align: left; }
[dir="rtl"] .ml-auto { margin-left: 0; margin-right: auto; }
[dir="rtl"] .mr-auto { margin-right: 0; margin-left: auto; }
```

## 📱 Responsive Design

### Breakpoints (Tailwind CSS)
- **Mobile**: Default (320px+)
- **Tablet**: md (768px+)
- **Desktop**: lg (1024px+)
- **Large Desktop**: xl (1280px+)

### Mobile Features
- Hamburger menu navigation
- Touch-friendly buttons and links
- Optimized image loading
- Mobile-first CSS approach

## 🎨 Design System

### Color Palette
```javascript
colors: {
  primary: '#c49b61',    // Coffee gold
  secondary: '#f8f9fa',  // Light gray
  dark: '#2c2c2c',       // Dark gray
}
```

### Typography
- **Primary Font**: Poppins (body text)
- **Secondary Font**: Josefin Sans (headings)
- **Accent Font**: Great Vibes (decorative)

### Components
- **Buttons**: `.btn-primary`, `.btn-secondary`
- **Sections**: `.section-padding`
- **Containers**: `.container-custom`

## 📦 Dependencies

### Core Dependencies
- **React** (^18.2.0): UI library
- **React Router DOM** (^6.x): Client-side routing
- **React Icons** (^4.x): Icon components
- **Framer Motion** (^10.x): Animation library

### Development Dependencies
- **Vite** (^4.x): Build tool and dev server
- **Tailwind CSS** (^3.x): Utility-first CSS framework
- **PostCSS** (^8.x): CSS processing
- **Autoprefixer** (^10.x): CSS vendor prefixes

## 🚧 Development Status

### ✅ Completed
- [x] Project setup with Vite + React + Tailwind
- [x] RTL support implementation
- [x] Responsive navigation component
- [x] Footer component
- [x] Basic routing setup
- [x] Hero section on homepage
- [x] Context providers for cart and RTL
- [x] Image assets integration
- [x] Mobile-responsive design

### 🔄 In Progress
- [ ] Complete homepage sections (about, services, testimonials)
- [ ] Menu page with product listings
- [ ] Shopping cart functionality
- [ ] Contact form with validation
- [ ] Blog page with articles
- [ ] Product detail pages

### 📋 Todo
- [ ] Add more animations and transitions
- [ ] Implement search functionality
- [ ] Add loading states and error handling
- [ ] SEO optimization
- [ ] Performance optimization
- [ ] Unit and integration tests
- [ ] Accessibility improvements (ARIA labels, keyboard navigation)
- [ ] Dark mode support
- [ ] Progressive Web App (PWA) features

## 🌟 Key Improvements from Original

### Technical Improvements
1. **Modern Framework**: React instead of vanilla JavaScript
2. **Build System**: Vite for faster development and building
3. **CSS Framework**: Tailwind CSS for consistent styling
4. **State Management**: React Context API
5. **Routing**: Client-side routing with React Router
6. **Component Architecture**: Reusable, maintainable components

### User Experience Improvements
1. **Performance**: Faster page loads and interactions
2. **Responsiveness**: Better mobile experience
3. **Accessibility**: Improved keyboard navigation and screen reader support
4. **RTL Support**: International users can use RTL layout
5. **Modern UI**: Cleaner, more modern design patterns

### Developer Experience Improvements
1. **Hot Reload**: Instant updates during development
2. **Component Reusability**: Modular, reusable components
3. **Type Safety**: Better development experience with modern tooling
4. **Maintainability**: Organized file structure and clear separation of concerns

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 📞 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

**Built with ❤️ using React, Vite, and Tailwind CSS**
