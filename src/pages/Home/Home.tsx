import React, { FC, useEffect, useState, useRef } from "react";
import { homePhoto, oneServingAll, home_1, home_2, home_3, home_4, home_5, home_6, home_7, home_8 } from "assets";

const Home: FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [imagesVisible, setImagesVisible] = useState(false);
  const [images2Visible, setImages2Visible] = useState(false);
  const imagesRef = useRef<HTMLDivElement>(null);
  const images2Ref = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const observer2 = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setImages2Visible(true);
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    if (images2Ref.current) {
      observer2.observe(images2Ref.current);
    }

    return () => {
      if (images2Ref.current) {
        observer2.unobserve(images2Ref.current);
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
        <div className="w-screen min-h-screen flex items-center justify-center bg-nyu-purple-light py-8 px-4 overflow-hidden">
          <div className="w-full max-w-7xl flex flex-col items-center justify-between gap-8">
            {/* Images */}
            <div ref={imagesRef} className="relative order-2 lg:order-2 w-full lg:w-full h-[380px] md:h-[440px] lg:h-[480px] overflow-hidden">
              {/* Left Image */}
              <div className={`absolute z-10 top-0 left-0 lg:left-40 w-[60%] lg:w-[30%] 
                              transition-all duration-1000 ease-out ${
                imagesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-0'
              }`}>
                <img src={home_1} className="w-full h-auto object-contain" />
              </div>
              {/* Right Image */}
               <div className={`absolute z-20 top-10 left-[34%] lg:top-5 lg:left-[38%] w-[64%] lg:w-[40%]
                              transition-all duration-1000 ease-out delay-300 ${
                imagesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-0'
              }`}>
                <img src={home_2} className="w-full h-auto object-contain" />
              </div>
            </div>

            {/*Title and Text */}
            <div className="w-full lg:w-full lg:pl-0 text-center order-1 ">
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
      <div className="w-screen min-h-screen flex items-center justify-center bg-black">
        <div className="w-full max-w-7xl flex flex-col lg:flex-row items-center lg:items-center justify-center lg:justify-start gap-8 lg:gap-16 m-4 md:m-0">
          
          {/* Left Side - Images */}
          <div ref={images2Ref} className="relative w-full lg:w-1/2 flex justify-center lg:justify-start h-[420px] md:h-[460px] lg:h-[520px] overflow-hidden">
            {/* Left image */}
            <div className={`absolute top-8 left-0 w-[40%] z-10 transition-all duration-1000 ease-out ${
              images2Visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-0'
            }`}>
              <img src={home_3} className="w-full h-auto object-cover" />
            </div>
            {/* Center image */}
            <div className={`absolute top-20 left-[20%] lg:left-[25%] w-[45%] z-20 max-w-[min(55vw,560px)] transition-all duration-1000 ease-out delay-200 ${
              images2Visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-0'
            }`}>
              <img src={home_4} className="w-full h-auto object-cover" />
            </div>
            {/* Right/front image */}
            <div className={`absolute top-32 left-[50%] lg:left-[50%] w-[55%] z-30 max-w-[min(60vw,640px)] transition-all duration-1000 ease-out delay-1200 ${
              images2Visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-0'
            }`}>
              <img src={home_5} className="w-full h-auto object-cover" />
            </div>
          </div>

          {/* Right Side - Title and Text */}
          <div className="w-full lg:w-1/3 xl:w-2/5 lg:pl-12 text-center lg:text-left order-1 lg:order-2">
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

      {/* Section 4 - Join CTA */}
        <div className="w-screen min-h-screen flex flex-col items-center justify-start bg-nyu-purple-light pt-12 pb-0">
          {/* Header (same font as other sections) */}
          <div className="w-full max-w-7xl px-4 mt-5">
            <h2 className="text-white text-center tracking-wider text-4xl md:text-5xl lg:text-6xl mb-8">
              Some text about telling them to join!!!
            </h2>
          </div>
          {/* Image row: show only first image on small screens */}
          <div className="w-screen grid grid-cols-1 md:grid-cols-3 gap-0 mt-12">
            <img src={home_6} className="hidden md:block w-full h-64 md:h-[320px] lg:h-[360px] object-cover" />
            <img src={home_7} className="hidden md:block w-full h-64 md:h-[320px] lg:h-[360px] object-cover" />
            <img src={home_8} className="w-full h-64 md:h-[320px] lg:h-[360px] object-cover" />
          </div>
          {/* Rounded footer */}
          <div className="w-screen h-20 md:h-24 lg:h-28 bg-white rounded-t-[56px] mt-auto"></div>
        </div>
      </div>
    </>
  );
};

export default Home;
