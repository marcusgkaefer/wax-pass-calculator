import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

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
			colors: {
				// Glassmorphism EWC-inspired color palette
				glass: {
					pink: {
						50: 'rgba(255, 240, 245, 0.8)',
						100: 'rgba(252, 231, 243, 0.9)',
						200: 'rgba(251, 207, 232, 0.8)',
						300: 'rgba(249, 168, 212, 0.7)',
						400: 'rgba(244, 114, 182, 0.8)',
						500: 'rgba(236, 72, 153, 0.9)',
						600: 'rgba(219, 39, 119, 0.8)',
						700: 'rgba(190, 24, 93, 0.9)',
						800: 'rgba(157, 23, 77, 0.8)',
						900: 'rgba(131, 24, 67, 0.9)',
					},
					cyan: {
						50: 'rgba(236, 254, 255, 0.8)',
						100: 'rgba(207, 250, 254, 0.9)',
						200: 'rgba(165, 243, 252, 0.8)',
						300: 'rgba(103, 232, 249, 0.7)',
						400: 'rgba(34, 211, 238, 0.8)',
						500: 'rgba(6, 182, 212, 0.9)',
						600: 'rgba(8, 145, 178, 0.8)',
						700: 'rgba(14, 116, 144, 0.9)',
						800: 'rgba(21, 94, 117, 0.8)',
						900: 'rgba(22, 78, 99, 0.9)',
					},
					purple: {
						50: 'rgba(250, 245, 255, 0.8)',
						100: 'rgba(243, 232, 255, 0.9)',
						200: 'rgba(233, 213, 255, 0.8)',
						300: 'rgba(196, 181, 253, 0.7)',
						400: 'rgba(167, 139, 250, 0.8)',
						500: 'rgba(139, 92, 246, 0.9)',
						600: 'rgba(124, 58, 237, 0.8)',
						700: 'rgba(109, 40, 217, 0.9)',
						800: 'rgba(91, 33, 182, 0.8)',
						900: 'rgba(76, 29, 149, 0.9)',
					},
					white: 'rgba(255, 255, 255, 0.8)',
					black: 'rgba(0, 0, 0, 0.8)',
					overlay: 'rgba(255, 255, 255, 0.1)',
					dark: 'rgba(0, 0, 0, 0.2)',
				},
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
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
				'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
				'glass-gradient-pink': 'linear-gradient(135deg, rgba(236, 72, 153, 0.1), rgba(219, 39, 119, 0.05))',
				'glass-gradient-cyan': 'linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(8, 145, 178, 0.05))',
				'glass-gradient-purple': 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(124, 58, 237, 0.05))',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			backdropBlur: {
				xs: '2px',
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
				'glass-float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-10px)' },
				},
				'glass-pulse': {
					'0%, 100%': { opacity: '0.8' },
					'50%': { opacity: '1' },
				},
				'glass-shimmer': {
					'0%': { transform: 'translateX(-100%)' },
					'100%': { transform: 'translateX(100%)' },
				},
				'glass-glow': {
					'0%, 100%': { boxShadow: '0 0 20px rgba(236, 72, 153, 0.3)' },
					'50%': { boxShadow: '0 0 40px rgba(236, 72, 153, 0.6)' },
				},
				'glass-slide-in': {
					'0%': { 
						transform: 'translateX(-100%) scale(0.8)',
						opacity: '0'
					},
					'100%': { 
						transform: 'translateX(0) scale(1)',
						opacity: '1'
					},
				},
				'glass-fade-in': {
					'0%': { 
						opacity: '0',
						transform: 'translateY(20px) scale(0.95)'
					},
					'100%': { 
						opacity: '1',
						transform: 'translateY(0) scale(1)'
					},
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'glass-float': 'glass-float 3s ease-in-out infinite',
				'glass-pulse': 'glass-pulse 2s ease-in-out infinite',
				'glass-shimmer': 'glass-shimmer 2s linear infinite',
				'glass-glow': 'glass-glow 2s ease-in-out infinite',
				'glass-slide-in': 'glass-slide-in 0.6s ease-out',
				'glass-fade-in': 'glass-fade-in 0.5s ease-out',
			},
			boxShadow: {
				'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
				'glass-pink': '0 8px 32px 0 rgba(236, 72, 153, 0.37)',
				'glass-cyan': '0 8px 32px 0 rgba(6, 182, 212, 0.37)',
				'glass-purple': '0 8px 32px 0 rgba(139, 92, 246, 0.37)',
				'glass-lg': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
				'glass-xl': '0 35px 60px -12px rgba(0, 0, 0, 0.35)',
			},
		}
	},
	plugins: [tailwindcssAnimate],
} satisfies Config;
