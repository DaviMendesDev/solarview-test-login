import Link from "next/link";
import {Typography} from "@mui/material";

export default function Copyright() {
    return <Typography variant="body2" color="text.secondary" align="center">
        {'Copyright © '}
        <Link color="inherit" href="/">
            SolarView Login
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
    </Typography>
}