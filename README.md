# Tedy Clivel — Software Engineer Portfolio

A bilingual, interactive portfolio for **Tedy Clivel Fokou Temfack**, a junior software engineer focused on reliable mobile and web products.

Built with React and Vite, the site presents engineering experience, selected projects, public GitHub work, and an interactive visual identity without sacrificing accessibility or responsive behaviour.

## Highlights

- English-first interface with a French language switcher.
- Selected-project showcase with case studies, external GitHub links, and full-screen image previews.
- Responsive project galleries: six projects are shown initially, with an option to reveal the full collection.
- Real technology logos for the engineering stack, including React, Flutter, React Native, TypeScript, Supabase, Next.js, AngularJS, and Three.js.
- Keyboard-accessible navigation, meaningful image alternative text, visible focus states, and reduced-motion support.
- Animated ASCII portrait and Three.js particle scenes.
- Cursor-driven Three.js background rift: moving the mouse tears open the particle surface and leaves a short closing trail.
- Scroll progress navigation, subtle ambient motion, and a custom portfolio scrollbar.
- Optional keyboard and touch-friendly robot game mode that turns the portfolio into an explorable experience.

## Tech stack

- React 19
- Vite 8
- Three.js
- React Bootstrap and Bootstrap
- Material UI icons
- React Router
- CSS

## Local development

Install dependencies:

```sh
npm install
```

Start the development server:

```sh
npm run dev
```

Create an optimized production build:

```sh
npm run build
```

Run the code-quality checks:

```sh
npm run lint
```

Preview the production build locally:

```sh
npm run preview
```

## Project structure

```text
src/
  components/       Portfolio sections, project modals, game mode, and Three.js scenes
  styles/           Component and global visual styles
  assets/projects/  Portfolio project assets bundled by Vite
public/assets/      Optimized screenshots organised by project
```

## Accessibility and performance

The interface is built around semantic links and buttons, descriptive labels, keyboard focus visibility, lazy-loaded project imagery, and responsive layouts. Motion-heavy effects respect the user’s `prefers-reduced-motion` setting. Three.js modules are loaded dynamically so the initial page can render before interactive visual effects initialise.

## Colour system

| Token | Value | Use |
| --- | --- | --- |
| Navy | `#0a192f` | Main background |
| Dark Navy | `#020c1b` | Deep surfaces and contrast |
| Light Navy | `#112240` | Cards and panels |
| Lightest Navy | `#233554` | Borders and elevated states |
| Slate | `#8892b0` | Secondary text |
| Lightest Slate | `#ccd6f6` | Primary text |
| Mint | `#64ffda` | Interactive accents |

## License

This repository is private and unlicensed. All rights reserved.
