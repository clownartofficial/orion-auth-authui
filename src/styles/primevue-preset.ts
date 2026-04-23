import { definePreset } from '@primeuix/themes'
import Aura from '@primeuix/themes/aura'

const OrionPreset = definePreset(Aura, {
  primitive: {
    borderRadius: {
      none: '0',
      xs: '4px',
      sm: '6px',
      md: '8px',
      lg: '12px',
      xl: '16px',
    },
  },
  semantic: {
    transitionDuration: '0.2s',
    focusRing: {
      width: '2px',
      style: 'solid',
      color: 'var(--accent)',
      offset: '2px',
      shadow: 'none',
    },
    disabledOpacity: '0.5',
    formField: {
      paddingX: '0.75rem',
      paddingY: '0.5rem',
      borderRadius: '{border.radius.md}',
      focusRing: {
        width: '0',
        style: 'none',
        color: 'transparent',
        offset: '0',
        shadow: '0 0 0 2px color-mix(in srgb, var(--accent), transparent 80%)',
      },
    },
    overlay: {
      modal: {
        borderRadius: '{border.radius.lg}',
        padding: '1.25rem',
        shadow: 'var(--shadow-lg)',
      },
    },
    colorScheme: {
      light: {
        primary: {
          color: 'var(--accent)',
          contrastColor: '#ffffff',
          hoverColor: 'var(--accent-hi)',
          activeColor: 'var(--accent-lo)',
        },
        formField: {
          background: 'var(--bg-1)',
          disabledBackground: 'var(--bg-3)',
          borderColor: 'var(--border)',
          hoverBorderColor: 'var(--border-strong)',
          focusBorderColor: 'var(--accent)',
          invalidBorderColor: 'var(--danger)',
          color: 'var(--fg-0)',
          placeholderColor: 'var(--fg-3)',
          shadow: 'none',
        },
        text: {
          color: 'var(--fg-0)',
          hoverColor: 'var(--fg-0)',
          mutedColor: 'var(--fg-2)',
          hoverMutedColor: 'var(--fg-1)',
        },
        content: {
          background: 'var(--bg-1)',
          hoverBackground: 'var(--bg-3)',
          borderColor: 'var(--border)',
          color: 'var(--fg-0)',
        },
      },
      dark: {
        primary: {
          color: 'var(--accent)',
          contrastColor: 'var(--bg-0)',
          hoverColor: 'var(--accent-hi)',
          activeColor: 'var(--accent-lo)',
        },
        formField: {
          background: 'var(--bg-inset)',
          disabledBackground: 'var(--bg-3)',
          borderColor: 'var(--border)',
          hoverBorderColor: 'var(--border-strong)',
          focusBorderColor: 'var(--accent)',
          invalidBorderColor: 'var(--danger)',
          color: 'var(--fg-0)',
          placeholderColor: 'var(--fg-3)',
          shadow: 'none',
        },
        text: {
          color: 'var(--fg-0)',
          hoverColor: 'var(--fg-0)',
          mutedColor: 'var(--fg-2)',
          hoverMutedColor: 'var(--fg-1)',
        },
        content: {
          background: 'var(--bg-1)',
          hoverBackground: 'var(--bg-3)',
          borderColor: 'var(--border)',
          color: 'var(--fg-0)',
        },
      },
    },
  },
})

export default OrionPreset
