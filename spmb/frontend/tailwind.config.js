/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                serif: ['Lora', 'serif'],
            },
            colors: {
                brand: {
                    green: '#133E37', /* Dark Green dari Landing Page */
                    greenLight: '#2C5E55',
                    orange: '#F97316', /* Orange Tombol */
                    orangeHover: '#EA580C',
                    500: '#F97316', // Fallback for existing components using brand-500
                    600: '#EA580C', // Fallback
                    dark: '#133E37' // Fallback
                }
            }
        },
    },
    plugins: [],
}
