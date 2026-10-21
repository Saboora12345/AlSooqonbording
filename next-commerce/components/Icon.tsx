// Same stroke icons as kit/js/alsooq-ui.js (no emoji as icons). Add paths here as the app needs them.
const P: Record<string, string> = {
  shop: 'M4 8h16l-1 4a3 3 0 0 1-3 2.4H8A3 3 0 0 1 5 12z M4 8l1.4-3.2A2 2 0 0 1 7.2 3.6h9.6A2 2 0 0 1 18.6 4.8L20 8 M7 15v4.5A1.5 1.5 0 0 0 8.5 21h7a1.5 1.5 0 0 0 1.5-1.5V15',
  build: 'M3 21h18 M5 21V9l5-3 5 3v12 M15 21V12l4 2.2V21 M8.5 12h3M8.5 15.5h3',
  bus: 'M6.4 4h11.2A2.4 2.4 0 0 1 20 6.4v8.2a2.4 2.4 0 0 1-2.4 2.4H6.4A2.4 2.4 0 0 1 4 14.6V6.4A2.4 2.4 0 0 1 6.4 4z M4 11h16 M7 20v-1M17 20v-1',
  cap: 'M12 4L2.5 8.5 12 13l9.5-4.5z M6.5 10.5V15c0 1.4 2.5 2.8 5.5 2.8s5.5-1.4 5.5-2.8v-4.5 M21.5 8.5v5',
  wallet: 'M4 7.5A2.5 2.5 0 0 1 6.5 5H18a2 2 0 0 1 2 2v1 M20.5 12H16a2 2 0 0 0 0 4h4.5 M5.9 7.5h12.2a2.4 2.4 0 0 1 2.4 2.4v7.2a2.4 2.4 0 0 1-2.4 2.4H5.9a2.4 2.4 0 0 1-2.4-2.4V9.9a2.4 2.4 0 0 1 2.4-2.4z',
  truck: 'M3.9 7h8.2a1.4 1.4 0 0 1 1.4 1.4v6.2a1.4 1.4 0 0 1-1.4 1.4H3.9a1.4 1.4 0 0 1-1.4-1.4V8.4A1.4 1.4 0 0 1 3.9 7z M13.5 10h4l3 3v3h-7z M7 16.4a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2z M17.5 16.4a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2z',
  shield: 'M12 3 5 5.5V11c0 4.4 3 7.7 7 9 4-1.3 7-4.6 7-9V5.5z M9 11.5l2 2 3.5-3.8',
  box: 'M3 7.5 12 3l9 4.5v9L12 21l-9-4.5z M3 7.5 12 12l9-4.5M12 12v9',
  receipt: 'M6 3h12v18l-2.5-1.5L13 21l-2.5-1.5L8 21l-2-1.5z M9 8h6M9 12h6',
  chart: 'M4 20V4M4 20h16 M8 20v-6M12 20v-9M16 20v-4M20 20V8',
  tag: 'M4 11.5V5.5A1.5 1.5 0 0 1 5.5 4h6l8 8-6 6z M7.3 8.5a1.2 1.2 0 1 0 2.4 0 1.2 1.2 0 0 0-2.4 0z',
};
export function Icon({ name }: { name: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={P[name] ?? P.box} />
    </svg>
  );
}
