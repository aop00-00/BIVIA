function GaleriaSection() {
  const projectImages = [
    './uploads/Arquitectos.png',
    './uploads/Sitio-bodegas.png.png',
    './uploads/Sitio-Malpe.png.png',
    './uploads/Ecosistema-educativo.png.png',
    './uploads/E-commerce-electrolitos.png.png',
    './uploads/Plataforma-estudios.png.png',
    './uploads/BIVIA-bran1.jpg',
    './uploads/BIVIA-bran2.jpg',
    './uploads/BIVIA-websites-1.jpg',
    './uploads/BIVIA-websites-2.jpg',
    './uploads/BIVIA-websites-3.jpg',
    './uploads/BIVIA-websites-4.jpg',
    './uploads/BIVIAbran3.png',
    './uploads/BIVIAbran4.png',
    './uploads/BIVIAbran5.png',
    './uploads/BIVIAcom1.jpg',
    './uploads/BIVIAecom2.jpg',
    './uploads/BIVIAecom3.jpg',
  ];
  return (
    <section id="galeria" style={{ height: '600px', position: 'relative', overflow: 'hidden' }}>
      <InfiniteGallery images={projectImages} speed={0.8} />
    </section>
  );
}
