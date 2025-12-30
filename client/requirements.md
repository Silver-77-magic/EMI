## Packages
framer-motion | Smooth animations for page transitions and interactions
lucide-react | Iconography (already in stack but confirming usage)

## Notes
Tailwind Config - extend fontFamily:
fontFamily: {
  display: ["'Space Grotesk'", "sans-serif"],
  body: ["'DM Sans'", "sans-serif"],
}

Auth implementation uses session-based cookies via /api/login, /api/register, /api/user.
AI generation endpoint is /api/generate-image.
Cart state will be managed client-side using React Context/Storage.
