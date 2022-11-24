import Head from 'next/head'
import styles from '../styles/Home.module.css';
import BaseLayout from "../components/base-layout";
import {Box, Container, Typography} from "@mui/material";
import cookie from "../services/cookie";
import Redirect from "../components/redirect";
import baseApi from "../services/base-api";
import {useEffect, useState} from "react";

export default function Home() {
  if (! cookie('access'))
    return <Redirect to='/login' />

  const [user, setUser] = useState({})

  useEffect(() => {
      baseApi().get('me').then(res => res.data).then(data => {
          cookie('user', data)
          setUser(data)
      })
  }, [])

  return (
      <BaseLayout>
        <Head>
          <title>Welcome Logged {user.name}</title>
        </Head>

        <Container component='main' maxWidth="xs">
          <Box sx={{ my: 12, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
            <Typography component="h1" variant="h5">
              Welcome! you're logged in as <strong style={{ color: "blue", textDecorationStyle: 'underline' }}>{user.name}</strong>
            </Typography>

            <Typography sx={{ color: 'gray' }}>
              As you may guess, this is the real "home" page, there is nothing here, I mean.
            </Typography>
          </Box>
        </Container>
      </BaseLayout>
  )
}