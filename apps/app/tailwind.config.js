const { coresApp } = require('@mdp/core/src/tokens');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // temáticos: valores vêm das variáveis do global.css (claro/escuro)
        fundo: 'var(--fundo)',
        superficie: 'var(--superficie)',
        'superficie-2': 'var(--superficie-2)',
        texto: 'var(--texto)',
        'texto-2': 'var(--texto-2)',
        'botao-prim': 'var(--botao-prim)',
        'botao-prim-texto': 'var(--botao-prim-texto)',
        'marca-legivel': 'var(--marca-legivel)',
        // fixos nos dois temas
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
