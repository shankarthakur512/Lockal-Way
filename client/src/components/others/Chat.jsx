import React, { useEffect, useRef, useState } from "react";
import { FiSend } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { HiOutlineMapPin } from "react-icons/hi2";
import { guideContactMessage, guideContactThread } from "../../Apihandle/LocalGuide";
import apiClient from "../../shared/api/client";
import { formatDateTime, getInitials } from "../../shared/lib/format";

const ChatComponent = ({ darkMode, guideId, guideData, setChatStarted, userId }) => {
  const [thread, setThread] = useState(null);
  const [draft, setDraft] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!guideId || !userId) {
      setIsLoading(false);
      return;
    }

    const loadThread = async () => {
      try {
        const { data } = await apiClient.get(`${guideContactThread}/${guideId}/${userId}`);
        setThread(data.thread);
      } catch (error) {
        setThread(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadThread();
  }, [guideId, userId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [thread?.messages?.length]);

  const handleSend = async () => {
    if (!guideId || !userId || !draft.trim() || isSending) {
      return;
    }

    try {
      setIsSending(true);
      const { data } = await apiClient.post(guideContactMessage, {
        guideId,
        userId,
        text: draft,
      });

      setThread(data.thread);
      setDraft("");
    } catch (error) {
      return;
    } finally {
      setIsSending(false);
    }
  };

  const guideName =
    thread?.guide?.userDetails?.fullname ||
    guideData?.userDetails?.fullname ||
    "Local guide";
  const guideImage =
    thread?.guide?.picture ||
    thread?.guide?.userDetails?.avatar ||
    guideData?.picture ||
    guideData?.userDetails?.avatar ||
    "";
  const guideLocation = [
    thread?.guide?.city || guideData?.city,
    thread?.guide?.country || guideData?.country,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/65 px-4 py-6 backdrop-blur-sm">
      <div
        className={`relative flex h-[88vh] w-full max-w-5xl flex-col overflow-hidden rounded-[32px] border shadow-luxury ${
          darkMode
            ? "border-white/10 bg-[#101714] text-cream"
            : "border-sand-dark bg-warm-white text-ink"
        }`}
      >
        <button
          type="button"
          onClick={() => setChatStarted(false)}
          className={`absolute right-5 top-5 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full ${
            darkMode ? "bg-white/10 text-cream" : "bg-sand text-forest"
          }`}
        >
          <IoClose size={20} />
        </button>

        <div className="grid h-full lg:grid-cols-[0.34fr_0.66fr]">
          <aside className="relative overflow-hidden border-b border-sand-dark/70 bg-[linear-gradient(160deg,#1A3530_0%,#2C4A3E_54%,#3D6B5A_100%)] px-6 py-8 text-cream lg:border-b-0 lg:border-r lg:border-white/10 lg:px-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,162,76,0.20),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.10),transparent_20%)]" />
            <div className="relative">
              <span className="eyebrow-label border-white/15 bg-white/10 text-sand">
                Guide chat
              </span>

              <div className="mt-8 flex items-center gap-4">
                {guideImage ? (
                  <img
                    src={guideImage}
                    alt={guideName}
                    className="h-16 w-16 rounded-full border border-white/15 object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/15 bg-white/10 text-lg font-semibold text-sand">
                    {getInitials(guideName)}
                  </div>
                )}
                <div>
                  <h2 className="text-3xl font-semibold text-cream">{guideName}</h2>
                  <p className="mt-2 flex items-center gap-2 text-sm text-sand/75">
                    <HiOutlineMapPin />
                    {guideLocation || "Destination specialist"}
                  </p>
                </div>
              </div>

              <div className="mt-8 rounded-[28px] border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sand/70">
                  Best for
                </p>
                <p className="mt-4 text-sm leading-8 text-sand/80">
                  Shortlisting itineraries, asking local questions, and getting clarity before you commit to a booking.
                </p>
              </div>
            </div>
          </aside>

          <div className="flex min-h-0 flex-col">
            <div className={`border-b px-6 py-5 ${darkMode ? "border-white/10" : "border-sand-dark"}`}>
              <h3 className="text-2xl font-semibold text-forest dark:text-cream">
                Conversation
              </h3>
              <p className="mt-2 text-sm text-slate dark:text-sand/70">
                Your messages are saved, so you can continue later from the Calls & Messages page.
              </p>
            </div>

            <div className={`flex-1 overflow-y-auto px-6 py-6 ${darkMode ? "bg-[#0E1513]" : "bg-[radial-gradient(circle_at_top_right,rgba(212,162,76,0.10),transparent_25%)]"}`}>
              {isLoading ? (
                <div className="text-sm text-slate dark:text-sand/70">Loading conversation...</div>
              ) : thread?.messages?.length ? (
                thread.messages.map((message) => {
                  const isTraveler = message.senderType === "traveler";

                  return (
                    <div
                      key={message._id}
                      className={`mb-4 flex ${isTraveler ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-[28px] px-5 py-4 shadow-sm ${
                          isTraveler
                            ? "bg-forest text-sand"
                            : darkMode
                              ? "border border-white/10 bg-[#18211E] text-cream"
                              : "border border-sand-dark bg-white text-ink"
                        }`}
                      >
                        <p className="text-sm leading-7">{message.text}</p>
                        <p className={`mt-3 text-xs ${isTraveler ? "text-sand/70" : "text-mist dark:text-sand/50"}`}>
                          {formatDateTime(message.createdAt)}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className={`mx-auto max-w-xl rounded-[28px] border border-dashed p-6 text-center ${
                  darkMode ? "border-white/10 bg-white/5" : "border-sand-dark bg-white/75"
                }`}>
                  <h4 className="text-xl font-semibold text-forest dark:text-cream">
                    Start with a practical question
                  </h4>
                  <p className="mt-3 text-sm leading-7 text-slate dark:text-sand/70">
                    Try asking about local transport, seasonal weather, food recommendations, or how to shape the first day of your itinerary.
                  </p>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <div className={`border-t px-6 py-5 ${darkMode ? "border-white/10 bg-[#121B18]" : "border-sand-dark bg-white/80"}`}>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="text"
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      handleSend();
                    }
                  }}
                  placeholder="Type your message to the guide..."
                  className={`w-full rounded-full border px-5 py-4 text-sm outline-none transition ${
                    darkMode
                      ? "border-white/10 bg-[#0C1311] text-cream"
                      : "border-sand-dark bg-white text-ink focus:border-forest"
                  }`}
                />
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={isSending || !draft.trim()}
                  className="brand-button min-w-[140px] rounded-full disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <FiSend className="mr-2" />
                  {isSending ? "Sending..." : "Send"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;
