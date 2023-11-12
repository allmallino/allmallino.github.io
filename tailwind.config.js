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
        'gray30%':'#0000004D',
        'gray40%':'#00000066',
        'halfblack':'#00000080',
        'lightblack':'#0000000F',
        'navy':'#000080FF',
        'dark':'#3A3B3CFF',
        'green':'#00C12BFF',
        'red':'#F50606',
        'textred':'#FF3333',
        'lightred':'#FF33331A',
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
      },
      fontSize: {
        xxs: ['10px', '13px']
      }
    },
  },
  plugins: [],
}