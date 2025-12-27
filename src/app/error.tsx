'use client';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
            <div style={{ textAlign: 'center' }}>
                <h2>¡Ups! Algo salió mal</h2>
                <p>Ha ocurrido un error inesperado.</p>
                <button
                    onClick={() => reset()}
                    style={{ padding: '10px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', marginRight: '10px' }}
                >
                    Intentar de nuevo
                </button>
                <button
                    onClick={() => window.location.href = '/'}
                    style={{ padding: '10px 20px', background: 'white', border: '1px solid #ccc', borderRadius: '8px', cursor: 'pointer' }}
                >
                    Volver al inicio
                </button>
            </div>
        </div>
    );
}
