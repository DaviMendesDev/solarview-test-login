import { useRouter } from 'next/router'
import {useEffect} from "react";
import Link from "next/link";

export default function Redirect({ to }) {
    const router = useRouter()

    useEffect(() => {
        router.push(to)
    }, [])

    return <div>Redirecting to <Link href={to}></Link>!</div>
}