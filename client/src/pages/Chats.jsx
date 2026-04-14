import React, { useEffect, useMemo, useState } from "react";
import { FiMessageSquare, FiSend } from "react-icons/fi";
import { HiOutlineCalendarDays, HiOutlineClock, HiOutlineMapPin } from "react-icons/hi2";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { guideContactHistory, guideContactMessage } from "../Apihandle/LocalGuide";
import apiClient from "../shared/api/client";
import { getGuideDetailsRoute } from "../shared/constants/routes";
import { getErrorMessage } from "../shared/lib/error";
import { formatDate, formatDateTime, getInitials } from "../shared/lib/format";
import { toastService } from "../shared/services/toast";
import StatePanel from "../shared/ui/StatePanel";

const Chats = () => {
  const userData = useSelector((state) => state.auth.userData);
  const [history, setHistory] = useState({ conversations: [], calls: [] });
  const [selectedThreadId, setSelectedThreadId] = useState(null);
  const [draft, setDraft] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [loadError, setLoadError] = useState(null);

  const loadHistory = async () => {
    if (!userData?._id) {
      return;
    }

    try {
      setIsLoading(true);
      setLoadError(null);
      const { data } = await apiClient.get(`${guideContactHistory}/${userData._id}`);
      const nextHistory = data.history || { conversations: [], calls: [] };
      setHistory(nextHistory);

      if (nextHistory.conversations.length > 0) {
        setSelectedThreadId((current) => current || nextHistory.conversations[0]._id);
      }
    } catch (error) {
      setHistory({ conversations: [], calls: [] });
      setLoadError(getErrorMessage(error, "Unable to load your guide conversations right now."));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [userData?._id]);

  const activeConversation = useMemo(
    () =>
      history.conversations.find((conversation) => conversation._id === selectedThreadId) ||
      history.conversations[0] ||
      null,
    [history.conversations, selectedThreadId]
  );

  const stats = useMemo(
    () => [
      { label: "Active conversations", value: history.conversations.length },
      { label: "Scheduled guide calls", value: history.calls.length },
      {
        label: "Last touchpoint",
        value: activeConversation?.lastMessageAt ? formatDate(activeConversation.lastMessageAt) : "None yet",
      },
    ],
    [activeConversation?.lastMessageAt, history.calls.length, history.conversations.length]
  );

  const handleSendMessage = async () => {
    if (!activeConversation?.guide?._id || !draft.trim() || isSending) {
      return;
    }

    try {
      setIsSending(true);
      const { data } = await apiClient.post(guideContactMessage, {
        guideId: activeConversation.guide._id,
        userId: userData._id,
        text: draft,
      });

      const updatedThread = data.thread;

      setHistory((current) => ({
        ...current,
        conversations: [
          updatedThread,
          ...current.conversations.filter((conversation) => conversation._id !== updatedThread._id),
        ],
      }));
      setSelectedThreadId(updatedThread._id);
      setDraft("");
    } catch (error) {
      toastService.error(getErrorMessage(error, "Unable to send the message right now."));
    } finally {
      setIsSending(false);
    }
  };

  if (!userData?._id) {
    return null;
  }

  return (
    <div className="min-h-screen bg-cream px-4 pb-20 pt-32 text-ink dark:bg-charcoal dark:text-cream">
      <div className="section-shell grid gap-8">
        <section className="overflow-hidden rounded-[36px] border border-sand-dark bg-[linear-gradient(130deg,#1A3530_0%,#2C4A3E_52%,#3D6B5A_100%)] px-8 py-10 shadow-luxury sm:px-12 sm:py-14">
          <span className="eyebrow-label">Calls & messages</span>
          <h1 className="mt-6 text-4xl font-semibold leading-tight text-cream sm:text-5xl">
            Keep every guide conversation and scheduled call in one calm workspace.
          </h1>
        </section>

        {loadError ? (
          <StatePanel
            eyebrow="Calls & messages"
            title="We could not load your communication history"
            message={loadError}
            actionLabel="Try again"
            onAction={loadHistory}
            variant="error"
          />
        ) : null}

        <section className="grid gap-4 md:grid-cols-3">
          {stats.map((stat) => (
            <article
              key={stat.label}
              className="surface-panel p-6 dark:border-white/10 dark:bg-[#18211E]"
            >
              <p className="text-xs uppercase tracking-[0.22em] text-clay">{stat.label}</p>
              <h2 className="mt-4 text-3xl font-semibold text-forest dark:text-cream">{stat.value}</h2>
            </article>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.38fr_0.62fr]">
          <div className="space-y-6">
            <div className="surface-panel overflow-hidden dark:border-white/10 dark:bg-[#18211E]">
              <div className="border-b border-sand-dark px-6 py-5 dark:border-white/10">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-clay">
                  Conversations
                </p>
              </div>

              <div className="max-h-[520px] overflow-y-auto p-3">
                {isLoading ? (
                  <div className="p-4 text-sm text-slate dark:text-sand/70">Loading conversations...</div>
                ) : history.conversations.length === 0 ? (
                  <div className="rounded-[24px] border border-dashed border-sand-dark p-5 text-sm text-slate dark:border-white/10 dark:text-sand/70">
                    Start a conversation from any guide page and it will appear here.
                  </div>
                ) : (
                  history.conversations.map((conversation) => {
                    const guideName =
                      conversation.guide?.userDetails?.fullname || "Local guide";
                    const isActive = activeConversation?._id === conversation._id;

                    return (
                      <button
                        key={conversation._id}
                        type="button"
                        onClick={() => setSelectedThreadId(conversation._id)}
                        className={`mb-3 w-full rounded-[24px] border p-4 text-left transition ${
                          isActive
                            ? "border-forest bg-forest text-sand"
                            : "border-sand-dark bg-sand/30 hover:bg-sand dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {conversation.guide?.picture || conversation.guide?.userDetails?.avatar ? (
                            <img
                              src={conversation.guide.picture || conversation.guide.userDetails.avatar}
                              alt={guideName}
                              className="h-12 w-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/85 text-sm font-semibold text-forest">
                              {getInitials(guideName)}
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-3">
                              <p className="truncate text-sm font-semibold">{guideName}</p>
                              <span className={`text-xs ${isActive ? "text-sand/70" : "text-mist dark:text-sand/55"}`}>
                                {conversation.lastMessageAt ? formatDate(conversation.lastMessageAt) : "New"}
                              </span>
                            </div>
                            <p className={`mt-1 truncate text-sm ${isActive ? "text-sand/80" : "text-slate dark:text-sand/70"}`}>
                              {conversation.latestMessagePreview || "No messages yet"}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            <div className="surface-panel p-6 dark:border-white/10 dark:bg-[#18211E]">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-clay">Scheduled calls</p>
              <div className="mt-5 space-y-3">
                {history.calls.length === 0 ? (
                  <div className="rounded-[24px] border border-dashed border-sand-dark p-5 text-sm text-slate dark:border-white/10 dark:text-sand/70">
                    Book a guide call from a guide detail page to see it here.
                  </div>
                ) : (
                  history.calls.map((call) => (
                    <article
                      key={call._id}
                      className="rounded-[24px] border border-sand-dark bg-sand/30 p-4 dark:border-white/10 dark:bg-white/5"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h3 className="text-lg font-semibold text-forest dark:text-cream">
                            {call.guide?.userDetails?.fullname || "Local guide"}
                          </h3>
                          <p className="mt-1 text-sm text-slate dark:text-sand/70">
                            Ref {call.bookingReference}
                          </p>
                        </div>
                        <span className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-forest dark:bg-white/10 dark:text-sand">
                          {call.status}
                        </span>
                      </div>

                      <div className="mt-4 grid gap-3 text-sm text-slate dark:text-sand/70 sm:grid-cols-2">
                        <div className="flex items-center gap-2">
                          <HiOutlineCalendarDays className="text-clay" />
                          {formatDate(call.travelDate)}
                        </div>
                        <div className="flex items-center gap-2">
                          <HiOutlineClock className="text-clay" />
                          {call.timeSlot}
                        </div>
                        <div className="flex items-center gap-2 sm:col-span-2">
                          <HiOutlineMapPin className="text-clay" />
                          {[call.guide?.city, call.guide?.country].filter(Boolean).join(", ") || "Location pending"}
                        </div>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="surface-panel flex min-h-[720px] flex-col overflow-hidden dark:border-white/10 dark:bg-[#18211E]">
            {!activeConversation ? (
              <StatePanel
                compact
                eyebrow="Conversation"
                title="No conversation selected"
                message="Browse guides, ask your first question, and your thread will be available here for the full trip-planning flow."
              />
            ) : (
              <>
                <div className="border-b border-sand-dark px-6 py-5 dark:border-white/10">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {activeConversation.guide?.picture || activeConversation.guide?.userDetails?.avatar ? (
                        <img
                          src={activeConversation.guide.picture || activeConversation.guide.userDetails.avatar}
                          alt={activeConversation.guide?.userDetails?.fullname}
                          className="h-14 w-14 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[linear-gradient(135deg,#3D6B5A,#2C4A3E)] text-lg font-semibold text-sand">
                          {getInitials(activeConversation.guide?.userDetails?.fullname || "Guide")}
                        </div>
                      )}
                      <div>
                        <h2 className="text-2xl font-semibold text-forest dark:text-cream">
                          {activeConversation.guide?.userDetails?.fullname || "Local guide"}
                        </h2>
                        <p className="mt-1 text-sm text-slate dark:text-sand/70">
                          {[activeConversation.guide?.city, activeConversation.guide?.country].filter(Boolean).join(", ") || "Guide profile available"}
                        </p>
                      </div>
                    </div>

                    {activeConversation.guide?._id ? (
                      <Link
                        to={getGuideDetailsRoute(activeConversation.guide._id)}
                        className="brand-button-secondary rounded-full dark:border-white/10 dark:bg-white/5 dark:text-sand"
                      >
                        Open guide page
                      </Link>
                    ) : null}
                  </div>
                </div>

                <div className="flex-1 space-y-4 overflow-y-auto bg-[radial-gradient(circle_at_top_right,rgba(212,162,76,0.10),transparent_25%)] px-6 py-6">
                  {activeConversation.messages.length === 0 ? (
                    <div className="mx-auto max-w-xl rounded-[28px] border border-dashed border-sand-dark bg-white/70 p-6 text-center dark:border-white/10 dark:bg-white/5">
                      <h3 className="text-xl font-semibold text-forest dark:text-cream">Start the conversation</h3>
                      <p className="mt-3 text-sm leading-7 text-slate dark:text-sand/70">
                        Ask about local recommendations, transport help, timing, or the best route for your trip.
                      </p>
                    </div>
                  ) : (
                    activeConversation.messages.map((message) => {
                      const isTraveler = message.senderType === "traveler";

                      return (
                        <div
                          key={message._id}
                          className={`flex ${isTraveler ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-[28px] px-5 py-4 shadow-sm ${
                              isTraveler
                                ? "bg-forest text-sand"
                                : "border border-sand-dark bg-white text-ink dark:border-white/10 dark:bg-[#111916] dark:text-cream"
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
                  )}
                </div>

                <div className="border-t border-sand-dark bg-white/80 px-6 py-5 dark:border-white/10 dark:bg-[#121B18]">
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <input
                      type="text"
                      value={draft}
                      onChange={(event) => setDraft(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          handleSendMessage();
                        }
                      }}
                      placeholder="Write a message to your guide..."
                      className="w-full rounded-full border border-sand-dark bg-white px-5 py-4 text-sm text-ink outline-none transition focus:border-forest dark:border-white/10 dark:bg-[#0E1513] dark:text-cream"
                    />
                    <button
                      type="button"
                      onClick={handleSendMessage}
                      disabled={isSending || !draft.trim()}
                      className="brand-button min-w-[140px] rounded-full disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <FiSend className="mr-2" />
                      {isSending ? "Sending..." : "Send"}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Chats;
