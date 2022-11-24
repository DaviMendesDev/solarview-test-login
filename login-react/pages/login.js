import {
    Alert,
    Box,
    Button,
    Checkbox, CircularProgress,
    Container,
    FormControl,
    FormControlLabel,
    Grid,
    InputLabel,
    TextField,
    Typography
} from "@mui/material";
import { useState } from "react";
import Head from "next/head";
import BaseLayout from "../components/base-layout";
import { AccountCircle } from "@mui/icons-material";
import Image from 'next/image';
import Link from "next/link";
import Copyright from "../components/copyright";
import baseApi from "../services/base-api";
import cookie from "../services/cookie";
import Redirect from "../components/redirect";
import {useRouter} from "next/router";
import {green} from "@mui/material/colors";

export default function Login() {
    if (cookie('user'))
        return <Redirect to='/' />

    const router = useRouter()

    const [onProgress, setOnProgress] = useState(false)

    const [loginData, setLoginData] = useState({
        email: '',
        password: '',
    })

    const [inputErrorMessage, setInputErrorMessage] = useState({
        email: '',
        password: '',
    })

    const [unauthorizedMessage, setUnauthorizedMessage] = useState('')

    function clear() {
        setInputErrorMessage({
            email: '',
            password: '',
        })

        setUnauthorizedMessage('')
    }

    function handleLoginSubmit(e) {
        e.preventDefault();
        clear()
        setOnProgress(true)

        baseApi().post('get-auth-token', loginData)
            .then(res => res.data).then(data => {
                cookie('access', data.access)
                router.push('/')
            }).catch(err => {
            if (err.response.status === 422) {
                const errors = err.response.data.errors
                let newMessages = {};

                for (const field in errors) {
                    newMessages[field] = errors[field][0]
                }

                setInputErrorMessage(prevState => ({ ...prevState, ...newMessages }))
            }

            if (err.response.status === 403) {
                setUnauthorizedMessage(err.response.data.message)
                return false
            }
        }).finally(() => {
            setOnProgress(false)
        })
    }

    return (
        <BaseLayout>
            <Head>
                <title>Login Page</title>
            </Head>

            <Container component="main" maxWidth="xs">
                <Box sx={{
                    py: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: '1rem',
                    alignItems: 'center'
                }}>
                    <Box sx={{ m: 1 }}>
                        <img src='/solarview-logo.png' style={{ objectFit: 'cover', width: '180px' }} alt='SolarView Logo PNG' />
                    </Box>

                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>

                    <Box component='form' onSubmit={handleLoginSubmit} sx={{ mt: 1, mb: 2 }}>
                        {!!unauthorizedMessage && <Alert severity="error" sx={{ my: 2 }}>{unauthorizedMessage}</Alert>}

                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            onChange={(e) => setLoginData(prevState => ({ ...prevState, email: e.target.value }))}
                            variant='outlined'
                            error={!!inputErrorMessage.email}
                            helperText={inputErrorMessage.email}
                        />

                        <TextField
                            variant='outlined'
                            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            error={!!inputErrorMessage.password}
                            helperText={inputErrorMessage.password}
                        />

                        <FormControlLabel
                            control={<Checkbox value="remember" color="primary" />}
                            label="Remember me"
                        />

                        <Box sx={{ m: 1, position: 'relative' }}>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                disabled={onProgress}
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Sign In
                            </Button>
                            {onProgress && (
                                <CircularProgress
                                    size={24}
                                    sx={{
                                        color: 'white',
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        marginTop: '-12px',
                                        marginLeft: '-12px',
                                    }}
                                />
                            )}
                        </Box>

                        <Grid container>
                            <Grid item xs>
                                <Link href="/forgot-password" variant="body2" style={{ fontSize: '.75rem' }}>
                                    Forgot password?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href="/register" variant="body2" style={{ fontSize: '.75rem' }}>
                                    {"Don't you have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                    <Copyright />
                </Box>
            </Container>
        </BaseLayout>
    )
}
