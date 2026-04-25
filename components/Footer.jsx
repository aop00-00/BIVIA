// ── FOOTER ─────────────────────────────────────────────────
function Footer() {
  return (
    <footer>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Isotipo size={24} />
        <span style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: '14px', letterSpacing: '0.12em' }}>BIVIA</span>
        <span style={{ color: 'var(--stone)', fontSize: '12px', marginLeft: '8px' }}>Sistemas + Estrategia + Ejecución</span>
      </div>
      <div className="footer-copy">© 2025 BIVIA — Todos los derechos reservados</div>
    </footer>
  );
}
