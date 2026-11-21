import type { SVGProps } from 'react';

/**
 * Hand-rolled 20px icons on a 24-unit grid. Inlined rather than pulled from a
 * package so the icon weight on the critical path stays near zero.
 */
type IconProps = SVGProps<SVGSVGElement>;

const base: IconProps = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
};

export function GitHubIcon(props: IconProps) {
  return (
    <svg {...base} {...props} fill="currentColor" stroke="none">
      <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.6 9.6 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.85-2.34 4.7-4.57 4.95.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
    </svg>
  );
}

export function LinkedInIcon(props: IconProps) {
  return (
    <svg {...base} {...props} fill="currentColor" stroke="none">
      <path d="M4.98 3.5A2.5 2.5 0 1 0 5 8.5a2.5 2.5 0 0 0 0-5ZM3 9.75h4v11.25H3V9.75Zm6.5 0h3.83v1.54h.05c.53-.95 1.84-1.95 3.79-1.95 4.05 0 4.8 2.5 4.8 5.76V21h-4v-5.23c0-1.25-.02-2.86-1.78-2.86-1.78 0-2.05 1.35-2.05 2.77V21h-4V9.75Z" />
    </svg>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="2.75" y="4.75" width="18.5" height="14.5" rx="2.5" />
      <path d="m3.5 7.5 7.44 5.2a2 2 0 0 0 2.12 0l7.44-5.2" />
    </svg>
  );
}

export function CodeIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m8 7-5 5 5 5M16 7l5 5-5 5M13.5 4.5 10.5 19.5" />
    </svg>
  );
}

export function FileIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" />
      <path d="M14 3v5h5M9 14h6M9 17.5h4" />
    </svg>
  );
}

export function ArrowUpRightIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 12h16M14 6l6 6-6 6" />
    </svg>
  );
}

export function ArrowLeftIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M20 12H4M10 6l-6 6 6 6" />
    </svg>
  );
}

export function DownloadIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3.5v11M7.5 10.5 12 15l4.5-4.5M4.5 19.5h15" />
    </svg>
  );
}

export function PlayIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M8 5.5v13l10.5-6.5L8 5.5Z" />
    </svg>
  );
}

export function TerminalIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="2.75" y="4" width="18.5" height="16" rx="2.5" />
      <path d="m7 10 2.5 2L7 14M12.5 14.5h4.5" />
    </svg>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m20 20-4.2-4.2" />
    </svg>
  );
}

export function CommandIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M9 3a3 3 0 1 1-3 3h12a3 3 0 1 1-3-3v12a3 3 0 1 0 3 3H6a3 3 0 1 0 3-3V3Z" />
    </svg>
  );
}



export function CopyIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="9" y="9" width="11.5" height="11.5" rx="2.25" />
      <path d="M15 5.75A2.25 2.25 0 0 0 12.75 3.5h-7A2.25 2.25 0 0 0 3.5 5.75v7A2.25 2.25 0 0 0 5.75 15" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m4.5 12.5 5 5 10-11" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function SparkIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3v4.5M12 16.5V21M3 12h4.5M16.5 12H21M5.6 5.6l3.2 3.2M15.2 15.2l3.2 3.2M18.4 5.6l-3.2 3.2M8.8 15.2l-3.2 3.2" />
    </svg>
  );
}

export function StarIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m12 4 2.47 5.1 5.53.76-4.05 3.86 1.01 5.53L12 16.6l-4.96 2.65 1.01-5.53L4 9.86l5.53-.76L12 4Z" />
    </svg>
  );
}

export function ForkIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="6.5" cy="5" r="2.25" />
      <circle cx="17.5" cy="5" r="2.25" />
      <circle cx="12" cy="19" r="2.25" />
      <path d="M6.5 7.25v2.25a2.5 2.5 0 0 0 2.5 2.5h6a2.5 2.5 0 0 0 2.5-2.5V7.25M12 12v4.75" />
    </svg>
  );
}

export function ChatIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M21 11.5a7.5 7.5 0 0 1-7.5 7.5H9l-4.5 3v-3.9A7.5 7.5 0 0 1 9 4h4.5A7.5 7.5 0 0 1 21 11.5Z" />
    </svg>
  );
}

export function SendIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 12 20.5 4l-6 16.5L11 14l-7-2Z" />
    </svg>
  );
}

export function PinIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

export function RocketIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M13.5 3.5c3.5 0 7 3.5 7 7 0 0-1.2 4-5.5 7.5l-5.5-5.5C13 8.2 13.5 3.5 13.5 3.5Z" />
      <path d="M9.5 12.5 6 11l-2.5 2.5 3 1M11.5 14.5 13 18l2.5-2.5-1-3M6.5 17.5 4 20" />
    </svg>
  );
}

export const socialIconMap = {
  github: GitHubIcon,
  linkedin: LinkedInIcon,
  mail: MailIcon,
  code: CodeIcon,
  file: FileIcon,
} as const;
