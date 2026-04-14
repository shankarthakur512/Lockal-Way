import React, { useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';

// Dummy data for people and chats
const people = [
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Smith' },
  { id: 3, name: 'Robert Brown' },
];

const chats = {
  1: ['Hello, John!', 'How are you?'],
  2: ['Hey Jane!', 'What’s going on?'],
  3: ['Hi Robert!', 'Let’s catch up.'],
};

const GuideChatComponent = () => {
  const [selectedPerson, setSelectedPerson] = useState(null); // Stores the currently selected person

  const handlePersonClick = (person) => {
    setSelectedPerson(person);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-1/3 bg-white p-5 border-r">
        <h2 className="text-2xl font-bold mb-4">People</h2>

     {people.length ?<ul className="space-y-4">
          
          {people.map((person) => (
            <li
              key={person.id}
              className={`cursor-pointer p-2 rounded-lg ${
                selectedPerson?.id === person.id ? 'bg-blue-100' : 'hover:bg-gray-200'
              }`}
              onClick={() => handlePersonClick(person)}
            >
              {person.name}
            </li>
          ))}
        </ul> : <h2 className='mt-10  '>No any Queries initiated </h2>}
      </div>

    
      <div className="w-2/3 bg-white p-5">
        {selectedPerson ? (
          <>
            <h2 className="text-2xl font-bold mb-4">{selectedPerson.name}</h2>
            <div className="bg-gray-100 p-4 rounded-lg h-96 overflow-y-auto">
              {/* Chat Messages */}
              {chats[selectedPerson.id].map((message, index) => (
                <div key={index} className="mb-2">
                  <span className="block bg-blue-200 p-2 rounded-lg">{message}</span>
                </div>
              ))}
            </div>
            {/* Input for typing messages */}
            <div className="mt-4 flex gap-2">
              <input
                type="text"
                placeholder="Type a message"
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
              <FaPaperPlane  size={30} onClick={()=>{}}/>
            </div>
          </>
        ) : (
          <p className="text-gray-500">Select a person to start chatting.</p>
        )}
      </div>
    </div>
  );
};

export default GuideChatComponent;
