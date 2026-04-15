import React, { useState } from "react";
import { IoCloseOutline } from "react-icons/io5";

const QueryModal = ({ setShowQueryModal }) => {
  const [contactInfo, setContactInfo] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    setContactInfo({ ...contactInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(contactInfo);
    // handle form submission logic
    setShowQueryModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 px-4 py-8 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-[32px] border border-sand-dark bg-warm-white p-6 text-ink shadow-luxury dark:border-white/10 dark:bg-[#18211E] dark:text-cream sm:p-8">
        <button
          type="button"
          onClick={() => setShowQueryModal(false)}
          className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-sand-dark bg-white text-forest transition hover:bg-sand dark:border-white/10 dark:bg-white/5 dark:text-sand dark:hover:bg-white/10"
          aria-label="Close query form"
        >
          <IoCloseOutline className="text-2xl" />
        </button>

        <div className="pr-12">
          <p className="eyebrow-label">Ask Query</p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight text-forest dark:text-cream">
            Submit your query
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate dark:text-sand/75">
            Tell us what you need and we’ll route it to the right travel support flow.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8">
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium">
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              className="mt-1 w-full rounded-2xl border border-sand-dark bg-white px-4 py-3 text-ink outline-none transition placeholder:text-mist focus:border-forest/40 dark:border-white/10 dark:bg-[#101714] dark:text-cream"
              value={contactInfo.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className="mt-1 w-full rounded-2xl border border-sand-dark bg-white px-4 py-3 text-ink outline-none transition placeholder:text-mist focus:border-forest/40 dark:border-white/10 dark:bg-[#101714] dark:text-cream"
              value={contactInfo.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="phone" className="block text-sm font-medium">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              id="phone"
              className="mt-1 w-full rounded-2xl border border-sand-dark bg-white px-4 py-3 text-ink outline-none transition placeholder:text-mist focus:border-forest/40 dark:border-white/10 dark:bg-[#101714] dark:text-cream"
              value={contactInfo.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="message" className="block text-sm font-medium">
              Message
            </label>
            <textarea
              name="message"
              id="message"
              className="mt-1 w-full rounded-2xl border border-sand-dark bg-white px-4 py-3 text-ink outline-none transition placeholder:text-mist focus:border-forest/40 dark:border-white/10 dark:bg-[#101714] dark:text-cream"
              value={contactInfo.message}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex justify-end gap-4 pt-2">
            <button
              type="button"
              className="rounded-full border border-sand-dark bg-sand px-5 py-3 text-sm font-semibold text-forest transition hover:bg-sand-dark dark:border-white/10 dark:bg-white/5 dark:text-sand dark:hover:bg-white/10"
              onClick={() => setShowQueryModal(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="brand-button rounded-full px-5 py-3"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QueryModal;
