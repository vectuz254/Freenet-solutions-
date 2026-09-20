# Interactive Hero Section

A modern, high-performance interactive hero section built with **React**, **Tailwind CSS**, and **Framer Motion** (`motion/react` / `framer-motion`).

## 🚀 Key Features & Architecture

1. **Fonts & Global Animations**:
   - Google Fonts Inter loaded directly via CSS `@import`.
   - `--font-sans: 'Inter', ...` configured in CSS and Tailwind theme.
   - Smooth typewriter cursor blink keyframes animation (`@keyframes blink`).

2. **Responsive Hybrid Video Scrubbing & Mobile Playback**:
   - **Desktop (`>= 1024px`)**: Interactive video scrubbing bound to `window` `mousemove`. Computes scrub delta with `(delta / window.innerWidth) * 0.8 * video.duration` and synchronizes with a native `seeked` event listener.
   - **Mobile (`< 1024px`)**: Scrubbing is automatically disabled, triggering looping playback via `video.play()`.

3. **Interactive Navigation**:
   - Brand logo with `Mainframe®` and asterisk `&#10033;`.
   - Centered desktop links (`Labs`, `Studio`, `Openings`, `Shop`) separated by `<span className="opacity-40">,&nbsp;</span>` with smooth opacity hover states.
   - Desktop call-to-action `"Get in touch"` with underline hover styling.
   - Animated 3-bar hamburger button smoothly transforming into an 'X' (`rotate-45 translate-y-[7px]` / `-rotate-45 -translate-y-[7px]`).
   - Full-screen mobile navigation overlay with `bg-white/95 backdrop-blur-sm`.

4. **Typewriter Headline & Framer Motion Integration**:
   - Custom `useTypewriter` React hook (`speed = 38ms`, `startDelay = 600ms`) rendering `"we'd love to\nhear from you!"`.
   - Drop-in headline motion animation (`y: 20 -> y: 0`, duration `0.6s`).
   - Secondary description text delayed by `0.1s`.

5. **Multi-Select Service Pills & Reactive Feedback Banner**:
   - Multi-select pills across `Brand`, `Digital`, `Campaign`, and `Other`.
   - Active state styling with dark background (`bg-[#1C2E1E]`) and spring check icon animation (`type: "spring", stiffness: 300, damping: 20`).
   - Dynamic status banner using `<AnimatePresence mode="wait">`:
     - Empty: Placeholder displaying `"Please click to select services above."` at 50% opacity.
     - Active: Smooth height expansion showing `"Ready to inquire about: [selections]"` paired with a `"Let's Go"` action button.

---

## 📦 Getting Started

### 1. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
