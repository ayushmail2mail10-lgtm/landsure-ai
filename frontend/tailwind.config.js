/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          dark: '#0f172a',
          navy: '#1e293b',
          blue: '#1d4ed8',
          lightBlue: '#3b82f6',
          sky: '#e0f2fe',
          saffron: '#ea580c',
          gold: '#d97706',
          green: '#059669',
          emerald: '#10b981',
          crimson: '#dc2626',
          surface: '#f8fafc',
          border: '#e2e8f0'
        }
      },
      boxShadow: {
        'gov': '0 4px 6px -1px rgba(15, 23, 42, 0.07), 0 2px 4px -2px rgba(15, 23, 42, 0.05)',
        'gov-lg': '0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.04)',
      }
    },
  },
  plugins: [],
}
