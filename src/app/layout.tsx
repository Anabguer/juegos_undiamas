import type { Metadata } from 'next'
import { Inter, Bebas_Neue, Oswald, Roboto_Condensed, Bangers, Creepster, Nosifer, Butcherman, Fascinate_Inline, Fascinate, Finger_Paint, Freckle_Face, Knewave, Londrina_Solid, Londrina_Shadow, Londrina_Sketch, Londrina_Outline, Permanent_Marker, Righteous, Russo_One, Staatliches, Ultra, Vampiro_One, Wendy_One, Zilla_Slab_Highlight, Zilla_Slab } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })
const bebasNeue = Bebas_Neue({ weight: '400', subsets: ['latin'] })
const oswald = Oswald({ subsets: ['latin'] })
const robotoCondensed = Roboto_Condensed({ subsets: ['latin'] })
const bangers = Bangers({ weight: '400', subsets: ['latin'] })
const creepster = Creepster({ weight: '400', subsets: ['latin'] })
const nosifer = Nosifer({ weight: '400', subsets: ['latin'] })
const butcherman = Butcherman({ weight: '400', subsets: ['latin'] })
const fascinateInline = Fascinate_Inline({ weight: '400', subsets: ['latin'] })
const fascinate = Fascinate({ weight: '400', subsets: ['latin'] })
const fingerPaint = Finger_Paint({ weight: '400', subsets: ['latin'] })
const freckleFace = Freckle_Face({ weight: '400', subsets: ['latin'] })
const knewave = Knewave({ weight: '400', subsets: ['latin'] })
const londrinaSolid = Londrina_Solid({ weight: '400', subsets: ['latin'] })
const londrinaShadow = Londrina_Shadow({ weight: '400', subsets: ['latin'] })
const londrinaSketch = Londrina_Sketch({ weight: '400', subsets: ['latin'] })
const londrinaOutline = Londrina_Outline({ weight: '400', subsets: ['latin'] })
const permanentMarker = Permanent_Marker({ weight: '400', subsets: ['latin'] })
const righteous = Righteous({ weight: '400', subsets: ['latin'] })
const russoOne = Russo_One({ weight: '400', subsets: ['latin'] })
const staatliches = Staatliches({ weight: '400', subsets: ['latin'] })
const ultra = Ultra({ weight: '400', subsets: ['latin'] })
const vampiroOne = Vampiro_One({ weight: '400', subsets: ['latin'] })
const wendyOne = Wendy_One({ weight: '400', subsets: ['latin'] })
const zillaSlabHighlight = Zilla_Slab_Highlight({ weight: '400', subsets: ['latin'] })
const zillaSlab = Zilla_Slab({ weight: '400', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Un Día Más - Juego de Supervivencia',
  description: 'Sobrevive el máximo número de días posible en un mundo apocalíptico',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  themeColor: '#0b132b',
  manifest: '/manifest.json',
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={`${inter.className} ${bebasNeue.className} ${oswald.className} ${robotoCondensed.className} ${bangers.className} ${creepster.className} ${nosifer.className} ${butcherman.className} ${fascinateInline.className} ${fascinate.className} ${fingerPaint.className} ${freckleFace.className} ${knewave.className} ${londrinaSolid.className} ${londrinaShadow.className} ${londrinaSketch.className} ${londrinaOutline.className} ${permanentMarker.className} ${righteous.className} ${russoOne.className} ${staatliches.className} ${ultra.className} ${vampiroOne.className} ${wendyOne.className} ${zillaSlabHighlight.className} ${zillaSlab.className}`}>
        {children}
      </body>
    </html>
  )
}
