import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from "vite-plugin-pwa";

// you can copy the base structure of manifest object.
const manifestForPlugIn = {
  registerType:'prompt',
  includeAssests:['favicon.ico', "apple-touc-icon.png", "masked-icon.svg"],
  manifest:{
    name:"PhishShield",
    short_name:"phishshield",
    description:"I am a simple vite app",
    icons:[{
      src: '/Security.jpg',
      sizes:'192x192',
      type:'image/jpg',
      purpose:'favicon'
    },
      {
        src:'/Security.jpg',
        sizes:'512x512',
        type:'image/jpg',
        purpose:'favicon'
      },
      {
        src: '/Security.jpg',
        sizes:'180x180',
        type:'image/jpg',
        purpose:'apple touch icon',
      },
      {
        src: '/Security.jpg',
        sizes:'512x512',
        type:'image/jpg',
        purpose:'any maskable',
      }
    ],
    theme_color:'#171717',
    background_color:'#f0e7db',
    display:"standalone",
    scope:'/',
    start_url:"/",
    orientation:'portrait'
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA(manifestForPlugIn)
  ],
  server: {
    host: true,
    port: 3000
  },
  preview: {
    host: true,
    port: 3000
  }
});
