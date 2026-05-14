// ── APP ───────────────────────────────────────────────────
function App() {
  return (
    <>
      <ParticleBackground />
      <Hero />
      <QueBivia />
      <BiviaLines />
      <Servicios />
      <SkySection />
      {/* <Contacto /> */}
      <Footer />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
