'use client';

import { useEffect } from 'react';

export default function HomePage() {
  useEffect(() => {
    window.location.replace('./site/index.html');
  }, []);

  return (
    <main style={{ minHeight: '100vh', background: '#12060b', color: '#fff', display: 'grid', placeItems: 'center', fontFamily: 'Arial, sans-serif' }}>
      <p>Loading Qatar Executive concept…</p>
    </main>
  );
}
