import tailwindcss from '@tailwindcss/postcss'
import autoprefixer from 'autoprefixer'
import tailwindConfig from './tailwind.config.mjs'

export default {
  plugins: [
    tailwindcss(tailwindConfig),
    autoprefixer()
  ]
} 