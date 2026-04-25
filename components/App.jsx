// ── APP ───────────────────────────────────────────────────
function App() {
  return (
    <>
      <ParticleBackground />
      <Hero />
      <QueBivia />
      <BiviaLines />
      <Servicios />
      <Proyectos />
      <Contacto />
      <GaleriaSection />
      <Footer />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
