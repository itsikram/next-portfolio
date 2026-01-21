import '../styles/globals.scss'
import '../styles/home-styles.scss'
import type { AppProps } from 'next/app'
import PortfolioContainer from '@/components/PortfolioContainer'
import PageLoader from '@/components/PageLoader'

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <PageLoader />
            
            {/* <Header />

            <Footer /> */}

            <PortfolioContainer>
                <Component {...pageProps} />
            </PortfolioContainer>
        </>
    )
}
