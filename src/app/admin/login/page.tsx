'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/frontend/config/firebase';
import { useAuth } from '@/frontend/context/AuthContext';
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff, Lock, Email } from '@mui/icons-material';

export default function AdminLoginPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      router.push('/admin/dashboard');
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <Box className="min-h-screen flex items-center justify-center bg-slate-900">
        <CircularProgress />
      </Box>
    );
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Login exitoso, redirigir al dashboard
      router.push('/admin/dashboard');
    } catch (err: unknown) {
      console.error('Login error:', err);
      let errorMessage = 'Error al iniciar sesión.';

      const authError = err as { code?: string };

      if (
        authError.code === 'auth/invalid-credential' ||
        authError.code === 'auth/user-not-found' ||
        authError.code === 'auth/wrong-password'
      ) {
        errorMessage =
          'Credenciales incorrectas. Verifica tu email y contraseña.';
      } else if (authError.code === 'auth/too-many-requests') {
        errorMessage = 'Demasiados intentos fallidos. Intenta más tarde.';
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      className="min-h-screen flex items-center justify-center bg-slate-50"
      sx={{
        background: 'linear-gradient(135deg, #0f172a 0%, #334155 100%)',
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={10}
          className="p-8 rounded-2xl bg-white/95 backdrop-blur-sm"
          component="form"
          onSubmit={handleLogin}
        >
          <Box className="text-center mb-8">
            <Typography
              variant="h4"
              className="font-bold text-slate-800 mb-2"
              sx={{ fontWeight: 800 }}
            >
              Admin Panel
            </Typography>
            <Typography variant="body2" className="text-slate-500">
              Ingresa tus credenciales para continuar
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" className="mb-6 rounded-lg">
              {error}
            </Alert>
          )}

          <Box className="space-y-4">
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@example.com"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email className="text-slate-400" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                },
              }}
            />

            <TextField
              fullWidth
              label="Contraseña"
              variant="outlined"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock className="text-slate-400" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                },
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              className="py-3 mt-4 rounded-xl text-lg font-bold shadow-lg transform transition-transform active:scale-95"
              sx={{
                background: 'linear-gradient(to right, #2563eb, #4f46e5)',
                textTransform: 'none',
                height: 48,
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Ingresar'
              )}
            </Button>
          </Box>
        </Paper>

        <Typography
          variant="caption"
          className="block text-center mt-8 text-slate-400 opacity-60"
        >
          © 2024 Phone Sale - Secure Admin
        </Typography>
      </Container>
    </Box>
  );
}
