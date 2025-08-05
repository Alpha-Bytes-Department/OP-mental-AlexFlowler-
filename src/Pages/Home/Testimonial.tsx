import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { useState } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi2";

const Testimonial = () => {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);

  // Sample testimonial data
  const testimonials = [
    {
      id: 1,
      name: "John Smith",
      role: "CEO, TechCorp",
      content: "This platform has revolutionized how we manage our corporate operations. The team collaboration features are outstanding.",
      avatar: "./user.png"
    },
    {
      id: 2,
      name: "Sarah Johnson",
      role: "Project Manager, StartupXYZ",
      content: "The project management tools are intuitive and powerful. Our productivity has increased by 40% since implementation.",
      avatar: "./user.png"
    },
    {
      id: 3,
      name: "Michael Chen",
      role: "CTO, Innovation Labs",
      content: "Excellent resource scheduling and version control features. Perfect for large-scale enterprise projects.",
      avatar: "./user.png"
    },
    {
      id: 4,
      name: "Emma Davis",
      role: "Lead Developer, CodeWorks",
      content: "The advanced analytics provide insights we never had before. Game-changer for our development workflow.",
      avatar: "./user.png"
    }
  ];

  return (
    <div className=" py-16">
      <div className="flex justify-center mb-12">
        <div className="flex items-center gap-3.5 px-4 py-3 mx-auto rounded-lg border border-hCard bg-[#00000080]">
          <div className="h-2 w-2 rounded-full bg-hCard"></div>
          <h2 className="text-xl font-bold text-white">Testimonials / Expert Backing</h2>
        </div>
      </div>

      {/* Testimonial Swiper */}
      <div className=" mx-auto px-4">
        <Swiper
          
          onSwiper={setSwiper}
          modules={[Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          loop={true}
          grabCursor={true}
          className="testimonial-swiper"
        >
          {testimonials.map((testimonial) => (
            <SwiperSlide key={testimonial.id}>
              <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 h-full">

              <p className="text-gray-300 leading-relaxed ">{testimonial.content}</p>
                <div className=' flex items-center max-w-lg pt-5 justify-between' >
                    <div className="flex items-center mb-4">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full mr-4"
                      />
                      <div>
                        <h3 className="text-hCard text-lg font-montserrat font-semibold">{testimonial.name}</h3>
                        <p className="font-montserrat font-semibold text-hCard text-sm">{testimonial.role}</p>
                      </div>
                    </div>
                    
                    <div className="flex  bg-hCard px-3 rounded-r-full rounded-l-full">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-cCard text-lg">★</span>
                      ))}
                    </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={() => swiper?.slidePrev()}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-transparent border border-cCard hover:bg-cCard text-white hover:text-black transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <HiOutlineChevronLeft className=' text-hCard' size={28} />
          </button>
          
          
          
          <button
            onClick={() => swiper?.slideNext()}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-transparent border border-cCard hover:bg-cCard text-white hover:text-black transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <HiOutlineChevronRight className=' text-hCard' size={28} />
          </button>
        </div>
      </div>

      {/* Custom Swiper Styles */}
      <style>{`        
        .testimonial-swiper .swiper-pagination-bullet {
          background: #8E7D3F;
          opacity: 0.5;
        }
        
        .testimonial-swiper .swiper-pagination-bullet-active {
          background: #DBD0A6;
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

export default Testimonial;
