import BaseLayout from "../components/base-layout";
import Head from "next/head";
import {
    Box,
    Button,
    Checkbox, CircularProgress,
    Container,
    FormControl,
    FormControlLabel, FormHelperText,
    Grid,
    TextField,
    Typography
} from "@mui/material";
import Link from "next/link";
import {useState} from "react";
import baseApi from "../services/base-api";
import cookie from "../services/cookie";
import Copyright from "../components/copyright";
import Redirect from "../components/redirect";
import {useRouter} from "next/router";

function TermsAndServices() {
    return (
        <div>
            <span>You agree with our </span>
            <span>
                <Link href='/terms.html'>terms and services of conducts</Link>
            </span>
        </div>
    )
}

export default function Register() {
    if (cookie('user'))
        return <Redirect to='/' />

    const [onProgress, setOnProgress] = useState(false)

    const router = useRouter();

    const [checkTerms, setCheckTerms] = useState(false)
    const [checkTermsErrorMessage, setCheckTermsErrorMessage] = useState('')

    const [registerData, setRegisterData] = useState({
        email: '',
        first: '',
        last: '',
        password: '',
    })

    const [errorInputMessages, setErrorInputMessages] = useState({
        email: '',
        first: '',
        last: '',
        password: '',
    })

    function clear() {
        setErrorInputMessages({
            email: '',
            first: '',
            last: '',
            password: '',
        })

        setCheckTermsErrorMessage('')
    }

    function handleRegisterSubmit(e) {
        e.preventDefault();

        if (! checkTerms) {
            setCheckTermsErrorMessage('Please, you need to accept the terms before continue')
            return false;
        }
        clear()
        setOnProgress(true)

        baseApi().post('register', registerData)
            .then(res => res.data)
            .then(data => {
                cookie('access', data.access)
                cookie('user', data.user)
                router.push('/')
            })
            .catch(err => {
                if (err.response.status === 422) {
                    const errors = err.response.data.errors
                    let newMessages = {};

                    for (const field in errors) {
                        newMessages[field] = errors[field]
                    }

                    setErrorInputMessages(newMessages)
                }
            }).finally(() => {
            setOnProgress(false)
        })
    }

    return (
        <BaseLayout>
            <Head>
                <title>SolarView - Register</title>
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
                        Sign Up
                    </Typography>

                    <Box component='form' onSubmit={handleRegisterSubmit} sx={{ mt: 1, mb: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="first"
                                    label="First Name"
                                    name="first"
                                    autoComplete="firstname"
                                    autoFocus
                                    onChange={(e) => setRegisterData({ ...registerData, first: e.target.value })}
                                    variant='outlined'
                                    error={!!errorInputMessages.first}
                                    helperText={errorInputMessages.first}
                                />
                            </Grid>
                            <Grid item xs>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="last"
                                    label="Last Name"
                                    name="last"
                                    autoComplete="lastname"
                                    onChange={(e) => setRegisterData({ ...registerData, last: e.target.value })}
                                    variant='outlined'
                                    error={!!errorInputMessages.last}
                                    helperText={errorInputMessages.last}
                                />
                            </Grid>
                        </Grid>

                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                            variant='outlined'
                            error={!!errorInputMessages.email}
                            helperText={errorInputMessages.email}
                        />

                        <TextField
                            variant='outlined'
                            onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            error={!!errorInputMessages.password}
                            helperText={errorInputMessages.password}
                        />

                        <FormControl error={!!checkTermsErrorMessage}>
                            <FormControlLabel
                                control={<Checkbox color="primary" onChange={(e) => setCheckTerms(! checkTerms)} />}
                                label={<TermsAndServices />}
                            />
                            <FormHelperText>{checkTermsErrorMessage}</FormHelperText>
                        </FormControl>

                        <Box sx={{ m: 1, position: 'relative' }}>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                disabled={onProgress}
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Register
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
                            <Grid item>
                                <Link href="/login" variant="body2" style={{ fontSize: '.75rem' }}>
                                    {"Already have an account? try Sign in"}
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
