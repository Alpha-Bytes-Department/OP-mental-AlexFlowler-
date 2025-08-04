import CTA from "./CTA"
import Faq from "./Faq"
import Feature from "./Feature"
import Footer from "./Footer"
import Header from "./Header"
import Pricing from "./Pricing"
import Testimonial from "./Testimonial"

const Home = () => {
  return (
    <div className="bg-black">      
        <Header />
        <Feature />
        <Pricing />
        <Testimonial />
        <Faq/>
        <CTA />
        <Footer />
    </div>
  )
}

export default Home