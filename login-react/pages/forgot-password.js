import BaseLayout from "../components/base-layout";
import Head from "next/head";
import {Box, Button, CircularProgress, Container, TextField, Typography} from "@mui/material";
import Copyright from "../components/copyright";
import {useState} from "react";
import baseApi from "../services/base-api";
import Link from "next/link";
import cookie from "../services/cookie";
import Redirect from "../components/redirect";

export default function ForgotPassword() {
    if (cookie('user'))
        return <Redirect to='/' />

    const [onProgress, setOnProgress] = useState(false)

    const [email, setEmail] = useState('')
    const [emailErrorMessage, setEmailErrorMessage] = useState('')

    const [resetCode, setResetCode] = useState('')
    const [codeErrorMessage, setCodeErrorMessage] = useState('')

    const [newPassword, setNewPassword] = useState('')
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('')

    const [confirmPassword, setConfirmPassword] = useState('')
    const [confirmErrorMessage, setConfirmErrorMessage] = useState('')

    const [currentStep, setCurrentStep] = useState(1)

    function clear() {
        setEmailErrorMessage('')
        setCodeErrorMessage('')
        setPasswordErrorMessage('')
        setConfirmErrorMessage('')
    }

    function goToNextStep() {
        if (currentStep < 4)
            setCurrentStep(currentStep + 1)
    }

    function sendResetEmail(e) {
        e.preventDefault()
        clear()
        setOnProgress(true)

        baseApi().post('forgot-password', { email })
            .then(res => res.data).then(data => {
                goToNextStep()
        }).catch(err => {
            if (err.response.status === 422) {
                setEmailErrorMessage(err.response.data.message)
            }
        }).finally(() => { setOnProgress(false) })
    }

    function checkCode(e) {
        e.preventDefault()
        clear()
        setOnProgress(true)

        baseApi().get(`check-reset-code`, { params: { code: resetCode } })
            .then(res => res.data).then(data => {
                goToNextStep()
        }).catch(err => {
            if (err.response.status === 422) {
                setCodeErrorMessage(err.response.data.message)
            }
        }).finally(() => { setOnProgress(false) })
    }

    function resetPassword(e) {
        e.preventDefault()
        clear()
        setOnProgress(true)

        if (newPassword !== confirmPassword) {
            setPasswordErrorMessage('The passwords must match')
            setConfirmErrorMessage('The passwords must match')

            return false
        }

        baseApi().post('reset-password', { code: resetCode, newPassword })
            .then(res => res.data).then(data => {
            goToNextStep()
        }).catch(err => {
            if (err.response.status === 422) {
                setEmailErrorMessage(err.response.data.message)
            }
        }).finally(() => { setOnProgress(false) })
    }

    function checkStep(number) {
        return { display: currentStep === number ? 'block' : 'none' }
    }

    return (
        <BaseLayout>
            <Head>
                <title>Forgot Password - Solarview Login</title>
            </Head>

            <Container component='main' maxWidth="xs">
                <Box sx={{
                    py: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: '1rem',
                    alignItems: 'center'
                }}>
                    <div style={checkStep(1)}>
                        <Typography component="h1" variant="h5" sx={{ my: 2 }}>
                            Forgot Password
                        </Typography>

                        <Typography sx={{ color: 'gray' }}>
                            If you have lost your password, please, write your email below to we send you a reset code
                        </Typography>
                        <Box sx={{ width: '100%' }} component='form' onSubmit={sendResetEmail}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                onChange={(e) => setEmail(e.target.value)}
                                variant='outlined'
                                error={!!emailErrorMessage}
                                helperText={emailErrorMessage}
                            />

                            <Box sx={{ position: 'relative' }}>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    disabled={onProgress}
                                    sx={{ mt: 3, mb: 2 }}
                                >
                                    Send
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
                        </Box>
                    </div>
                    <div style={checkStep(2)}>
                        <Typography component="h1" variant="h5" sx={{ my: 2 }}>
                            Code Sent!
                        </Typography>

                        <Typography sx={{ color: 'gray' }}>
                            We just sent a code number to you reset your password, please check the code number and write this down here
                        </Typography>
                        <Box sx={{ width: '100%' }} component='form' onSubmit={checkCode}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="resetCode"
                                label="Code number"
                                name="resetCode"
                                autoComplete="resetCode"
                                onChange={(e) => setResetCode(e.target.value)}
                                variant='outlined'
                                error={!!codeErrorMessage}
                                helperText={codeErrorMessage}
                            />

                            <Box sx={{ position: 'relative' }}>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    disabled={onProgress}
                                    sx={{ mt: 3, mb: 2 }}
                                >
                                    Go to Reset
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
                        </Box>
                    </div>
                    <div style={checkStep(3)}>
                        <Typography component="h1" variant="h5" sx={{ my: 2 }}>
                            Now, set the new Password
                        </Typography>

                        <Typography sx={{ color: 'gray' }}>
                            You've put the right code, now you only need to create another password and confirm it
                        </Typography>
                        <Box sx={{ width: '100%' }} component='form' onSubmit={resetPassword}>
                            <TextField
                                type='password'
                                margin="normal"
                                fullWidth
                                id="newPassword"
                                label="New Password.."
                                name="newPassword"
                                autoComplete="newPassword"
                                onChange={(e) => setNewPassword(e.target.value)}
                                variant='outlined'
                                error={!!passwordErrorMessage}
                                helperText={passwordErrorMessage}
                            />

                            <TextField
                                type='password'
                                margin="normal"
                                fullWidth
                                id="confirmPassword"
                                label="New Password.."
                                name="confirmPassword"
                                autoComplete="confirmPassword"
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                variant='outlined'
                                error={!!confirmErrorMessage}
                                helperText={confirmErrorMessage}
                            />

                            <Box sx={{ m: 1, position: 'relative' }}>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    disabled={onProgress}
                                    sx={{ mt: 3, mb: 2 }}
                                >
                                    Reset
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
                        </Box>
                    </div>
                    <div style={checkStep(4)}>
                        <Typography component="h1" variant="h5" sx={{ my: 2 }}>
                            Congrats! You reseted your password
                        </Typography>

                        <Typography sx={{ color: 'gray', textAlign: 'center', my: 2 }}>
                            Now you should go back and try login again!
                        </Typography>

                        <Box fullWidth>
                            <Button fullWidth sx={{ my: 2 }}>
                                <Link href='/login' style={{ width: '100%', display: 'block', textAlign: 'center' }}>
                                    Try to Login
                                </Link>
                            </Button>
                        </Box>
                    </div>
                    <Copyright />
                </Box>
            </Container>
        </BaseLayout>
    )
}