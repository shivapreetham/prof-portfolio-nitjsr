"use client"

import { useState } from "react"
import { useUser } from "./Provider"
import { Mail, Linkedin, ArrowRight } from "lucide-react"
import Header from "./components/Header"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const { userData } = useUser()

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
    )
  }

  const slides = [
    { id: 1, type: "image", src: userData.user.profileImage },
    { id: 2, type: "placeholder" },
    { id: 3, type: "placeholder" },
    { id: 4, type: "placeholder" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 text-[#223843]">
      {/* Header Section */}
      <Header user={userData.user} />

      <section className="relative">
        <Navbar />
        <div className="w-full flex -mt-5 justify-center bg-white px-2 sm:px-4">
          <div className="relative w-full sm:w-[95%] md:w-[90%] lg:w-[85%] max-w-[1200px] rounded-b-xl shadow-md bg-white">
            <div className="w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] bg-gray-100 relative rounded-b-xl overflow-hidden">
              {slides[currentSlide].type === "image" ? (
                <img
                  src={slides[currentSlide].src || "/placeholder.svg"}
                  alt={`Slide ${currentSlide + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-700 text-lg sm:text-xl md:text-2xl">
                  Placeholder Slide {currentSlide + 1}
                </div>
              )}

              <div className="hidden md:block absolute top-6 right-6 lg:top-8 lg:right-8 bg-white rounded-lg p-5 lg:p-6 shadow-xl border border-gray-200 max-w-sm">
                <div className="border-b border-gray-200 pb-3 mb-3">
                  <h3 className="text-base md:text-lg font-semibold text-[#064A6E] leading-tight">
                    Assistant Professor
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">NIT Jamshedpur</p>
                </div>

                <div className="space-y-1.5 mb-4 text-sm text-gray-700">
                  <p className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Faculty In Charge, Computer Centre</span>
                  </p>
                  <p className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Prof. In Charge, NIMCET 2024</span>
                  </p>
                </div>

                <div className="space-y-2 text-sm border-t border-gray-200 pt-3">
                  <p className="text-gray-700 flex flex-col">
                    <span className="font-semibold text-gray-800 mb-0.5">Email</span>
                    <span className="break-all text-gray-600">{userData.user.email || "contact@example.com"}</span>
                  </p>
                  <p className="text-gray-700 flex flex-col">
                    <span className="font-semibold text-gray-800 mb-0.5">Phone</span>
                    <span className="text-gray-600">(+91)-XXX-XXXX-XXXX</span>
                  </p>
                </div>

                <div className="flex gap-3 mt-4 pt-3 border-t border-gray-200">
                  {userData.user.linkedIn && (
                    <a
                      href={userData.user.linkedIn}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 bg-[#0077b5] rounded-md flex items-center justify-center hover:bg-[#005885] transition-colors shadow-sm"
                      aria-label="LinkedIn Profile"
                    >
                      <Linkedin className="w-4 h-4 text-white" />
                    </a>
                  )}
                  {userData.user.email && (
                    <a
                      href={`mailto:${userData.user.email}`}
                      className="w-9 h-9 bg-[#0891B2] rounded-md flex items-center justify-center hover:bg-[#064A6E] transition-colors shadow-sm"
                      aria-label="Send Email"
                    >
                      <Mail className="w-4 h-4 text-white" />
                    </a>
                  )}
                  {userData.user.website && (
                    <a
                      href={userData.user.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 bg-gray-700 rounded-md flex items-center justify-center hover:bg-gray-800 transition-colors shadow-sm"
                      aria-label="Visit Website"
                    >
                      <ArrowRight className="w-4 h-4 text-white" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Dot Indicators */}
            <div className="absolute bottom-2 sm:bottom-3 md:bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 sm:gap-3">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded-full transition-all duration-200 ${
                    currentSlide === index ? "bg-white scale-110" : "bg-white/50 hover:bg-white/70"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-10 z-10 relative">
        <section className="mb-12 sm:mb-16 md:mb-20 px-2 sm:px-4 md:px-6 max-w-5xl mx-auto text-left">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#064A6E] mb-2 leading-tight">
            Welcome to my Homepage
          </h2>
          <div className="h-[2px] w-16 sm:w-24 md:w-32 bg-[#0284C7] mb-4 sm:mb-6" />

          <div className="bg-white p-4 sm:p-5 rounded-lg border-l-4 border-[#0891B2] shadow-sm mb-4 sm:mb-6">
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              <span className="font-semibold text-[#064A6E]">Current Position:</span> Assistant Professor at NIT Jamshedpur, Faculty In Charge of Computer Centre and MVI Lab
            </p>
          </div>

          <div className="prose prose-sm sm:prose-base max-w-none">
            <p className="text-gray-800 text-sm sm:text-base leading-relaxed mb-4">{userData.user.bio}</p>
          </div>
        </section>
      </main>

      <Footer user={userData.user}/>
    </div>
  )
}
