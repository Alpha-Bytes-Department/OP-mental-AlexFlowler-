const CTA = () => {
  const scrollToPricing = () => {
    const pricingElement = document.getElementById('pricing');
    if (pricingElement) {
      pricingElement.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <div  className=" bg-no-repeat bg-center bg-cover sm:px-16 px-5 py-5 sm:py-13 font-inter text-white relative"
      style={{
        backgroundImage: "url('/Mountain.png')",
      }}
    >
      {/* Overlay for background opacity */}
      <div className="absolute inset-0 bg-black opacity-70 pointer-events-none"></div>
      <div className="flex justify-center mb-12 relative z-10">
        <div className="flex items-center gap-3.5 px-4 py-3 mx-auto rounded-lg border border-hCard bg-[#00000080]">
          <div className="h-2 w-2 rounded-full bg-hCard"></div>
          <h2 className="text-xl font-bold text-white">
            CTA Section
          </h2>
        </div>
      </div>

      <div className=" relative z-10">
          <h1 className=" font-montserrat text-2xl text-white sm:text-4xl font-semibold text-center">
            Ready to improve your mental <br /> performance?
          </h1>
          <div className="flex justify-center ">
              <button 
                className="mt-10  px-20 py-2 bg-cCard text-black rounded-lg"
                onClick={scrollToPricing}
              >
                Start Subscription
              </button>
          </div>
      </div>
    </div>
  );
};

export default CTA;
