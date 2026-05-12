/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'PingFang SC', 'Microsoft YaHei', 'sans-serif'],
      },
      colors: {
        night: '#061220',
        ink: '#0a1728',
        panel: '#102235',
        panelSoft: '#162b40',
        line: '#28415d',
        electric: '#1688ff',
        cyanGlow: '#68d8ff',
      },
      boxShadow: {
        card: '0 18px 45px rgba(0, 0, 0, .28)',
        dock: '0 -10px 32px rgba(0, 0, 0, .34)',
      },
    },
  },
  plugins: [],
};
