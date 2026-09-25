/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			backdropBlur: {
				sm: '4px',
			},
			fontFamily: {
				display: ["Space Grotesk", "system-ui", "sans-serif"],
				body: ["Poppins", "system-ui", "sans-serif"],
			},
			colors: {
				violet: {
					950: "#3b0764",
				},
			},
			animation: {
				"spin-slow":     "spin 20s linear infinite",
				"spin-slow-rev": "spin 25s linear infinite reverse",
				"orb":           "orb-float 7s ease-in-out infinite",
				"orb-rev":       "orb-float-rev 9s ease-in-out infinite",
				"nebula":        "nebula-pulse 8s ease-in-out infinite",
				"pulse-ring":    "pulse-ring 2.5s cubic-bezier(0.4,0,0.6,1) infinite",
				"drift":         "drift 12s ease-in-out infinite",
			},
		},
	},
	plugins: [],
}
