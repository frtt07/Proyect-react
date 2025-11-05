import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { User } from "../../models/User";
import SecurityService from '../../services/securityService';
import Breadcrumb from "../../components/Breadcrumb";
import { useNavigate } from "react-router-dom";
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
} from "@mui/material";

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (user: User) => {
    setLoading(true);
    setError("");
    try {
      console.log("Intentando login con:", user.email);
      
      const response = await SecurityService.login(user);
      console.log('✅ Login exitoso:', response);
      
      // Redirigir al dashboard después del login exitoso
      navigate("/", { replace: true });
      
    } catch (error: any) {
      console.error('❌ Error en login:', error);
      setError(error.message || "Error al iniciar sesión. Verifica tus credenciales.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse: any) => {
    setLoading(true);
    setError("");
    
    try {
      console.log('🔑 Credencial de Google recibida:', credentialResponse);
      
      if (!credentialResponse.credential) {
        throw new Error("No se recibió credencial de Google");
      }

      const decoded: any = jwtDecode(credentialResponse.credential);
      console.log('👤 Token de Google decodificado:', decoded);
      
      // Usar el nuevo método para login con Google
      const userData = await SecurityService.loginWithGoogle(decoded);
      console.log('✅ Login con Google exitoso:', userData);
      
      // Redirigir al dashboard
      navigate("/", { replace: true });
      
    } catch (error: any) {
      console.error('❌ Error en login con Google:', error);
      setError(error.message || "Error al autenticar con Google.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    console.error('❌ Error en el flujo de Google OAuth');
    setError("Error al iniciar sesión con Google. Intenta de nuevo.");
    setLoading(false);
  };

  // Client de google
  const GOOGLE_CLIENT_ID = "408294359663-pihvunt5ou1h5nkul77du76vvlsq66d1.apps.googleusercontent.com";

  return (
    <>
      <Breadcrumb pageName="Sign In" />
      
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Iniciar Sesión
          </Typography>
          
          <Typography variant="body1" color="textSecondary" align="center" sx={{ mb: 3 }}>
            Bienvenido de vuelta, por favor ingresa tus credenciales
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Formik
            initialValues={{
              email: "",
              password: ""
            }}
            validationSchema={Yup.object({
              email: Yup.string()
                .email("Email inválido")
                .required("El email es obligatorio"),
              password: Yup.string()
                .min(6, "La contraseña debe tener al menos 6 caracteres")
                .required("La contraseña es obligatoria"),
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
                    "Iniciar Sesión"
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

          <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
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
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="textSecondary">
              ¿No tienes una cuenta?{' '}
              <Button 
                color="primary" 
                onClick={() => navigate("/auth/signup")}
                sx={{ textTransform: 'none' }}
                disabled={loading}
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