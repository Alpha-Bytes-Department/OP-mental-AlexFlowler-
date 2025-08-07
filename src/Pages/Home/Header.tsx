import { Link } from "react-router-dom";

const Header = () => {
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
    <div
      className="min-h-[100vh] bg-no-repeat bg-center bg-cover sm:px-16 px-5 py-5 sm:py-13 font-inter text-white relative"
      style={{
        backgroundImage: "url('/Mountain.png')",
      }}
    >
      {/* Overlay for background opacity */}
      <div className="absolute inset-0 bg-black opacity-70 pointer-events-none"></div>
      <nav className="flex sm:justify-between gap-5 sm:gap-8 relative z-10">
        <img
          className="sm:h-14 h-10 w-10 sm:w-14"
          src="/image.png"
          alt="Logo"
        />
        <div className="flex sm:gap-9 gap-8 items-center">
          <Link to="https://optimalperformancesystem.com/">Home</Link>
          <Link to="/chat">Coach</Link>
          <button 
            className="btn bg-cCard text-black"
            onClick={scrollToPricing}
          >
            Start Subscription
          </button>
        </div>
      </nav>

      <div className="flex items-center justify-center flex-col text-center pt-60 relative z-10">
        <h1 className="sm:text-6xl text-5xl font-normal font-league-gothic mt-10">
          Optimal Performance Coach
        </h1>
        <p
          className="text-xl font-normal mt-4 pt-5 pb-8"
          style={{ fontFamily: "montserrat" }}
        >
          Experience the one-of-a-kind AI mental performance and wellness coach
          at your fingertips.
        </p>
        <div className=" flex items-center flex-col sm:flex-row gap-4">
          <button 
            className="btn text-black bg-cCard font-bold py-3 px-5"
            onClick={scrollToPricing}
          >
            Start Subscription
          </button>
          <Link
            to={"/chat"}
            className="btn rounded-lg bg-transparent text-white border-cCard py-3 px-5"
          >
            Chat with OP Coach Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
