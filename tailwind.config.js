/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        'gray': '#f0f0f0',
        'transparentgray':'#0000001A',
        'halfgray':'#00000099',
        'halfblack':'#00000080',
        'lightblack':'#0000000F',
        'green':'#00C12BFF',
        'red':'#F50606',
        'yellow':'#F5DD06',
        'orange':'#F57906',
        'azure':'#06CAF5',
        'blue':'#063AF5',
        'purple':'#7D06F5',
        'pink':'#F506A4',
      },
      fontFamily:{
        logo:['Avenir'],
        body:['Plus Jakarta Sans', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

