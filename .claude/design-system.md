# Design System & Vibe

## The "Vibe"
- **Aesthetic:** "Digital Journalism." Clean, high-contrast, text-forward.
- **Metaphor:** The "Spotlight." The user is in a dark room (or dimmed context), and the audio narrator shines a flashlight on the specific data or text being discussed.
- **Motion:** Smooth, fluid scrolling. Elements shouldn't "pop" in; they should slide or fade.

## Visual Rules

### Color Palette
- **Primary (Action/Focus):** Blue-500 (`#3b82f6`) - Used for the active spotlight ring and audio controls.
- **Background (Base):** Slate-50 (`#f8fafc`) to White (`#ffffff`).
- **Text (Body):** Slate-900 (`#0f172a`) for high readability.
- **Warnings:** Amber-500 - Used specifically for "User Interruption" toasts (when user scrolls manually).

### The "Spotlight" Mechanism
- **Behavior:** A full-screen overlay (`z-index: 40`) dims the content by 50%.
- **Cutout:** An SVG masking technique ("Hole Punch") creates a transparent window over the active element.
- **Focus Ring:** The active element gets a temporary `ring-4 ring-blue-400` pulse.

### UI Components
- **Audio Bar:** Fixed at bottom-right. Glassmorphism effect (`backdrop-blur-xl`). Rounded pills.
- **Chapter Markers:** Interactive list. Visual indication of "Past", "Current", and "Future" states.
- **Stat Cards:** Large typography for numbers. Must support "Source Badging" (clickable references).

### Accessibility
- **Reduced Motion:** Respect `prefers-reduced-motion` for the auto-scroll behavior.
- **Manual Override:** Users must ALWAYS be able to break the auto-scroll by touching the screen.