import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import Alert, { AlertProps } from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import CloseIcon from '@mui/icons-material/Close';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Copyright from '../Copyright';
import { useAuthenticatedUser } from '../../hooks/useAuthenticatedUser';
import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { loginAccount, LoginData } from '../../api/ApiAccount';
import { loginSchema } from '../../validators/account';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';

export default function SignIn() {
  const [errorMessage, setErrorMessage] = useState("");

  const [openSnackbar, setOpenSnackbar] = React.useState(false);

  const { isAuthenticated } = useAuthenticatedUser();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginData>({
    resolver: yupResolver(loginSchema),
  });

  let navigate = useNavigate();

  const handleLogin = (data: LoginData) => {
    loginAccount(data).then((res) => {

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('login', res.data.login);
      localStorage.setItem('name', res.data.name);
      localStorage.setItem('roleId', res.data.roleId.toString());
      navigate('/');
    })
      .catch((error) => {
        setErrorMessage(error.response.data.message);
        setOpenSnackbar(true);
        console.log(error.response.data);
      });
  };

  const handleCloseSnackbar = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
  }

  if (isAuthenticated) {
    return <Navigate to={'/'} replace />;
  }

  return (
    <Grid container component="main" sx={{ height: '100vh' }}>

      <CssBaseline />
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: 'url(https://lorempokemon.fakerapi.it/pokemon)',
          backgroundRepeat: 'no-repeat',
          backgroundColor: (t) =>
            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Snackbar
            open={openSnackbar}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            onClose={handleCloseSnackbar}
          >
            <Alert severity="error"
              sx={{ width: '100%' }}

              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setOpenSnackbar(false);
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }>
              <AlertTitle>Błąd logowania</AlertTitle>
              {errorMessage}
            </Alert>
          </Snackbar>
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Logowanie
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit(handleLogin)} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="login"
              label="Login"
              autoComplete="login"
              autoFocus
              error={!!errors?.login}
              {...register('login')}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Hasło"
              type="password"
              id="password"
              error={!!errors?.password}
              autoComplete="current-password"
              {...register('password')}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Zapamiętaj mnie"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Zaloguj
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Zapomniałeś hasła?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {'Utwórz konto'}
                </Link>
              </Grid>
            </Grid>
            <Copyright sx={{ mt: 5 }} />
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
