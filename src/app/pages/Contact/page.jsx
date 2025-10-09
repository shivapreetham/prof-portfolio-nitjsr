"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ChevronRight,
  Mail,
  ExternalLink,
  Globe,
  User,
  Award,
  Calendar,
  Send,
  Phone,
} from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

const Contact = () => {
  const [person, setPerson] = useState(null);
  const [personLoaded, setPersonLoaded] = useState(false);
  const [meetingForm, setMeetingForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    preferredDate: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const personData = await fetch(
          `https://nitjsr.ac.in/backend/api/people/faculty?id=CS103`
        );
        const res = await personData.json();
        setPerson(res[0]);
        setPersonLoaded(true);
      } catch (error) {
        console.error("Error fetching contact data:", error);
        setPersonLoaded(true);
      }
    };
    getData();
  }, []);

  const handleMeetingFormChange = (e) => {
    const { name, value } = e.target;
    setMeetingForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleMeetingSubmit = async (e) => {
    e.preventDefault();
    if (
      !meetingForm.name ||
      !meetingForm.email ||
      !meetingForm.subject ||
      !meetingForm.message ||
      !meetingForm.preferredDate
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/meeting-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(meetingForm),
      });

      if (!response.ok) throw new Error("Failed to submit meeting request");

      toast.success(
        "Meeting request submitted successfully! We will get back to you soon."
      );
      setMeetingForm({
        name: "",
        email: "",
        subject: "",
        message: "",
        preferredDate: "",
      });
    } catch (error) {
      console.error("Error submitting meeting request:", error);
      toast.error("Failed to submit meeting request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 text-[#223843]">
      {/* Header Section */}

      {/* Main Content */}
      <main className="container mx-auto px-6 py-10 max-w-6xl">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-[#0284C7] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[#0284C7] font-medium">Contact</span>
        </nav>

        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-[#064A6E] mb-2">
            Contact Information
          </h1>
          <div className="h-[3px] w-24 bg-[#0284C7] rounded-full"></div>
        </motion.div>

        {personLoaded ? (
          person ? (
            <div className="grid md:grid-cols-2 gap-8">
              {/* Contact Details */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
              >
                <h2 className="text-2xl font-semibold text-[#064A6E] mb-6 flex items-center">
                  <Mail className="w-6 h-6 mr-3 text-[#0284C7]" />
                  Contact Details
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Mail className="w-5 h-5 text-[#0284C7]" />
                    <div>
                      <span className="font-medium text-gray-700">Email:</span>
                      <p className="text-[#064A6E]">{person.email || "N/A"}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Phone className="w-5 h-5 text-[#0284C7]" />
                    <div>
                      <span className="font-medium text-gray-700">Phone:</span>
                      <p className="text-[#064A6E]">
                        {person.phone || "(+91)-9102197734"}
                      </p>
                    </div>
                  </div>

                  {person.fb_id && (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <User className="w-5 h-5 text-[#0284C7]" />
                      <div>
                        <span className="font-medium text-gray-700">
                          Social:
                        </span>
                        <a
                          href={person.fb_id}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#0284C7] hover:underline ml-2 flex items-center"
                        >
                          Facebook <ExternalLink className="w-4 h-4 ml-1" />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Professional Links */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
              >
                <h3 className="text-2xl font-semibold text-[#064A6E] mb-6 flex items-center">
                  <Globe className="w-6 h-6 mr-3 text-[#0284C7]" />
                  Professional Links
                </h3>
                <div className="grid gap-3">
                  {[
                    {
                      label: "Google Scholar",
                      value: person.scholar_link,
                      icon: Award,
                    },
                    {
                      label: "Website",
                      value: person.pw_link,
                      icon: Globe,
                    },
                    {
                      label: "Publon",
                      value: person.publon_id,
                      icon: Award,
                    },
                    {
                      label: "Orcid",
                      value: "https://orcid.org/0000-0002-5614-6098",
                      icon: User,
                    },
                    {
                      label: "Vidwan",
                      value:
                        person.vidwan_id && person.vidwan_id !== "#"
                          ? person.vidwan_id.includes("http")
                            ? person.vidwan_id
                            : `https://vidwan.inflibnet.ac.in/profile/${person.vidwan_id.trim()}`
                          : null,
                      icon: Globe,
                    },
                  ].map((item, index) => {
                    const IconComponent = item.icon;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <IconComponent className="w-5 h-5 text-[#0284C7]" />
                          <span className="font-medium text-gray-700">
                            {item.label}:
                          </span>
                        </div>
                        {item.value ? (
                          <a
                            href={item.value}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center space-x-1 px-3 py-1 bg-[#0891B2] text-white rounded-md hover:bg-[#064A6E] transition-colors text-sm"
                          >
                            <span>View</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-gray-500 text-sm">N/A</span>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📞</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Contact Information Not Available
              </h3>
              <p className="text-gray-500">
                Contact details will appear here once available.
              </p>
            </div>
          )
        ) : (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#0891B2] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Schedule Meeting Form */}
        <motion.div
          id="schedule-meeting"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 bg-white rounded-xl shadow-lg p-8 border border-gray-100"
        >
          <h2 className="text-2xl font-semibold text-[#064A6E] mb-6 flex items-center">
            <Calendar className="w-6 h-6 mr-3 text-[#0284C7]" />
            Request a Meeting
          </h2>
          <p className="text-gray-600 mb-6">
            Fill out the form below to schedule a meeting. We'll get back to you
            as soon as possible.
          </p>
          <form onSubmit={handleMeetingSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={meetingForm.name}
                  onChange={handleMeetingFormChange}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-[#0284C7] transition-colors bg-white text-gray-900 placeholder-gray-400"
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={meetingForm.email}
                  onChange={handleMeetingFormChange}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-[#0284C7] transition-colors bg-white text-gray-900 placeholder-gray-400"
                  placeholder="your.email@example.com"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="subject"
                  value={meetingForm.subject}
                  onChange={handleMeetingFormChange}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-[#0284C7] transition-colors bg-white text-gray-900 placeholder-gray-400"
                  placeholder="Meeting subject"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="preferredDate"
                  value={meetingForm.preferredDate}
                  onChange={handleMeetingFormChange}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-[#0284C7] transition-colors bg-white text-gray-900"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                name="message"
                value={meetingForm.message}
                onChange={handleMeetingFormChange}
                rows={5}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-[#0284C7] transition-colors resize-none bg-white text-gray-900 placeholder-gray-400"
                placeholder="Please provide details about the purpose of the meeting..."
                required
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-[#0284C7] to-[#0891B2] text-white rounded-lg hover:from-[#064A6E] hover:to-[#0284C7] transition-all duration-300 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Request</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </main>
      <Toaster position="bottom-right" />
    </div>
  );
};

export default Contact;
