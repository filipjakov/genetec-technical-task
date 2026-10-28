import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

const tone = (light: string, dark: string) => ({
  value: { base: `{colors.${light}}`, _dark: `{colors.${dark}}` },
});

const config = defineConfig({
  conditions: {
    // Follow the OS setting with no script and no toggle, so the server HTML is already in the right mode.
    // Both are redefined: Chakra's default `light` (`:root &`) outranks a media-wrapped `dark`.
    dark: '@media (prefers-color-scheme: dark)',
    light: '@media (prefers-color-scheme: light)',
  },
  globalCss: {
    html: { colorScheme: 'light dark' },
  },
  theme: {
    semanticTokens: {
      colors: {
        severity: {
          info: tone('blue.600', 'blue.300'),
          low: tone('green.600', 'green.300'),
          medium: tone('yellow.600', 'yellow.300'),
          high: tone('orange.600', 'orange.300'),
          critical: tone('red.600', 'red.300'),
        },
        category: {
          access: tone('cyan.700', 'cyan.300'),
          video: tone('purple.600', 'purple.300'),
          intrusion: tone('pink.600', 'pink.300'),
          system: tone('gray.600', 'gray.400'),
        },
      },
    },
  },
});

/**
 * The Chakra system `@repo/ui` renders with: Chakra's defaults plus a colour token per
 * Severity (`severity.<severity>`) and per Category (`category.<category>`), each with a
 * light and a dark value. Dark mode follows the OS `prefers-color-scheme` setting.
 */
export const system = createSystem(defaultConfig, config);
