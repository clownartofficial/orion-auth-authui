import type { VariantProps } from "class-variance-authority"
import { cva } from "class-variance-authority"

export { default as Alert } from "./Alert.vue"
export { default as AlertDescription } from "./AlertDescription.vue"
export { default as AlertTitle } from "./AlertTitle.vue"

export const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
  {
    variants: {
      variant: {
        default: "bg-bg-1 text-fg-0 border-border",
        destructive:
          "text-danger bg-danger-bg border-danger/30 [&>svg]:text-current *:data-[slot=alert-description]:text-danger/90",
        success:
          "text-success bg-success-bg border-success/30 [&>svg]:text-current *:data-[slot=alert-description]:text-success/90",
        warning:
          "text-warn bg-warn-bg border-warn/30 [&>svg]:text-current *:data-[slot=alert-description]:text-warn/90",
        info:
          "text-info bg-info-bg border-info/30 [&>svg]:text-current *:data-[slot=alert-description]:text-info/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

export type AlertVariants = VariantProps<typeof alertVariants>
