import { COLORS } from "@/constants/theme";

export function useThemeColor(
  props: { color?: string },
  colorName: keyof typeof COLORS,
) {
  return props.color ?? COLORS[colorName];
}
