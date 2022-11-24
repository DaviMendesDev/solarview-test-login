import Link from "next/link";
import {AppBar, Button, IconButton, Toolbar, Typography} from "@mui/material";
import cookie from "../services/cookie";
import {useRouter} from "next/router";

function MenuIcon() {
    return null;
}

export default function Header() {
    const router = useRouter()

    function forgetToken() {
        cookie().remove('access')
        cookie().remove('user')
        router.push('/')
    }

    return (
        <AppBar position="static">
            <Toolbar sx={{ backgroundColor: 'white' }}>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    <Link href='/' style={{ textDecorationLine: 'none' }}>SolarView</Link>
                </Typography>

                {! cookie('access') && <Link href='/login'><Button color="inherit">Login</Button></Link>}
                {cookie('access') && <Button sx={{ textDecorationStyle: 'underline', color: 'blue' }} color="inherit" onClick={forgetToken}>Logout</Button>}
                {cookie('access') && <Button><Link href='logs'>Logs</Link></Button>}
            </Toolbar>
        </AppBar>
    )
}