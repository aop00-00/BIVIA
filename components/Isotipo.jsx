// ── ISOTIPO ──────────────────────────────────────────────
function Isotipo({ size = 32 }) {
  const s = size;
  return (
    <svg width={s} height={s} viewBox="0 0 28 28" fill="none">
      <rect x="0" y="0" width="5" height="22" fill="#C8B895" />
      <rect x="0" y="0" width="18" height="5" fill="#C8B895" />
      <rect x="17" y="17" width="8" height="8" fill="#8B744A" />
    </svg>
  );
}
