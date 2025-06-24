"use client";
import { useState } from "react";
import { useUser } from "./Provider";
import { Mail, Linkedin, MapPin, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function Home() {
  const { userData } = useUser();

  if (!userData?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-[#0093cb] border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-[#663399] border-b-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  const slides = [
    { id: 1, type: "image", src: userData.user.profileImage },
    { id: 2, type: "placeholder" },
    { id: 3, type: "placeholder" },
    { id: 4, type: "placeholder" },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 text-[#223843]">
      {/* Header Section */}
      <header className="bg-[#0891B2] text-[#064A6E] px-6 py-4 text-left">
        <div className="max-w-screen-xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#022B35]">
            {userData.user.name}
          </h1>
          <p className="text-sm sm:text-base mt-2 font-semibold">
            Associate Professor at NIT Jamshedpur
          </p>
          <p className="text-xs sm:text-sm">
            Faculty In Charge, Computer Centre
          </p>
          <p className="text-xs italic">Prof. In Charge, NIMCET 2024</p>
        </div>
      </header>

      <section className="relative">
        <Navbar />

        {/* Centered Carousel */}
        <div className="w-full flex -mt-5 justify-center bg-white">
          <div className="relative w-[95%] md:w-[90%] lg:w-[85%] max-w-[1200px] rounded-b-xl overflow-hidden shadow-md bg-white">
            {/* Slide Display */}
            <div className="w-full h-[400px] bg-gray-100">
              {slides[currentSlide].type === "image" ? (
                <img
                  src={slides[currentSlide].src}
                  alt={`Slide ${currentSlide + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-700 text-2xl">
                  Placeholder Slide {currentSlide + 1}
                </div>
              )}

              {/* Info Card Overlay */}
              <div className="absolute top-8 right-8 bg-white/95 backdrop-blur-sm rounded-lg p-6 shadow-lg max-w-sm">
                <h3 className="text-lg font-bold text-[#064A6E] mb-2">
                  Associate Professor at NIT Jamshedpur
                </h3>
                <p className="text-sm text-gray-600 mb-1">
                  Faculty In Charge, Computer Centre
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  Prof. In Charge, NIMCET 2024
                </p>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-700">
                    <span className="font-semibold">Email:</span>{" "}
                    {userData.user.email || "contact@example.com"}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Phone:</span>{" "}
                    (+91)-XXX-XXXX-XXXX
                  </p>
                </div>

                <div className="flex gap-3 mt-4">
                  {/* LinkedIn */}
                  {userData.user.linkedIn && (
                    <a
                      href={userData.user.linkedIn}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 bg-[#0077b5] rounded flex items-center justify-center"
                      aria-label="LinkedIn Profile"
                    >
                      <Linkedin className="w-4 h-4 text-white" />
                    </a>
                  )}

                  {/* Email */}
                  {userData.user.email && (
                    <a
                      href={`mailto:${userData.user.email}`}
                      className="w-8 h-8 bg-[#1da1f2] rounded flex items-center justify-center"
                      aria-label="Send Email"
                    >
                      <Mail className="w-4 h-4 text-white" />
                    </a>
                  )}

                  {/* Example - Website or Redirect */}
                  {userData.user.website && (
                    <a
                      href={userData.user.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 bg-[#ff0000] rounded flex items-center justify-center"
                      aria-label="Visit Website"
                    >
                      <ArrowRight className="w-4 h-4 text-white" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Dot Indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full ${
                    currentSlide === index ? "bg-white" : "bg-white/50"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-10 z-10 relative">
        <section className="mb-20 px-6 max-w-5xl mx-auto text-left">
          <h2 className="text-4xl font-semibold text-[#064A6E] mb-2">
            Welcome to my Homepage
          </h2>
          <div className="h-[2px] w-400 bg-[#0284C7] mb-6" />

          <div className="bg-gray-100 p-4 rounded-md border border-gray-300 mb-6 text-sm italic text-gray-700">
            <span className="font-semibold text-[#39A7C1] not-italic">
              Currently I am serving as Associate Professor at NIT Jamshedpur
              and Faculty In Charge of Computer Centre and MVI Lab
            </span>
          </div>

          <p className="text-gray-800 text-base leading-relaxed mb-4">
            {userData.user.bio}
          </p>
        </section>

        {/* {userData.teachingExperiences?.length > 0 && (
          <section className="relative z-10">
            <h2 className="text-4xl font-bold text-center text-[#223843] mb-20">
              Teaching Experience
            </h2>

            <div className="relative border-l-4 border-[#0093cb]/30 ml-6">
              {userData.teachingExperiences.map((item, index) => (
                <motion.div
                  key={item._id || index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="mb-12 ml-8 relative"
                >
                  <div className="bg-white/80 backdrop-blur-lg border border-[#0093cb]/10 rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300">
                    <h3 className="text-2xl font-bold text-[#0093cb] mb-1">
                      {item.subject}
                    </h3>
                    <p className="text-black font-semibold mb-2">
                      {item.institution}
                    </p>
                    <p className="text-sm text-gray-700 mb-2">
                      {new Date(item.startDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                      })}{" "}
                      –{" "}
                      {item.endDate
                        ? new Date(item.endDate).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                          })
                        : "Present"}
                    </p>
                    {item.description && (
                      <p className="text-gray-600 text-sm">
                        {item.description}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}*/}
      </main>
      <Footer />
    </div>
  );
}
