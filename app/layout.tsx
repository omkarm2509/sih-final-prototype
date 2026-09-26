import './globals.css';
import DataIntegrity from '../components/DataIntegrity';
import DemoBanner from '../components/DemoBanner';
import DemoControls from '../components/DemoControls';
export const metadata={title:'SahyogSetu',description:'Regional cooperative services marketplace prototype'};
export default function RootLayout({children}:{children:React.ReactNode}){
 return <html lang="en"><body><a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-3 focus:shadow-lg">Skip to content</a><DataIntegrity/><DemoBanner/><div id="main-content">{children}</div><DemoControls/></body></html>
}
