import React from "react";

const Location = () => {
  return (
    <div id="location" className="w-full">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d27208.406102716664!2d75.9758848!3d31.5227657!2m3!1f0!2f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1725083233079!5m2!1sen!2sin"
        width="100%"
        height="360"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        style={{ border: 0 }}
        className="w-full"
        title="Lockal Way location"
      />
    </div>
  );
};

export default Location;
