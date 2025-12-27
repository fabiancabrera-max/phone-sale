'use client';

import React, { useEffect } from 'react';
import { Box, Container, Typography, Button } from '@mui/material';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <Box className="min-h-screen flex items-center justify-center bg-slate-50">
            <Container maxWidth="sm" className="text-center">
                <Typography variant="h2" className="font-bold text-slate-800 mb-4">
                    ¡Ups! Algo salió mal
                </Typography>
                <Typography variant="body1" className="text-slate-600 mb-8">
                    Ha ocurrido un error inesperado. No te preocupes, estamos trabajando para solucionarlo.
                </Typography>
                <Box className="flex justify-center gap-4">
                    <Button
                        variant="contained"
                        onClick={() => reset()}
                        className="bg-blue-600 hover:bg-blue-700 rounded-xl px-8 py-3"
                        sx={{ textTransform: 'none', fontWeight: 'bold' }}
                    >
                        Intentar de nuevo
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={() => window.location.href = '/'}
                        className="border-slate-300 text-slate-600 rounded-xl px-8 py-3"
                        sx={{ textTransform: 'none', fontWeight: 'bold' }}
                    >
                        Volver al inicio
                    </Button>
                </Box>
            </Container>
        </Box>
    );
}
