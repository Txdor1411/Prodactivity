import Svg, { Circle, Path, Rect } from 'react-native-svg';

type IconProps = { size?: number; color: string; active?: boolean };

/** Today — 2×2 rounded squares (two emphasized). */
export function TodayIcon({ size = 22, color }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Rect x="3" y="3" width="8" height="8" rx="2.5" />
      <Rect x="13" y="3" width="8" height="8" rx="2.5" opacity={0.5} />
      <Rect x="3" y="13" width="8" height="8" rx="2.5" opacity={0.5} />
      <Rect x="13" y="13" width="8" height="8" rx="2.5" />
    </Svg>
  );
}

/** Habits — scattered small squares (mosaic motif). */
export function HabitsIcon({ size = 22, color, active }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={active ? color : 'none'} stroke={active ? 'none' : color} strokeWidth={2}>
      <Rect x="3" y="11" width="4" height="4" rx="1.2" />
      <Rect x="10" y="6" width="4" height="4" rx="1.2" />
      <Rect x="17" y="9" width="4" height="4" rx="1.2" />
      <Rect x="10" y="14" width="4" height="4" rx="1.2" />
    </Svg>
  );
}

/** Goals — target rings. */
export function GoalsIcon({ size = 22, color }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Circle cx="12" cy="12" r="8.5" />
      <Circle cx="12" cy="12" r="4" />
    </Svg>
  );
}

/** Insights — ascending bars. */
export function InsightsIcon({ size = 22, color }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round">
      <Path d="M5 19V11M12 19V5M19 19v-5" />
    </Svg>
  );
}

/** Settings — sliders. */
export function SettingsIcon({ size = 22, color, active }: IconProps) {
  const dot = active ? color : 'transparent';
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round">
      <Path d="M4 7h16M4 12h16M4 17h16" />
      <Circle cx="9" cy="7" r="2" fill={dot} />
      <Circle cx="15" cy="12" r="2" fill={dot} />
      <Circle cx="8" cy="17" r="2" fill={dot} />
    </Svg>
  );
}

export function CheckIcon({ size = 20, color = '#fff', width = 3 }: { size?: number; color?: string; width?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M5 13l4 4L19 7" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function PlusIcon({ size = 24, color = '#fff', width = 2.6 }: { size?: number; color?: string; width?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 5v14M5 12h14" stroke={color} strokeWidth={width} strokeLinecap="round" />
    </Svg>
  );
}

export function ChevronLeft({ size = 18, color }: { size?: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M15 5l-7 7 7 7" />
    </Svg>
  );
}

export function ChevronRight({ size = 18, color }: { size?: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M9 6l6 6-6 6" />
    </Svg>
  );
}

export function EditIcon({ size = 16, color }: { size?: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M4 20h4L18.5 9.5a2.1 2.1 0 0 0-3-3L5 17v3z" />
    </Svg>
  );
}

export function PlayIcon({ size = 20, color }: { size?: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="M8 5v14l11-7z" />
    </Svg>
  );
}

export function UploadIcon({ size = 26, color }: { size?: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M12 16V4M7 9l5-5 5 5" />
      <Path d="M5 16v3a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3" />
    </Svg>
  );
}

export function ArrowRight({ size = 18, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M5 12h14M13 6l6 6-6 6" />
    </Svg>
  );
}

export function CloseIcon({ size = 14, color }: { size?: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.6} strokeLinecap="round">
      <Path d="M6 6l12 12M18 6L6 18" />
    </Svg>
  );
}
