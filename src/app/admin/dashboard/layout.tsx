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
    <Box className="min-h-screen bg-slate-50/50">
      <AppBar
        position="sticky"
        elevation={0}
        className="top-0 z-50"
        sx={{
          bgcolor: 'rgba(255, 255, 255, 0.8) !important',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid #f1f5f9',
          color: '#0f172a',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters className="h-16">
            <Link
              href="/admin/dashboard"
              className="no-underline flex items-center gap-3"
            >
              <Box
                className="flex items-center justify-center rounded-xl shadow-sm"
                sx={{
                  width: 40,
                  height: 40,
                  background:
                    'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                }}
              >
                <DashboardIcon sx={{ color: 'white', fontSize: 22 }} />
              </Box>
              <Box>
                <Typography
                  variant="h6"
                  className="font-bold tracking-tight text-slate-900 leading-none"
                >
                  PhoneSale
                </Typography>
                <Typography
                  variant="caption"
                  className="text-blue-600 font-bold uppercase tracking-wider text-[10px]"
                >
                  Control Panel
                </Typography>
              </Box>
            </Link>

            <Box className="flex-grow" />

            <Box className="flex items-center gap-4">
              <Box className="hidden md:block text-right">
                <Typography
                  variant="caption"
                  className="text-slate-400 block leading-none mb-1"
                >
                  Conectado como
                </Typography>
                <Typography
                  variant="body2"
                  className="text-slate-700 font-semibold leading-none"
                >
                  {user.email}
                </Typography>
              </Box>

              <Button
                variant="outlined"
                size="small"
                startIcon={<Logout sx={{ fontSize: 18 }} />}
                onClick={handleSignOut}
                sx={{
                  borderRadius: '12px',
                  borderColor: '#e2e8f0',
                  color: '#64748b',
                  px: 2.5,
                  py: 1,
                  textTransform: 'none',
                  fontWeight: 600,
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: '#fff1f2',
                    color: '#e11d48',
                    borderColor: '#fda4af',
                    transform: 'translateY(-1px)',
                  },
                }}
              >
                Salir
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Box component="main" className="py-4">
        <Container maxWidth="xl">{children}</Container>
      </Box>
    </Box>
  );
}
