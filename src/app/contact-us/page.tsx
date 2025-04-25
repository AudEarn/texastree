"use client";

import { useState } from "react";

export default function ContactUsPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create a mailto link with the form data
    const recipient = "Billy@Audearn.com";
    const emailSubject = encodeURIComponent(
      formData.subject || "Contact Form Inquiry"
    );
    const emailBody = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`
    );

    // Open the default email client
    window.location.href = `mailto:${recipient}?subject=${emailSubject}&body=${emailBody}`;

    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-28">
          <h1 className="text-4xl font-bold text-green-800 mb-4">Contact Us</h1>
        </div>

        {/* Main Content - 2 Column Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Description */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Get In Touch
            </h2>

            {/* Description Content in 2 Columns on larger screens */}
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-600">
                  <p className="mb-2 font-semibold">Important Note:</p>
                  <p>
                    Please feel free to drop us a line here.{" "}
                    <span className="font-bold">NOTE</span> - for all quotes for
                    tree services, please utilize our directory page to fill out
                    a lead form for your area{" "}
                    <a
                      href="#"
                      className="text-green-700 underline hover:text-green-800"
                    >
                      click here for the directory page
                    </a>
                    .
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">About Us</h3>
                  <p className="text-gray-600">
                    We are committed to providing excellent service and support
                    to all our customers. Your feedback and inquiries are
                    important to us.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Office Hours</h3>
                  <p className="text-gray-600">
                    Monday - Friday: 9:00 AM - 5:00 PM
                  </p>
                  <p className="text-gray-600">Saturday: 10:00 AM - 2:00 PM</p>
                  <p className="text-gray-600">Sunday: Closed</p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Response Time</h3>
                  <p className="text-gray-600">
                    We aim to respond to all inquiries within 24 business hours.
                    Thank you for your patience.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Send Us a Message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Form Fields in 2 Columns on larger screens */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="What is this regarding?"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Your message here..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-green-700 hover:bg-green-800 text-white font-medium py-3 px-6 rounded-md transition duration-300"
              >
                Send Message
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                By submitting this form, you agree to our privacy policy. This
                will open your default email client with the message addressed
                to Billy@Audearn.com
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
