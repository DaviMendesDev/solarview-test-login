import Header from "./header";

export default function BaseLayout({ children }) {
    return (
        <div>
            <Header />
            { children }
        </div>
    )
}