export const LogoFull = (props: React.ComponentProps<'svg'>) => {
  return (
    <svg
      viewBox="0 0 931.8 244"
      xmlns="http://www.w3.org/2000/svg"
      data-testid="default-full-logo"
      {...props}
    >
      <defs>
        <linearGradient id="octoPurple-1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#9b5de5"/>
          <stop offset="1" stopColor="#6a0dad"/>
        </linearGradient>
      </defs>
      <g transform="translate(99.9,0) scale(6.1)">
        <g transform="translate(6,4)">
          <path fill="url(#octoPurple-1)"
                d="M18 0c8.8 0 16 6.5 16 14.6 0 3.7-1.3 6.8-3.6 9 0 0-1.3 1.3-1.3 2.7 0 1.2 1 2.1 2.2 2.6 1.8.7 3.1 2.1 3.1 3.8 0 2.2-2.1 4.3-5.8 3.1-2.7-.8-5.4-3.1-7.8-5.7-2.4 2.6-5.1 4.9-7.8 5.7-3.7 1.2-5.8-1-5.8-3.1 0-1.7 1.3-3.1 3.1-3.8 1.2-.5 2.2-1.4 2.2-2.6 0-1.4-1.3-2.7-1.3-2.7-2.3-2.2-3.6-5.3-3.6-9C2 6.5 9.2 0 18 0z"/>
          <circle cx="13.5" cy="13" r="1.7" fill="#fff"/>
          <circle cx="22.5" cy="13" r="1.7" fill="#fff"/>
          <circle cx="13.5" cy="13" r="0.9" fill="#5b1aa8"/>
          <circle cx="22.5" cy="13" r="0.9" fill="#5b1aa8"/>
          <path d="M12 18c1.5 1.5 3.5 2.3 6 2.3s4.5-.8 6-2.3"
                fill="none" stroke="#5b1aa8" strokeWidth="1.5" strokeLinecap="round"/>
        </g>

        <g fill="#6a0dad" fontFamily="Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial"
           fontWeight="700">
          <text x="58" y="28" fontSize="22" letterSpacing="0.5">octo</text>
        </g>
      </g>
    </svg>
  );
};
