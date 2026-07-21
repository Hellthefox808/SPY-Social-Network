"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";

function useTypewriter(text: string, speed = 38, startDelay = 600) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);

    const startTimer = setTimeout(() => {
      let index = 0;
      const interval = setInterval(() => {
        if (index < text.length) {
          setDisplayed(text.slice(0, index + 1));
          index++;
        } else {
          setDone(true);
          clearInterval(interval);
        }
      }, speed);

      return () => clearInterval(interval);
    }, startDelay);

    return () => clearTimeout(startTimer);
  }, [text, speed, startDelay]);

  return { displayed, done };
}

export default function MainframeHero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const serviceOptions = ["Brand", "Digital", "Campaign", "Other"];
  const { displayed, done } = useTypewriter("we'd love to\nhear from you!", 38, 600);

  // Desktop Mouse Scrubbing & Mobile Autoplay Hook
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let prevX: number | null = null;
    let targetTime = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (window.innerWidth < 1024) return;
      if (prevX === null) {
        prevX = e.clientX;
        return;
      }
      const delta = e.clientX - prevX;
      prevX = e.clientX;

      if (video.duration && !isNaN(video.duration)) {
        targetTime += (delta / window.innerWidth) * 0.8 * video.duration;
        targetTime = Math.max(0, Math.min(video.duration, targetTime));
        video.currentTime = targetTime;
      }
    };

    const handleSeeked = () => {
      // Smooth tracking frame to frame
    };

    video.addEventListener("seeked", handleSeeked);
    window.addEventListener("mousemove", handleMouseMove);

    // Mobile Autoplay fallback
    if (window.innerWidth < 1024) {
      video.autoplay = true;
      video.play().catch(() => {});
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      video.removeEventListener("seeked", handleSeeked);
    };
  }, []);

  const toggleService = (service: string) => {
    if (selectedServices.includes(service)) {
      setSelectedServices(selectedServices.filter((s) => s !== service));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  return (
    <div className="relative bg-white text-neutral-900 font-sans selection:bg-[#EAECE9] selection:text-[#1C2E1E] antialiased overflow-x-hidden flex flex-col lg:block lg:min-h-screen">
      {/* Background Video Component */}
      <div className="order-last lg:order-none relative lg:absolute lg:inset-0 lg:z-0 overflow-hidden pointer-events-none w-full aspect-square md:aspect-video lg:aspect-auto lg:h-full bg-neutral-50 lg:bg-transparent">
        <video
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover object-right lg:object-right-bottom"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260601_110537_3a579fa0-7bbc-4d94-9d25-0e816c7840f5.mp4"
        />
      </div>

      {/* Interactive Navbar */}
      <header className="fixed top-0 inset-x-0 z-10 px-5 sm:px-8 py-4 sm:py-5 flex flex-row justify-between items-center bg-transparent">
        {/* Logo (Left side) */}
        <div className="flex flex-row items-center gap-3">
          <span className="text-[21px] sm:text-[26px] tracking-tight text-black font-medium select-none">
            Mainframe&reg;
          </span>
          <span className="text-[25px] sm:text-[30px] text-black select-none tracking-[-0.02em] font-medium leading-none mb-1">
            &#10033;
          </span>
        </div>

        {/* Desktop Nav Links (Center) */}
        <nav className="hidden md:flex flex-row items-center text-[23px] text-black">
          <a href="#labs" className="hover:opacity-60 transition-opacity">
            Labs
          </a>
          <span className="opacity-40">,&nbsp;</span>
          <a href="#studio" className="hover:opacity-60 transition-opacity">
            Studio
          </a>
          <span className="opacity-40">,&nbsp;</span>
          <a href="#openings" className="hover:opacity-60 transition-opacity">
            Openings
          </a>
          <span className="opacity-40">,&nbsp;</span>
          <a href="#shop" className="hover:opacity-60 transition-opacity">
            Shop
          </a>
        </nav>

        {/* Desktop CTA (Right side) */}
        <a
          href="#contact"
          className="hidden md:inline-block text-[23px] text-black underline underline-offset-2 hover:opacity-60 transition-opacity"
        >
          Get in touch
        </a>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-[5px] z-20 focus:outline-none"
          aria-label="Toggle Navigation Menu"
        >
          <span
            className={`w-6 h-[2px] bg-black transition-all duration-300 ${
              isMobileMenuOpen ? "rotate-45 translate-y-[7px]" : ""
            }`}
          />
          <span
            className={`w-6 h-[2px] bg-black transition-all duration-300 ${
              isMobileMenuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`w-6 h-[2px] bg-black transition-all duration-300 ${
              isMobileMenuOpen ? "-rotate-45 -translate-y-[7px]" : ""
            }`}
          />
        </button>

        {/* Mobile Navigation Overlay */}
        <div
          className={`fixed inset-0 z-[9] bg-white/95 backdrop-blur-sm transition-all duration-300 md:hidden flex flex-col justify-center items-center px-6 ${
            isMobileMenuOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="flex flex-col items-center gap-6 text-2xl font-medium text-black">
            <a href="#labs" onClick={() => setIsMobileMenuOpen(false)}>
              Labs
            </a>
            <a href="#studio" onClick={() => setIsMobileMenuOpen(false)}>
              Studio
            </a>
            <a href="#openings" onClick={() => setIsMobileMenuOpen(false)}>
              Openings
            </a>
            <a href="#shop" onClick={() => setIsMobileMenuOpen(false)}>
              Shop
            </a>
            <a
              href="#contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="underline underline-offset-4 mt-4"
            >
              Get in touch
            </a>
          </div>
        </div>
      </header>

      {/* Content Layout Container */}
      <div className="relative z-10 flex flex-col order-first lg:order-none w-full bg-white lg:bg-transparent pb-8 lg:pb-0 lg:min-h-screen">
        <main
          id="spade-hero"
          className="w-full max-w-7xl mx-auto px-6 py-12 pt-28 sm:pt-32 flex-1 flex flex-col justify-center"
        >
          {/* Headline with Typewriter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl lg:text-[76px] font-normal tracking-tight text-black leading-[1.08] mb-8 select-none w-full whitespace-pre-wrap">
              {displayed}
              {!done && (
                <span className="inline-block w-[2px] h-[1.1em] bg-black align-middle ml-[2px] animate-blink" />
              )}
            </h1>
          </motion.div>

          {/* Secondary Description Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <p className="text-lg md:text-xl text-[#5A635A] leading-relaxed font-normal mb-14 max-w-2xl">
              Whether you have questions, feedback, <br />
              drop us a message and we'll get back to you as soon as possible.
            </p>
          </motion.div>

          {/* Interactive Multi-Select Service Pills */}
          <div className="w-full max-w-2xl">
            <h3 className="text-2xl font-medium tracking-tight mb-2 text-black">
              What sort of service?
            </h3>
            <p className="opacity-85 text-[#738273] mb-8">Select all that apply</p>

            <div className="flex flex-wrap gap-3 mb-8">
              {serviceOptions.map((service) => {
                const isActive = selectedServices.includes(service);
                return (
                  <motion.button
                    key={service}
                    type="button"
                    onClick={() => toggleService(service)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`px-6 py-3 rounded-full text-base font-medium transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                      isActive
                        ? "bg-[#1C2E1E] text-white shadow-md shadow-emerald-950/5 transform"
                        : "bg-white text-[#1C2E1E] border border-[#F1F3F1] hover:bg-[#F1F3F1]/55"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        <Check className="w-4 h-4 text-white" />
                      </motion.span>
                    )}
                    {service}
                  </motion.button>
                );
              })}
            </div>

            {/* Contingent Feedback Status Banner */}
            <AnimatePresence mode="wait">
              {selectedServices.length === 0 ? (
                <motion.p
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  exit={{ opacity: 0 }}
                  className="italic text-xs text-black"
                >
                  Please click to select services above.
                </motion.p>
              ) : (
                <motion.div
                  key="active"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-[#FAFBF9] border border-[#EAECE9] rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
                >
                  <span className="text-sm font-medium text-[#1C2E1E]">
                    Ready to inquire about:{" "}
                    <strong className="text-black font-semibold">
                      {selectedServices.join(", ")}
                    </strong>
                  </span>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1C2E1E] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#2c472f] transition cursor-pointer"
                  >
                    <span>Let's Go</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#4D6D47]" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
