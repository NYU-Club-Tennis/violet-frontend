import React, { FC } from "react";

const Home: FC = () => {
  return (
    <div>
      <div className="w-screen h-screen flex items-center justify-center 
                      bg-[url('/src/assets/images/svgs/home-photo.svg')] bg-cover bg-center relative">
        <div className="absolute inset-0 bg-black bg-opacity-50 z-0"></div>
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
  );
};

export default Home;
