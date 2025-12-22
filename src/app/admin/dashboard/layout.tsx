'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/frontend/context/AuthContext';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    Container,
    CircularProgress,
    IconButton,
} from '@mui/material';
import { Logout, Add, Dashboard as DashboardIcon } from '@mui/icons-material';
import Link from 'next/link';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading, signOut } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/admin/login');
        }
    }, [user, loading, router]);

    const handleSignOut = async () => {
        await signOut();
        router.push('/admin/login');
    };

    if (loading) {
        return (
            <Box className="min-h-screen flex items-center justify-center bg-slate-100">
                <CircularProgress />
            </Box>
        );
    }

    if (!user) {
        return null; // Redirecting...
    }

    return (
        <Box className="min-h-screen bg-slate-50">
            <AppBar position="static" elevation={0} className="bg-slate-900 border-b border-slate-800">
                <Container maxWidth="xl">
                    <Toolbar disableGutters className="h-16">
                        <Link href="/admin/dashboard" className="no-underline text-white flex items-center gap-2">
                            <DashboardIcon className="text-blue-500" />
                            <Typography variant="h6" className="font-bold tracking-tight">
                                PhoneSale Admin
                            </Typography>
                        </Link>

                        <Box className="flex-grow" />

                        <Box className="flex items-center gap-4">
                            <Typography variant="body2" className="text-slate-400 hidden sm:block">
                                {user.email}
                            </Typography>
                            <Button
                                variant="outlined"
                                color="inherit"
                                size="small"
                                startIcon={<Logout />}
                                onClick={handleSignOut}
                                className="border-slate-700 hover:bg-slate-800 text-slate-300"
                            >
                                Salir
                            </Button>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>

            <Box component="main" className="py-8">
                <Container maxWidth="xl">
                    {children}
                </Container>
            </Box>
        </Box>
    );
}
