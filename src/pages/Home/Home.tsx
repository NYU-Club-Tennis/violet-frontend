import React, { FC, useEffect, useState, useRef } from "react";
import { homePhoto, oneServingAll, home_1, home_2 } from "assets";

const Home: FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [imagesVisible, setImagesVisible] = useState(false);
  const imagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Ensure we start with black and then fade in
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setImagesVisible(true);
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    if (imagesRef.current) {
      observer.observe(imagesRef.current);
    }

    return () => {
      if (imagesRef.current) {
        observer.unobserve(imagesRef.current);
      }
    };
  }, []);

  return (
    <>
      {/* Black overlay that fades out */}
      <div
        className={`fixed inset-0 bg-black z-40 transition-opacity duration-1000 ease-in-out ${
          isVisible ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      />
        {/* Section 1 */}
        <div>
          <div className="w-screen h-screen flex items-center justify-center relative overflow-hidden">
            <img 
              src={homePhoto} 
              className="absolute inset-0 w-full h-full object-cover z-0"
            />
            <div className="absolute inset-0 bg-black bg-opacity-70 z-10"></div>
            <div className="absolute left-[5vw] bottom-[5vh] z-20 w-[35vw] max-w-[600px]">
              <img 
                src={oneServingAll} 
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        {/* Section 2 */}
        {/* Inclusivity Section */}
                <div className="w-screen min-h-screen flex items-center justify-center bg-nyu-purple-light py-8 px-4">
          <div className="w-full max-w-7xl flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-0">
            {/* Left Side - Images */}
            <div ref={imagesRef} className="w-full lg:w-1/2 lg:pr-8 relative order-2 lg:order-1">
              {/* Top Image */}
              <div className={`relative z-10 w-4/5 mx-auto lg:mx-0 transition-all duration-1000 ease-out ${
                imagesVisible 
                  ? 'opacity-100 transform translate-y-0' 
                  : 'opacity-0 transform translate-y-0'
              }`}>
                <img 
                  src={home_1} 
                  className="w-2/3 lg:w-2/3 h-auto object-contain mx-auto lg:mx-0"
                />
              </div>
              {/* Bottom Image */}
              <div className={`relative z-20 w-full ml-auto -mt-10 lg:-mt-20 pl-6 lg:pl-12 transition-all duration-1000 ease-out delay-300 ${
                imagesVisible 
                  ? 'opacity-100 transform translate-y-0 translate-x-0' 
                  : 'opacity-0 transform translate-y-0 translate-x-0'
              }`}>
                <img 
                  src={home_2} 
                  className="w-4/5 h-auto object-contain"
                />
              </div>
            </div>

            {/* Right Side - Title and Text */}
            <div className="w-full lg:w-1/2 lg:pl-12 text-center lg:text-left order-1 lg:order-2">
              <h1 className="text-white text-4xl lg:text-6xl font-bold mb-6 lg:mb-8 font-fugaz tracking-wider">
                TEXT ABT INCLUSIVITY
              </h1>
              <p className="text-white text-lg lg:text-xl leading-relaxed font-light max-w-md lg:max-w-none mx-auto lg:mx-0">
                yap about inclusivity Lorem ipsum dolor sit amet, consectetur 
                adipiscing elit, sed do eiusmod tempor incididunt ut labore et 
                dolore magna a
              </p>
            </div>
          </div>
        </div>
{/* Section 3 */}
        <div className="w-screen h-screen flex items-center justify-center bg-gray-300">
          <h1>hey3</h1>
        </div>
{/* Section 4 */}
        <div className="w-screen h-screen flex items-center justify-center bg-gray-400">
          <h1>hey4</h1>
        </div>
      </div>
    </>
  );
};

export default Home;
