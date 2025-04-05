"use client"
import { useUser } from "./Provider"
import { Mail, Linkedin, MapPin, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

export default function Home() {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 text-[#223843] relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] bg-[#0093cb]/10 rounded-full blur-3xl z-0 animate-pulse" />
      <div
        className="absolute bottom-[-100px] left-[-100px] w-[500px] h-[500px] bg-[#663399]/10 rounded-full blur-3xl z-0 animate-pulse"
        style={{ animationDelay: "1s" }}
      />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/50 rounded-full blur-3xl z-0" />

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center z-10 relative px-6">
        <div className="max-w-7xl w-full flex flex-col-reverse lg:flex-row items-center justify-between gap-12 lg:gap-20">
          {/* Text Content */}
          <motion.div
            className="flex-1 text-center lg:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-[#0093cb] to-[#663399] text-transparent bg-clip-text">
                {userData.user.name}
              </span>
            </h1>

            <p className="text-lg leading-relaxed text-zinc-600 mb-8 max-w-xl mx-auto lg:mx-0">
              {userData.user.bio}
            </p>

            {/* Contact Links */}
            <div className="mt-8 flex flex-wrap gap-4 justify-center lg:justify-start">
              {userData.user.location && (
                <motion.div
                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 147, 203, 0.2)" }}
                  className="flex items-center gap-2 bg-gradient-to-r from-[#0093cb] to-[#0093cb]/90 text-white px-5 py-3 rounded-xl shadow-md"
                >
                  <MapPin className="w-4 h-4" />
                  {userData.user.location}
                </motion.div>
              )}

              <motion.a
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 147, 203, 0.2)" }}
                href={`mailto:${userData.user.email}`}
                className="flex items-center gap-2 border-2 border-[#0093cb] text-[#0093cb] px-5 py-3 rounded-xl shadow-sm hover:bg-[#0093cb] hover:text-white transition-all"
              >
                <Mail className="w-4 h-4" />
                {userData.user.email}
              </motion.a>

              {userData.user.linkedIn && (
                <motion.a
                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 147, 203, 0.2)" }}
                  href={userData.user.linkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 border-2 border-[#0093cb] text-[#0093cb] px-5 py-3 rounded-xl shadow-sm hover:bg-[#0093cb] hover:text-white transition-all group"
                >
                  <Linkedin className="w-4 h-4" />
                  <span>LinkedIn</span>
                  <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </motion.a>
              )}
            </div>
          </motion.div>

          {/* Profile Image */}
          <div className="flex-1 flex justify-center relative">
            <div className="relative w-80 h-80 lg:w-[420px] lg:h-[420px] group transition-all duration-300">
              <div className="w-full h-full rounded-full border-[6px] border-[#0093cb] overflow-hidden shadow-2xl transition-all duration-300">
                <img
                  src={userData.user.profileImage}
                  alt={userData.user.name}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Teaching Experience Timeline */}
      <main className="container mx-auto px-6 py-24 z-10 relative">
        {userData.teachingExperiences?.length > 0 && (
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
                    <h3 className="text-2xl font-bold text-[#0093cb] mb-1">{item.subject}</h3>
                    <p className="text-black font-semibold mb-2">{item.institution}</p>
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
                      <p className="text-gray-600 text-sm">{item.description}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
