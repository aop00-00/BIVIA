// ── APP ───────────────────────────────────────────────────
function App() {
  return (
    <>
      <ParticleBackground />
      <Hero />
      <QueBivia />
      <BiviaLines />
      <Servicios />
      {/* <Contacto /> */}
      <Footer />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
