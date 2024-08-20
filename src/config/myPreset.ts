import { definePreset } from '@primevue/themes';
import Aura from '@primevue/themes/aura';

const MyPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
      950: '#541a03'
    },
    colorScheme: {
      light: {
        primary: {
          color: '{primary.500}',
          contrastColor: '#ffffff',
          hoverColor: '{primary.600}'
        },
        text: {
          color: '{surface.0}',
          secondaryColor: '{surface.400}'
        }
      },
      dark: {
        primary: {
          color: '{primary.400}',
          contrastColor: '#ffffff',
          hoverColor: '{primary.300}'
        },
        text: {
          color: '{surface.0}',
          secondaryColor: '{surface.400}'
        }
      }
    }
  },
});

export default MyPreset;
