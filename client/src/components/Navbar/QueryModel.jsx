import React, { useState } from "react";

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
    <div className="fixed inset-0 z-50 bg-black/70 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg w-full max-w-lg">
        <h2 className="text-2xl font-semibold mb-4">Submit Your Query</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium">
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              className="w-full mt-1 p-2 border rounded-md"
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
              className="w-full mt-1 p-2 border rounded-md"
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
              className="w-full mt-1 p-2 border rounded-md"
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
              className="w-full mt-1 p-2 border rounded-md"
              value={contactInfo.message}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 rounded-md"
              onClick={() => setShowQueryModal(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-md"
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
