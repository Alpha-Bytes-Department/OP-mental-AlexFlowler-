import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { useEffect, useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import {
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiXMark,
} from "react-icons/hi2";
import { useAxios } from "../../Providers/AxiosProvider";
import { FaUserAlt } from "react-icons/fa";

const Testimonial = () => {
  const axios = useAxios();
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTestimonial, setSelectedTestimonial] = useState<any | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (testimonial: any) => {
    setSelectedTestimonial(testimonial);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTestimonial(null);
  };

  useEffect(() => {
    // Fetch testimonials from API
    axios
      .get("/api/reviews/")
      .then((res) => {
        console.log("Testimonials fetched:", res.data);
        setTestimonials(res.data);
      })
      .catch((err) => {
        // Handle error - use fallback data or show error message
        console.error("Failed to fetch testimonials:", err);
        // Use fallback testimonials when API fails
      })
      .finally(() => {
        setLoading(false);
      });
  }, [axios]);

  // const testimonials = [
  //   {
  //     id: 1,
  //     name: "John Smith",
  //     role: "CEO, TechCorp",
  //     content: "This platform has revolutionized how we manage our corporate operations. The team collaboration features are outstanding.",
  //     avatar: "./user.png"
  //   },
  //   {
  //     id: 2,
  //     name: "Sarah Johnson",
  //     role: "Project Manager, StartupXYZ",
  //     content: "The project management tools are intuitive and powerful. Our productivity has increased by 40% since implementation.",
  //     avatar: "./user.png"
  //   },
  //   {
  //     id: 3,
  //     name: "Michael Chen",
  //     role: "CTO, Innovation Labs",
  //     content: "Excellent resource scheduling and version control features. Perfect for large-scale enterprise projects.",
  //     avatar: "./user.png"
  //   },
  //   {
  //     id: 4,
  //     name: "Emma Davis",
  //     role: "Lead Developer, CodeWorks",
  //     content: "The advanced analytics provide insights we never had before. Game-changer for our development workflow.",
  //     avatar: "./user.png"
  //   }
  // ];

  return (
    <div className=" py-16">
      <div className="flex justify-center mb-12">
        <div className="flex items-center gap-3.5 px-4 py-3 mx-auto rounded-lg border border-hCard bg-[#00000080]">
          <div className="h-2 w-2 rounded-full bg-hCard"></div>
          <h2 className="text-xl font-bold text-white">
            Testimonials / Expert Backing
          </h2>
        </div>
      </div>

      {/* Testimonial Swiper */}
      <div className=" mx-auto px-4">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hCard"></div>
          </div>
        ) : testimonials.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">
              No testimonials available at the moment.
            </p>
          </div>
        ) : (
          <>
            <Swiper
              onSwiper={setSwiper}
              modules={[Pagination, Autoplay]}
              spaceBetween={20}
              slidesPerView={1}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                  spaceBetween: 24,
                },
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 30,
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
                <SwiperSlide key={testimonial.id} className="">
                  <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 h-60 w-full max-w-lg mx-auto flex flex-col justify-between">
                    <div className="flex-grow">
                      <p className="text-gray-300 leading-relaxed text-sm sm:text-base text-start line-clamp-4 mb-4">
                        {testimonial.description}
                      </p>
                      {testimonial.description &&
                        testimonial.description.length > 100 && (
                          <button
                            onClick={() => openModal(testimonial)}
                            className="text-hCard cursor-pointer hover:text-cCard text-sm font-medium transition-colors duration-200 mb-4 block text-left"
                          >
                            See More...
                          </button>
                        )}
                    </div>

                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center">
                        <div className=" rounded-full border border-hCard p-1 size-14 flex flex-col justify-center mr-3">
                          {testimonial.user.profile_image ? (
                            <img
                              src={testimonial.user.profile_image}
                              alt={testimonial.user.name}
                              className="size-12 rounded-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.onerror = null;
                                target.src = "";
                                target.style.display = "none";
                                const nextSibling = target.nextElementSibling;
                                if (nextSibling && nextSibling instanceof HTMLElement) nextSibling.style.display = "flex";
                              }}
                            />
                          ) : <FaUserAlt size={30} className="text-hCard mx-auto my-auto" />}
                        </div>
                        
                        
                        <div className="min-w-0 ">
                          <h3 className="text-hCard text-sm sm:text-lg font-montserrat font-semibold truncate">
                            {testimonial.user.name}
                          </h3>
                          <p className="font-montserrat font-semibold text-hCard text-left text-xs sm:text-sm truncate">
                            {testimonial.role}
                          </p>
                        </div>
                      </div>

                      <div className="flex bg-hCard px-2 sm:px-3 py-1 rounded-full ml-2 flex-shrink-0">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className="text-cCard text-sm sm:text-lg"
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Navigation Buttons */}
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                onClick={() => swiper?.slidePrev()}
                className="flex items-center justify-center w-12 h-12 rounded-full bg-transparent border border-cCard hover:bg-cCard text-white hover:text-black transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <HiOutlineChevronLeft className=" text-hCard" size={28} />
              </button>

              <button
                onClick={() => swiper?.slideNext()}
                className="flex items-center justify-center w-12 h-12 rounded-full bg-transparent border border-cCard hover:bg-cCard text-white hover:text-black transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <HiOutlineChevronRight className=" text-hCard" size={28} />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Modal for full testimonial text */}
      {isModalOpen && selectedTestimonial && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800/90 backdrop-blur-xl border border-hCard rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto relative animate-fadeIn">
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200"
            >
              <HiXMark size={24} />
            </button>

            {/* Header */}
            <div className="flex items-center mb-6 pr-8">
              <img
                src={selectedTestimonial.user.profile_image}
                alt={selectedTestimonial.user.name}
                className="w-16 h-16 rounded-full mr-4 object-cover"
              />
              <div>
                <h3 className="text-hCard text-xl font-montserrat font-semibold">
                  {selectedTestimonial.user.name}
                </h3>
                <p className="font-montserrat font-semibold text-hCard text-base">
                  {selectedTestimonial.role}
                </p>
              </div>
            </div>

            {/* Full testimonial text */}
            <div className="mb-6">
              <p className="text-gray-300 leading-relaxed text-base">
                {selectedTestimonial.description}
              </p>
            </div>

            {/* Rating */}
            <div className="flex justify-center">
              <div className="flex bg-hCard px-4 py-2 rounded-full">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-cCard text-xl">
                    ★
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

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
