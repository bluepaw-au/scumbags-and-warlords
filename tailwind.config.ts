import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import plugin from 'tailwindcss/plugin';
import colors from 'tailwindcss/colors';
import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		colors: {
			transparent: 'transparent',
			current: 'currentColor',
			black: colors.black,
			white: colors.white,
			gray: colors.stone,
			sun: colors.yellow,
			sky: colors.sky,
			felt: colors.green,
		},
		extend: {
			fontFamily: {
				serif: ['Merriweather', 'serif'],
				sans: ['MerriweatherSans', 'serif'],
			},
		},

	},

	plugins: [
		typography, 
		forms,
		plugin(function({addBase,theme}){
			addBase({
				
			})
		})]
} satisfies Config;
