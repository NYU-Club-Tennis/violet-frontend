import React, { FC, useEffect, useState, useRef } from "react";
import {
  homePhoto,
  oneServingAll,
  home_1,
  home_2,
  home_3,
  home_4,
  home_5,
  home_6,
  home_7,
  home_8,
  nyuAthleticLogo,
  home_9,
} from "assets";

const Home: FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);
  const [section2Visible, setSection2Visible] = useState(false);
  const [section3Visible, setSection3Visible] = useState(false);
  const [section4Visible, setSection4Visible] = useState(false);

  const heroRef = useRef<HTMLDivElement>(null);
  const section2Ref = useRef<HTMLDivElement>(null);
  const section3Ref = useRef<HTMLDivElement>(null);
  const section4Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      setTimeout(() => setHeroVisible(true), 300);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.2,
      rootMargin: "0px 0px -10% 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target;
          if (target === section2Ref.current) setSection2Visible(true);
          if (target === section3Ref.current) setSection3Visible(true);
          if (target === section4Ref.current) setSection4Visible(true);
        }
      });
    }, observerOptions);

    [section2Ref, section3Ref, section4Ref].forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative overflow-hidden">
      {/* Animated Background Gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-nyu-blue to-nyu-purple opacity-20 animate-pulse pointer-events-none" />

      {/* Loading Overlay */}
      <div
        className={`fixed inset-0 bg-black z-50 transition-all duration-1500 ease-out ${
          isVisible ? "opacity-0 pointer-events-none scale-110" : "opacity-100"
        }`}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-nyu-purple border-t-transparent rounded-full animate-spin" />
        </div>
      </div>

      {/* Hero Section - Completely Redesigned */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Dynamic Background */}
        <div className="absolute inset-0">
          <img
            src={homePhoto}
            className="absolute inset-0 w-full h-full object-cover scale-105"
            alt="Tennis background"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40" />
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-nyu-purple/20 rounded-full blur-xl animate-float" />
        <div
          className="absolute bottom-40 left-20 w-24 h-24 bg-white/10 rounded-full blur-lg animate-float"
          style={{ animationDelay: "2s" }}
        />

        {/* Hero Content */}
        <div
          className={`relative z-10 max-w-7xl mx-auto px-6 pt-24 md:pt-32 text-center transition-all duration-1500 ${
            heroVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-12"
          }`}
        >
          {/* Logo with Glow Effect */}

          {/* Main Title with Glass Effect */}
          <div className="relative mb-8">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-white/90 font-lexend tracking-widest mt-2">
              NYU
            </h2>
            <h1 className="text-7xl md:text-8xl lg:text-9xl font-bold bg-gradient-to-r from-white via-purple-200 to-nyu-purple bg-clip-text text-transparent font-fugaz tracking-wider leading-none">
              CLUB TENNIS
            </h1>
          </div>

          {/* Tagline with Backdrop Blur */}
          <div className="backdrop-blur-sm bg-white/10 rounded-2xl border border-white/20 p-8 mb-12 shadow-glass-xl">
            <img
              src={oneServingAll}
              className="w-full max-w-md mx-auto opacity-90"
              alt="One Serving All"
            />
          </div>

          {/* CTA Buttons */}
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Section 2 - Community & Inclusivity */}
      <section
        ref={section2Ref}
        className="relative min-h-screen bg-gradient-to-br from-nyu-purple-light via-purple-600 to-nyu-purple overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-96 h-96 border border-white/20 rounded-full" />
          <div className="absolute bottom-20 right-20 w-64 h-64 border border-white/20 rounded-full" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Content */}
            <div
              className={`transition-all duration-1000 delay-300 ${
                section2Visible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-12"
              }`}
            >
              <div className="mb-8">
                <span className="text-white/60 text-lg font-medium tracking-wider uppercase">
                  Community
                </span>
                <h2 className="text-5xl lg:text-6xl font-bold text-white font-fugaz tracking-wide mt-2 mb-6">
                  Recreational Play
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-white to-purple-200 rounded-full" />
              </div>

              <p className="text-xl text-white/90 leading-relaxed font-light mb-8">
                Our NYU tennis community emphasizes connection, inclusivity, and
                making it easier to play the game we love. We help students find
                playing partners and organize matches so that players of similar
                levels can enjoy competitive, fun tennis together. Whether
                you’re looking for a rally, a match, or simply fellow fans to
                share the court with, we’re here to bring NYU tennis players
                together.
              </p>

              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2"></div>
                  <div className="text-white/70"></div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2"></div>
                  <div className="text-white/70"></div>
                </div>
              </div>
            </div>

            {/* Images with Modern Layout */}
            <div
              className={`relative h-[600px] transition-all duration-1000 ${
                section2Visible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-12"
              }`}
            >
              <div className="absolute top-0 left-0 w-3/5 h-3/5 overflow-hidden rounded-3xl shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <img
                  src={home_1}
                  className="w-full h-full object-cover"
                  alt="Tennis community"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              <div className="absolute bottom-0 right-0 w-3/5 h-3/5 overflow-hidden rounded-3xl shadow-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-500 delay-200">
                <img
                  src={home_2}
                  className="w-full h-full object-cover"
                  alt="Tennis players"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              {/* Floating accent */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/20 rounded-full blur-2xl animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* Section 3 - Excellence & Training */}
      <section
        ref={section3Ref}
        className="relative min-h-screen bg-gradient-to-br from-black via-gray-900 to-nyu-blue overflow-hidden"
      >
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Images First on Mobile, Second on Desktop */}
            <div
              className={`relative h-[600px] lg:order-1 transition-all duration-1000 delay-200 ${
                section3Visible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-12"
              }`}
            >
              <div className="absolute inset-0 grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="h-2/3 overflow-hidden rounded-2xl shadow-xl transform hover:scale-105 transition-transform duration-500">
                    <img
                      src={home_3}
                      className="w-full h-full object-cover"
                      alt="Training session"
                    />
                  </div>
                  <div className="h-1/3 overflow-hidden rounded-2xl shadow-xl transform hover:scale-105 transition-transform duration-500 delay-100">
                    <img
                      src={home_4}
                      className="w-full h-full object-cover"
                      alt="Tennis court"
                    />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="h-1/3 overflow-hidden rounded-2xl shadow-xl transform hover:scale-105 transition-transform duration-500 delay-200">
                    <img
                      src={home_5}
                      className="w-full h-full object-cover"
                      alt="Tennis equipment"
                    />
                  </div>
                  <div className="h-2/3 overflow-hidden rounded-2xl shadow-xl transform hover:scale-105 transition-transform duration-500 delay-300 relative">
                    <img
                      src={home_9}
                      className="w-full h-full object-cover object-center absolute inset-0"
                      alt="Tennis match"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div
              className={`lg:order-2 transition-all duration-1000 delay-500 ${
                section3Visible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-12"
              }`}
            >
              <div className="mb-8">
                <span className="text-gray-400 text-lg font-medium tracking-wider uppercase">
                  Commitment to Excellence
                </span>
                <h2 className="text-5xl lg:text-6xl font-bold text-white font-fugaz tracking-wide mt-2 mb-6">
                  Competitive Team
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-nyu-purple to-purple-400 rounded-full" />
              </div>

              <p className="text-xl text-gray-300 leading-relaxed font-light mb-8">
                We believe in the power of teamwork and the importance of
                supporting each other. Our competitive team is a group of
                dedicated players who are committed to improving their skills
                and winning together. We train hard, play hard, and celebrate
                our successes together.
              </p>

              {/* {<div className="space-y-4">
                {[
                  "Professional Coaching",
                  "State-of-the-Art Facilities",
                  "Competitive Tournaments",
                  "Personalized Programs",
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-nyu-purple rounded-full animate-pulse" />
                    <span className="text-white font-medium">{item}</span>
                  </div>
                ))}
              </div>} */}
            </div>
          </div>
        </div>
      </section>

      {/* Section 4 - Join CTA with Modern Design */}
      <section
        ref={section4Ref}
        className="relative min-h-screen bg-gradient-to-t from-nyu-purple-light to-purple-600 overflow-hidden"
      >
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full opacity-50">
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
          {/* Header */}
          <div
            className={`text-center mb-16 transition-all duration-1000 ${
              section4Visible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-12"
            }`}
          >
            <h2 className="text-6xl lg:text-7xl font-bold text-white font-fugaz tracking-wide mb-6">
              Ready to Serve?
            </h2>
            <p className="text-2xl text-white/90 font-light max-w-3xl mx-auto">
              Join the Violet Tennis family and discover your potential on and
              off the court
            </p>
          </div>

          {/* Image Gallery with Modern Grid */}
          <div
            className={`grid grid-cols-1 md:grid-cols-3 gap-1 rounded-3xl overflow-hidden shadow-2xl mb-16 transition-all duration-1000 delay-300 ${
              section4Visible ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
          >
            {[home_6, home_7, home_8].map((image, index) => (
              <div
                key={index}
                className="relative group overflow-hidden aspect-square md:aspect-[4/5]"
              >
                <img
                  src={image}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  alt={`Tennis action ${index + 1}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
