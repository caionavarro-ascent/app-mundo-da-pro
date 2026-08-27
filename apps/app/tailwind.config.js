const { coresApp } = require('@mdp/core/src/tokens');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        fundo: coresApp.fundo,
        superficie: coresApp.superficie,
        'superficie-2': coresApp.superficie2,
        texto: coresApp.texto,
        'texto-2': coresApp.texto2,
        marca: coresApp.marca,
        coral: coresApp.coral,
        verde: coresApp.verde,
      },
      fontFamily: {
        titulo: ['BricolageGrotesque_700Bold'],
        'titulo-semi': ['BricolageGrotesque_600SemiBold'],
        corpo: ['InstrumentSans_400Regular'],
        'corpo-medio': ['InstrumentSans_500Medium'],
        'corpo-forte': ['InstrumentSans_600SemiBold'],
        manuscrito: ['PatrickHand_400Regular'],
      },
    },
  },
  plugins: [],
};
