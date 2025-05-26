import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import PortfolioContainer from '@/components/PortfolioContainer'

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            {/* <Header />

            <Footer /> */}

            <PortfolioContainer>
                <Component {...pageProps} />
            </PortfolioContainer>
        </>
    )
}
