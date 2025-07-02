/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#c49b61',
        secondary: '#f8f9fa',
        dark: '#2c2c2c',
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
        'josefin': ['Josefin Sans', 'sans-serif'],
        'great-vibes': ['Great Vibes', 'cursive'],
      },
      backgroundImage: {
        'hero-1': "url('/images/bg_1.jpg')",
        'hero-2': "url('/images/bg_2.jpg')",
        'hero-3': "url('/images/bg_3.jpg')",
        'about': "url('/images/about.jpg')",
      }
    },
  },
  plugins: [],
  // RTL support
  corePlugins: {
    // Enable all core plugins
  },
  variants: {
    extend: {
      // Add RTL variants
    }
  }
} 