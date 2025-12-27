'use client';

import React from 'react';
import Link from 'next/link';

export default function NotFound() {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
            <div style={{ textAlign: 'center' }}>
                <h1 style={{ fontSize: '6rem', margin: 0 }}>404</h1>
                <h2>Página no encontrada</h2>
                <p>Lo sentimos, no pudimos encontrar lo que buscabas.</p>
                <Link href="/" style={{ padding: '10px 20px', background: '#2563eb', color: 'white', textDecoration: 'none', borderRadius: '8px' }}>
                    Volver al inicio
                </Link>
            </div>
        </div>
    );
}
