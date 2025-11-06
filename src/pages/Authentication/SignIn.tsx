import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { User } from '../../models/User';
import SecurityService from '../../services/securityService';
import Breadcrumb from '../../components/Breadcrumb';
import { useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import { GitHub, Microsoft } from '@mui/icons-material';
import { SessionService } from '../../services/sessionsService';

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [providerLoading, setProviderLoading] = useState<string | null>(null);
  const createSession = async (userId: string | number, token: string) => {
    try {
      const FACode = Math.floor(100000 + Math.random() * 900000).toString();

      await SessionService.create(userId, {
        token,
        FACode,
        state: 'active',
        expiration: new Date(Date.now() + 3600 * 1000).toISOString(), // 1h
      });

      console.log('✅ Sesión registrada exitosamente');
    } catch (error) {
      console.error('❌ Error al registrar sesión:', error);
    }
  };

  const handleLogin = async (user: User) => {
    setLoading(true);
    setError('');
    try {
      console.log('Intentando login con:', user.email);

      const response = await SecurityService.login(user);
      console.log('✅ Login exitoso:', response);
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('token', response.token);
      await createSession(response.user?.id || 1, 'manual-token');

      navigate('/', { replace: true });
    } catch (error: any) {
      console.error('❌ Error en login:', error);
      setError(
        error.message || 'Error al iniciar sesión. Verifica tus credenciales.',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse: any) => {
    setProviderLoading('google');
    setError('');

    try {
      console.log('🔑 Credencial de Google recibida:', credentialResponse);

      if (!credentialResponse.credential) {
        throw new Error('No se recibió credencial de Google');
      }

      const decoded: any = jwtDecode(credentialResponse.credential);
      console.log('👤 Token de Google decodificado:', decoded);

      const userData = await SecurityService.loginWithGoogle(decoded);
      console.log('✅ Login con Google exitoso:', userData);
      await createSession(
        userData.id || decoded.sub,
        credentialResponse.credential,
      );

      navigate('/', { replace: true });
    } catch (error: any) {
      console.error('❌ Error en login con Google:', error);
      setError(error.message || 'Error al autenticar con Google.');
    } finally {
      setProviderLoading(null);
    }
  };

  const handleGitHubLogin = async () => {
    setProviderLoading('github');
    setError('');

    try {
      console.log('🔐 Iniciando login con GitHub...');

      const userData = await SecurityService.loginWithGitHub();
      console.log('✅ Login con GitHub exitoso:', userData);
      await createSession(userData.id || 'githubUser', 'github-token');

      navigate('/', { replace: true });
    } catch (error: any) {
      console.error('❌ Error en login con GitHub:', error);
      setError(error.message || 'Error al autenticar con GitHub.');
    } finally {
      setProviderLoading(null);
    }
  };

  const handleMicrosoftLogin = async () => {
    setProviderLoading('microsoft');
    setError('');

    try {
      console.log('🔐 Iniciando login con Microsoft...');

      const userData = await SecurityService.loginWithMicrosoft();
      console.log('✅ Login con Microsoft exitoso:', userData);
      await createSession(userData.id || 'microsoftUser', 'microsoft-token');

      navigate('/', { replace: true });
    } catch (error: any) {
      console.error('❌ Error en login con Microsoft:', error);
      setError(error.message || 'Error al autenticar con Microsoft.');
    } finally {
      setProviderLoading(null);
    }
  };

  const handleGoogleError = () => {
    console.error('❌ Error en el flujo de Google OAuth');
    setError('Error al iniciar sesión con Google. Intenta de nuevo.');
    setProviderLoading(null);
  };

  const GOOGLE_CLIENT_ID =
    '408294359663-pihvunt5ou1h5nkul77du76vvlsq66d1.apps.googleusercontent.com';

  return (
    <>
      <Breadcrumb pageName="Sign In" />

      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Iniciar Sesión
          </Typography>

          <Typography
            variant="body1"
            color="textSecondary"
            align="center"
            sx={{ mb: 3 }}
          >
            Bienvenido de vuelta, por favor ingresa tus credenciales
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Formik
            initialValues={{
              email: '',
              password: '',
            }}
            validationSchema={Yup.object({
              email: Yup.string()
                .email('Email inválido')
                .required('El email es obligatorio'),
              password: Yup.string()
                .min(6, 'La contraseña debe tener al menos 6 caracteres')
                .required('La contraseña es obligatoria'),
            })}
            onSubmit={(values) => {
              handleLogin(values);
            }}
          >
            {({ errors, touched, handleSubmit }) => (
              <Form onSubmit={handleSubmit}>
                <Box sx={{ mb: 2 }}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                    variant="outlined"
                    margin="normal"
                    disabled={loading}
                  />
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="Contraseña"
                    name="password"
                    type="password"
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
                    variant="outlined"
                    margin="normal"
                    disabled={loading}
                  />
                </Box>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  sx={{ mb: 3, height: '48px' }}
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Iniciar Sesión'
                  )}
                </Button>
              </Form>
            )}
          </Formik>

          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="textSecondary">
              o continúa con
            </Typography>
          </Divider>

          {/* Botones de proveedores OAuth */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
            <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <GoogleLogin
                  onSuccess={handleGoogleLogin}
                  onError={handleGoogleError}
                  theme="filled_blue"
                  size="large"
                  text="signin_with"
                  shape="rectangular"
                  width="300"
                  locale="es"
                />
              </Box>
            </GoogleOAuthProvider>

            <Button
              fullWidth
              variant="outlined"
              size="large"
              onClick={handleGitHubLogin}
              disabled={!!providerLoading}
              startIcon={
                providerLoading === 'github' ? (
                  <CircularProgress size={20} />
                ) : (
                  <GitHub />
                )
              }
              sx={{
                height: '48px',
                textTransform: 'none',
                color: 'text.primary',
                borderColor: 'grey.400',
                '&:hover': {
                  borderColor: 'grey.600',
                  backgroundColor: 'grey.50',
                },
              }}
            >
              {providerLoading === 'github'
                ? 'Conectando con GitHub...'
                : 'Continuar con GitHub'}
            </Button>

            <Button
              fullWidth
              variant="outlined"
              size="large"
              onClick={handleMicrosoftLogin}
              disabled={!!providerLoading}
              startIcon={
                providerLoading === 'microsoft' ? (
                  <CircularProgress size={20} />
                ) : (
                  <Microsoft />
                )
              }
              sx={{
                height: '48px',
                textTransform: 'none',
                color: 'text.primary',
                borderColor: 'grey.400',
                '&:hover': {
                  borderColor: 'grey.600',
                  backgroundColor: 'grey.50',
                },
              }}
            >
              {providerLoading === 'microsoft'
                ? 'Conectando con Microsoft...'
                : 'Continuar con Microsoft'}
            </Button>
          </Box>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="textSecondary">
              ¿No tienes una cuenta?{' '}
              <Button
                color="primary"
                onClick={() => navigate('/auth/signup')}
                sx={{ textTransform: 'none' }}
                disabled={loading || !!providerLoading}
              >
                Regístrate aquí
              </Button>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default SignIn;
