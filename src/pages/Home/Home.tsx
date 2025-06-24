import React, { FC, useEffect, useState } from "react";

const Home: FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Ensure we start with black and then fade in
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Black overlay that fades out */}
      <div
        className={`fixed inset-0 bg-black z-40 transition-opacity duration-1000 ease-in-out ${
          isVisible ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      />

      <div>
        <div className="w-screen h-screen flex items-center justify-center bg-[url('/src/assets/images/svgs/home-photo.svg')] bg-cover bg-center relative">
          <div className="absolute inset-0 bg-black bg-opacity-50 z-0"></div>
          <div
            className="
              absolute
              left-[5vw] bottom-[5vh]
              z-10
              w-[35vw] max-w-[600px] h-auto
              aspect-[3/2]
              bg-[url('/src/assets/images/svgs/one-serving-all.svg')]
              bg-no-repeat bg-left-bottom bg-contain
            "
          ></div>
        </div>
        <div className="w-screen h-screen flex items-center justify-center bg-gray-200">
          <h1>hey2</h1>
        </div>
        <div className="w-screen h-screen flex items-center justify-center bg-gray-300">
          <h1>hey3</h1>
        </div>
        <div className="w-screen h-screen flex items-center justify-center bg-gray-400">
          <h1>hey4</h1>
        </div>
      </div>
    </>
  );
};

export default Home;
