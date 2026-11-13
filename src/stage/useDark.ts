import { useTheme } from '../theme'

/** Whether the theme in effect is dark, so the stage's theme matches the page:
 * the visitor's choice, or the system setting while nothing is chosen. */
export function useDark() {
  return useTheme().dark
}
