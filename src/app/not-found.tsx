import Link from 'next/link';
import { Box, Container, Typography, Button } from '@mui/material';

export default function NotFound() {
    return (
        <Box className="min-h-screen flex items-center justify-center bg-slate-50">
            <Container maxWidth="sm" className="text-center">
                <Typography variant="h1" className="font-bold text-slate-800 mb-4" sx={{ fontSize: '6rem' }}>
                    404
                </Typography>
                <Typography variant="h4" className="font-bold text-slate-900 mb-6">
                    Página no encontrada
                </Typography>
                <Typography variant="body1" className="text-slate-600 mb-8">
                    Lo sentimos, el modelo que estás buscando no parece estar disponible o la dirección es incorrecta.
                </Typography>
                <Link href="/" passHref style={{ textDecoration: 'none' }}>
                    <Button
                        variant="contained"
                        size="large"
                        className="bg-blue-600 hover:bg-blue-700 rounded-xl px-8 py-3"
                        sx={{ textTransform: 'none', fontWeight: 'bold' }}
                    >
                        Volver al inicio
                    </Button>
                </Link>
            </Container>
        </Box>
    );
}
