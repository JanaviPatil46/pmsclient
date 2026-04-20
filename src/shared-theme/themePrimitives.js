// Color primitives — reference palette for Tailwind token mapping

// ========== Color Palettes ==========
export const brand = {
  50: 'hsl(210, 100%, 95%)',
  100: 'hsl(210, 100%, 92%)',
  200: 'hsl(210, 100%, 80%)',
  300: 'hsl(210, 100%, 65%)',
  400: 'hsl(210, 98%, 48%)',
  500: 'hsl(210, 98%, 42%)',
  600: 'hsl(210, 98%, 55%)',
  700: 'hsl(210, 100%, 35%)',
  800: 'hsl(210, 100%, 16%)',
  900: 'hsl(210, 100%, 21%)',
};

export const gray = {
  50: 'hsl(220, 35%, 97%)',
  100: 'hsl(220, 30%, 94%)',
  200: 'hsl(220, 20%, 88%)',
  300: 'hsl(220, 20%, 80%)',
  400: 'hsl(220, 20%, 65%)',
  500: 'hsl(220, 20%, 42%)',
  600: 'hsl(220, 20%, 35%)',
  700: 'hsl(220, 20%, 25%)',
  800: 'hsl(220, 30%, 6%)',
  900: 'hsl(220, 35%, 3%)',
};

export const green = {
  50: 'hsl(120, 80%, 98%)',
  100: 'hsl(120, 75%, 94%)',
  200: 'hsl(120, 75%, 87%)',
  300: 'hsl(120, 61%, 77%)',
  400: 'hsl(120, 44%, 53%)',
  500: 'hsl(120, 59%, 30%)',
  600: 'hsl(120, 70%, 25%)',
  700: 'hsl(120, 75%, 16%)',
  800: 'hsl(120, 84%, 10%)',
  900: 'hsl(120, 87%, 6%)',
};

export const orange = {
  50: 'hsl(45, 100%, 97%)',
  100: 'hsl(45, 92%, 90%)',
  200: 'hsl(45, 94%, 80%)',
  300: 'hsl(45, 90%, 65%)',
  400: 'hsl(45, 90%, 40%)',
  500: 'hsl(45, 90%, 35%)',
  600: 'hsl(45, 91%, 25%)',
  700: 'hsl(45, 94%, 20%)',
  800: 'hsl(45, 95%, 16%)',
  900: 'hsl(45, 93%, 12%)',
};

export const red = {
  50: 'hsl(0, 100%, 97%)',
  100: 'hsl(0, 92%, 90%)',
  200: 'hsl(0, 94%, 80%)',
  300: 'hsl(0, 90%, 65%)',
  400: 'hsl(0, 90%, 40%)',
  500: 'hsl(0, 90%, 30%)',
  600: 'hsl(0, 91%, 25%)',
  700: 'hsl(0, 94%, 18%)',
  800: 'hsl(0, 95%, 12%)',
  900: 'hsl(0, 93%, 6%)',
};

export const menu = {
  50: 'hsl(210, 100%, 97%)',
  100: 'hsl(210, 95%, 92%)',
  200: 'hsl(210, 90%, 85%)',
  300: 'hsl(210, 85%, 75%)',
  400: 'hsl(210, 80%, 65%)',  // Light mode menu item
  500: 'hsl(210, 75%, 55%)',  // Default (primary)
  600: 'hsl(210, 70%, 45%)',  // Hover
  700: 'hsl(210, 65%, 35%)',  // Active/Dark mode menu item
  800: 'hsl(210, 60%, 25%)',
  900: 'hsl(210, 55%, 15%)',
 
};

// ========== Color Schemes (reference only — tokens applied via index.css CSS vars) ==========
export const colorSchemes = {
  light: {
    background: 'hsl(0, 0%, 100%)',
    card: 'hsl(0, 0%, 100%)',
    primary: brand[400],
    muted: gray[50],
    border: gray[200],
  },
  dark: {
    background: gray[900],
    card: 'hsl(220, 30%, 7%)',
    primary: brand[400],
    muted: 'hsl(220, 30%, 7%)',
    border: gray[700],
  },
};

// ========== Typography & Shape ==========
export const typography = {
  fontFamily: 'Inter, sans-serif',
  h1: { fontSize: '3rem', fontWeight: 600, lineHeight: 1.2, letterSpacing: -0.5 },
  h2: { fontSize: '2.25rem', fontWeight: 600, lineHeight: 1.2 },
  h3: { fontSize: '1.875rem', lineHeight: 1.2 },
  h4: { fontSize: '1.5rem', fontWeight: 600, lineHeight: 1.5 },
  h5: { fontSize: '1.25rem', fontWeight: 600 },
  h6: { fontSize: '1.125rem', fontWeight: 600 },
  subtitle1: { fontSize: '1.125rem' },
  subtitle2: { fontSize: '0.875rem', fontWeight: 500 },
  body1: { fontSize: '0.875rem' },
  body2: { fontSize: '0.875rem', fontWeight: 400 },
  caption: { fontSize: '0.75rem', fontWeight: 400 },
};

export const shape = {
  borderRadius: 8,
};

export const shadows = ['none', 'var(--template-palette-baseShadow)'];