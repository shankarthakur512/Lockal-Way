import React from 'react';

const ResourcesAndTips = () => {
  return (
    <div className="p-5 mt-5 border rounded-lg bg-white shadow-md">
      <h2 className="text-2xl font-bold mb-4">Resources and Tips</h2>
      <ul className="space-y-4">
        <li>
          <h3 className="text-xl font-semibold">1. How to become a great host?</h3>
          <p>Discover tips on creating memorable experiences for your guests and managing your time effectively.</p>
        </li>
        <li>
          <h3 className="text-xl font-semibold">2. Managing your listings effectively</h3>
          <p>Keep your profile up-to-date and ensure your availability to maximize bookings.</p>
        </li>
        <li>
          <h3 className="text-xl font-semibold">3. Safety and Regulations</h3>
          <p>Learn more about local regulations and safety tips to provide a secure experience for your guests.</p>
        </li>
      </ul>
    </div>
  );
};

export default ResourcesAndTips;
