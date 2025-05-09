
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				sans: ['DM Sans', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				// Cores personalizadas para o ARCA
				arca: {
					purple: '#0052CC', // Changed from #9b87f5 to a darker blue
					'dark-purple': '#003D99', // Adjusted to match the new blue theme
					'light-purple': '#4D94FF', // Adjusted to match the new blue theme
					'soft-purple': '#E5F0FF', // Adjusted to match the new blue theme
					'vivid-purple': '#1A75FF', // Adjusted to match the new blue theme
					blue: '#1EAEDB',
					'sky-blue': '#33C3F0',
					'dark-blue': '#0052CC', // Added darker blue
					'light-blue': '#4DD0E1', // Added lighter cyan/blue
					'cool-gray': '#aaadb0',
					'dark-gray': '#222222',
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				fadeIn: {
					from: { opacity: '0' },
					to: { opacity: '1' }
				},
				typing: {
					from: { width: '0' },
					to: { width: '100%' }
				},
				blink: {
					'50%': { borderColor: 'transparent' }
				},
				'star-movement-top': {
					'0%': { transform: 'translateX(0)' },
					'50%': { transform: 'translateX(75%)' },
					'100%': { transform: 'translateX(0)' }
				},
				'star-movement-bottom': {
					'0%': { transform: 'translateX(0)' },
					'50%': { transform: 'translateX(-75%)' },
					'100%': { transform: 'translateX(0)' }
				},
				'gradient-x': {
					'0%, 100%': {
						'background-position': '0% 50%'
					},
					'50%': {
						'background-position': '100% 50%'
					}
				},
				rainbow: {
					'0%': { backgroundPosition: '0% 50%' },
					'50%': { backgroundPosition: '100% 50%' },
					'100%': { backgroundPosition: '0% 50%' }
				},
				wave: {
					'0%': { transform: 'translateX(0)' },
					'100%': { transform: 'translateX(-50%)' }
				},
				'float-slow': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-15px)' }
				},
				'float-medium': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'float-fast': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-8px)' }
				},
				aurora: {
					from: {
						backgroundPosition: '50% 50%, 50% 50%',
					},
					to: {
						backgroundPosition: '350% 50%, 350% 50%',
					},
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fadeIn 0.5s ease-out forwards',
				typing: 'typing 3.5s steps(40, end), blink .75s step-end infinite',
				'star-movement-top': 'star-movement-top 6s ease-in-out infinite',
				'star-movement-bottom': 'star-movement-bottom 6s ease-in-out infinite',
				'gradient-x': 'gradient-x 3s ease infinite',
				'rainbow': 'rainbow 5s ease infinite',
				'wave': 'wave 15s linear infinite',
				'float-slow': 'float-slow 9s ease-in-out infinite',
				'float-medium': 'float-medium 7s ease-in-out infinite',
				'float-fast': 'float-fast 5s ease-in-out infinite',
				'aurora': 'aurora 60s linear infinite',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
