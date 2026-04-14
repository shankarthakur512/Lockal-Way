import React, { useState } from "react";
import Hero from "../components/Hero/Hero";
import BlogsComp from "../components/Blogs/BlogsComp";
import Places from "../components/Places/Places";
import Testimonial from "../components/Testimonial/Testimonial";
import Banner from "../components/Banner/Banner";
import BannerPic from "../components/BannerPic/BannerPic";
import FeaturedTrips from "../components/Trips/FeaturedTrips.jsx";
import BannerImg from "../assets/places/Banner1.jpg";
import Banner2 from "../assets/places/Banner2.jpg";
import OrderPopup from "../components/OrderPopup/OrderPopup";
import BannerPic2 from "../components/BannerPic/BannerPic2";
import { FiMic } from "react-icons/fi";
import { FaPaperPlane } from "react-icons/fa";
import { askTravelGuide } from "../Apihandle/assistant";
import apiClient from "../shared/api/client";
import { createLogger } from "../shared/lib/logger";

const homeLogger = createLogger("home-ai-guide");

const Home = () => {
  const [orderPopup, setOrderPopup] = useState(false);
  const [chatOpen, setChatOpen] = useState(false); // State for chat visibility
  const [message, setMessage] = useState(""); // State for the chat input
  const [chatMessages, setChatMessages] = useState([]); // State to manage chat messages
  const [isLoading, setIsLoading] = useState(false); // State to show loading

  const handleOrderPopup = () => {
    setOrderPopup(!orderPopup);
  };

  const handleChatToggle = () => {
    setChatOpen(!chatOpen);
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    // Add user message to the chat
    setChatMessages((prevMessages) => [
      ...prevMessages,
      { text: message, isUser: true },
    ]);
    setMessage(""); // Clear input field

    // Show loader while waiting for AI response
    setIsLoading(true);

    try {
      const response = await apiClient.post(askTravelGuide, { prompt: message });

      // Add AI response to the chat
      setChatMessages((prevMessages) => [
        ...prevMessages,
        { text: response.data.reply, isUser: false },
      ]);
    } catch (error) {
      homeLogger.error("Error fetching AI response", error);
      setChatMessages((prevMessages) => [
        ...prevMessages,
        { text: "Failed to get a response. Please try again.", isUser: false },
      ]);
    } finally {
      setIsLoading(false); // Hide loader after response
    }
  };

  const title = "Discover the Beauty of the Himalayas";
  const description =
    "Join us on an unforgettable journey to the majestic Himalayas. Experience breathtaking views, serene landscapes, and a rich cultural heritage like never before.";

  return (
    <>
      <div className="bg-cream dark:bg-charcoal dark:text-cream">
        <Hero />
        <FeaturedTrips />
        <Places handleOrderPopup={handleOrderPopup} />
        <BannerPic img={BannerImg} title={title} description={description} />
        <BlogsComp />
        <Banner />
        <BannerPic2 img={Banner2} />
        <Testimonial />
        <OrderPopup orderPopup={orderPopup} setOrderPopup={setOrderPopup} />

        {/* Chatbot Button */}
        <button
          onClick={handleChatToggle}
          className="fixed bottom-6 right-6 z-50 flex rounded-full border border-sand-dark bg-warm-white px-5 py-4 text-sm font-semibold text-forest shadow-soft transition hover:-translate-y-0.5 hover:bg-sand dark:border-white/10 dark:bg-[#18211E] dark:text-sand dark:hover:bg-white/10"
        >
          Ai Guide
        </button>

       
        {chatOpen && (
          <div className="fixed bottom-20 right-6 z-50 flex h-[60vh] w-[30vw] min-w-[320px] flex-col justify-between rounded-[28px] border border-sand-dark bg-warm-white p-4 shadow-luxury dark:border-white/10 dark:bg-[#18211E]">
            <h2 className="mb-3 flex justify-center text-lg font-semibold text-forest dark:text-cream">
              Your AI Buddy
            </h2>
            <div className="flex-grow overflow-y-auto p-2">
              {chatMessages.map((msg, index) => (
               <div
                key={`${msg.text}-${index}`}
                className={`flex ${
                  msg.isUser ? "justify-start" : "justify-end"
                }`}
              >
                <span
                  className={`mb-2 p-2 rounded-lg ${
                    msg.isUser
                      ? "self-start bg-forest p-3 text-white"
                      : "self-end bg-sand p-3 text-ink dark:bg-white/10 dark:text-sand"
                  }`}
                >
                  {msg.text}

                </span>
                </div>
              ))}
              {isLoading && (
                <div className="self-end p-2 text-forest dark:text-sand">Loading...</div>
              )}
            </div>
            {/* Input Section */}
            <div className="flex items-center border-t border-sand-dark pt-2 dark:border-white/10">
              <input
                type="text"
                value={message}
                onChange={handleInputChange}
                
                  onKeyDown={(e) =>{
                    if(e.key === "Enter") handleSendMessage();
                  }} 
                placeholder="Type your question..."
                className="flex-1 rounded-lg bg-transparent px-2 py-2 text-ink outline-none placeholder:text-mist dark:text-cream"
              />
              {message ? (
                <FaPaperPlane
                  className="ml-2 cursor-pointer text-forest dark:text-sand"
                  size={24}
                  onClick={handleSendMessage}
                />
              ) : (
                <FiMic className="ml-2 cursor-pointer text-forest dark:text-sand" size={24} />
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
