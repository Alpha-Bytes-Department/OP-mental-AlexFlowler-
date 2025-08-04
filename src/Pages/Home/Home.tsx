import Faq from "./Faq"
import Feature from "./Feature"
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
    </div>
  )
}

export default Home