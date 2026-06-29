/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'hblue': '#0EA5E9',
        'hblue-dark': '#0284C7',
        'hblue-light': '#38BDF8',
        'surface': '#0A0A0A',
        'surface-2': '#111111',
        'border-subtle': '#1A1A1A',
        'border': '#222222',
        'muted': '#888888',
        'muted-2': '#666666',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      letterSpacing: {
        'tightest': '-0.04em',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glow-blue': 'radial-gradient(ellipse at top, rgba(14,165,233,0.15) 0%, transparent 70%)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
