import cookie from "../services/cookie";
import Redirect from "../components/redirect";
import BaseLayout from "../components/base-layout";
import Head from "next/head";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    CircularProgress,
    Container,
    Grid, TextField,
    Typography
} from "@mui/material";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {useEffect, useState} from "react";
import baseApi from "../services/base-api";
import {ExpandMore} from "@mui/icons-material";
import moment from "moment";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

export default function Logs() {
    if (! cookie('user') || ! cookie('access')) {
        return <Redirect to='/login' />
    }

    const [name, setName] = useState('')
    const [date, setDate] = useState(dayjs())

    const [lastTimerToSend, setLastTimer] = useState(0);

    const [page, setPage] = useState({})
    const [onProgress, setOnProgress] = useState(false);

    function loadMore() {
        setOnProgress(true)

        baseApi().get(page.next_page_url, { params: { name, date: date?.format('YYYY-MM-DD') }}).then(res => res.data).then(data => {
            const moreLogs = data.data
            setPage({ ...data, data: [ ...page.data, ...moreLogs ] })
            setOnProgress(false)
        })
    }

    function refresh() {
        setOnProgress(true)

        baseApi().get('activity-logs', { params: { name, date: date?.format('YYYY-MM-DD') }}).then(res => res.data).then(data => {
            setPage(data)
            setOnProgress(false)
        })
    }

    useEffect(() => {
        setOnProgress(true)

        baseApi().get('activity-logs').then(res => res.data).then(data => {
            setPage(data)
            setOnProgress(false)
        })
    }, [])

    return (
        <BaseLayout>
            <Head>
                <title>Logs</title>
            </Head>

            <Container component='main' maxWidth='md'>
                <Box sx={{ my: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography component='h3' variant='h3'>
                        Activities Logs
                    </Typography>

                    <Typography sx={{ color: 'gray' }}>
                        Below we have all activities in our server,
                        You can list by name or by date
                    </Typography>

                    <Grid container sx={{ my: 2 }} spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                id="name"
                                label="Search by Name"
                                name="name"
                                autoComplete="firstname"
                                autoFocus
                                onChange={e => setName(e.target.value)}
                                variant='standard'
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <LocalizationProvider margin="normal" dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="Or by Date"
                                    value={date}
                                    onChange={(newValue) => {
                                        setDate(newValue);
                                    }}
                                    renderInput={(params) => <TextField {...params} fullWidth variant='standard' />}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={3}>
                            <Button fullWidth onClick={refresh} variant="contained">
                                Search <Box display='inline-block' mx={1}><FontAwesomeIcon icon={faMagnifyingGlass} /></Box>
                            </Button>
                        </Grid>
                    </Grid>

                    <Box sx={{ mt: 6, width: '100%' }}>
                        {page.data?.map(log => (
                            <Accordion sx={{ my: 1, width: '100%' }} >
                                <AccordionSummary
                                    expandIcon={<ExpandMore />}
                                >
                                    <Grid container spacing={2}>
                                        <Grid item md={10} xs={6}>
                                            <Typography sx={{ color: 'gray' }}>
                                                {log.user.name}
                                            </Typography>
                                        </Grid>
                                        <Grid item md={2} xs={4}>
                                            <Typography sx={{ color: 'gray' }}>
                                                {moment(log.created_at).fromNow()}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography>
                                        uri: <span style={{ color: 'gray' }}> {log.activity_uri} </span>
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                        ))}
                        {(page.data == null || page.data?.length === 0) && <Typography textAlign='center' variant='h6' color='gray'>
                            There's no logs for these filters, sorry =/
                        </Typography>}
                    </Box>

                    {
                        (page.current_page !== page.last_page && !onProgress) &&
                        <Button onClick={loadMore}>
                            Load More
                        </Button>
                    }

                    {onProgress && <CircularProgress />}
                </Box>
            </Container>
        </BaseLayout>
    )
}