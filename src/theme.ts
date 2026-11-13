import { useSyncExternalStore } from 'react'

/** The visitor's choice. `system` follows the system setting and stores nothing. */
export type ThemeChoice = 'system' | 'light' | 'dark'

/** The localStorage key; index.html and public/404.html read it before first paint. */
const KEY = 'badil-theme'
const QUERY = '(prefers-color-scheme: dark)'
const CHANGED = 'badil:theme'

const chosen = (v: string | null | undefined): ThemeChoice => (v === 'light' || v === 'dark' ? v : 'system')

/** Sets or removes `data-theme` on <html>: the one place the page's CSS and the stages read. */
function apply(choice: ThemeChoice) {
  const root = document.documentElement
  if (choice === 'system') root.removeAttribute('data-theme')
  else root.setAttribute('data-theme', choice)
  window.dispatchEvent(new Event(CHANGED))
}

/** The current choice, read from <html> (the head script set it from storage). */
export function themeChoice(): ThemeChoice {
  return chosen(document.documentElement.getAttribute('data-theme'))
}

/** Applies a choice and remembers it. Storage may be unavailable: the choice then lasts for this page view. */
export function setThemeChoice(choice: ThemeChoice) {
  apply(choice)
  try {
    if (choice === 'system') localStorage.removeItem(KEY)
    else localStorage.setItem(KEY, choice)
  } catch {
    // Nothing is remembered.
  }
}

// A choice made in another tab arrives as a storage event (key null: storage
// cleared). One listener for the page, whatever number of components subscribe.
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === KEY || e.key === null) apply(chosen(e.key === null ? null : e.newValue))
  })
}

function subscribe(notify: () => void) {
  const system = window.matchMedia(QUERY)
  window.addEventListener(CHANGED, notify)
  system.addEventListener('change', notify)
  return () => {
    window.removeEventListener(CHANGED, notify)
    system.removeEventListener('change', notify)
  }
}

/** `choice:dark`, one string so the store's snapshot is stable between changes. */
function snapshot() {
  const choice = themeChoice()
  const dark = choice === 'dark' || (choice === 'system' && window.matchMedia(QUERY).matches)
  return `${choice}:${dark ? 'dark' : 'light'}`
}

/** The visitor's choice and the theme in effect, live: the control, another tab, or the system setting. */
export function useTheme(): { choice: ThemeChoice; dark: boolean } {
  const [choice, effective] = useSyncExternalStore(subscribe, snapshot, () => 'system:light').split(':')
  return { choice: choice as ThemeChoice, dark: effective === 'dark' }
}
