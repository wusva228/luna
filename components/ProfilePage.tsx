
import React, { useState } from 'react';
import type { User } from '../types';
import { VerifiedIcon, PremiumIcon, TicketIcon } from './icons';
import { generateBio } from '../services/geminiService';

interface ProfilePageProps {
  user: User;
  updateUser: (user: User) => void;
  onContactAdmin: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ user, updateUser, onContactAdmin }) => {
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio);
  const [isEditing, setIsEditing] = useState(false);
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);

  const handleSave = () => {
    updateUser({ ...user, name, bio });
    setIsEditing(false);
  };
  
  const handleGenerateBio = async () => {
      setIsGeneratingBio(true);
      const interests = "art, music, and travel"; // In a real app, this would come from user's profile data
      const newBio = await generateBio(user.name, interests);
      setBio(newBio);
      setIsGeneratingBio(false);
  };

  const handleUpgrade = () => {
    // In a real app, this would trigger a payment flow
    alert('Congratulations! You are now a Premium user.');
    updateUser({ ...user, isPremium: true });
  };
  
  const handleCancelEdit = () => {
      setName(user.name);
      setBio(user.bio);
      setIsEditing(false);
  }

  return (
    <div className="p-4 sm:p-6 pb-24 text-white">
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <img src={user.photoUrl} alt={user.name} className="w-full h-80 object-cover rounded-2xl shadow-lg" />
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full border-4 border-gray-900 overflow-hidden">
             <img src={user.photoUrl} alt={user.name} className="w-full h-full object-cover" />
          </div>
        </div>
        
        <div className="mt-12 text-center">
            <div className="flex items-center justify-center space-x-2">
                <h1 className="text-3xl font-bold">{isEditing ? name : user.name}, {user.age}</h1>
                {user.isVerified && <VerifiedIcon />}
                {user.isPremium && <PremiumIcon />}
            </div>
             <p className="text-gray-400 mt-1">@{user.username}</p>
             {user.isPremium && <p className="text-sm font-semibold text-yellow-300 mt-1">Premium User</p>}
        </div>

        <div className="mt-8 bg-gray-800 p-6 rounded-2xl">
          <h2 className="text-xl font-semibold mb-3">About Me</h2>
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-400">Display Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-gray-700 p-2 rounded-lg text-white mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-400">Bio</label>
                <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full bg-gray-700 p-2 rounded-lg text-white resize-none mt-1"
                    rows={4}
                ></textarea>
              </div>
              <div className="flex justify-between items-center flex-wrap gap-2 mt-2">
                <button onClick={handleGenerateBio} disabled={isGeneratingBio} className="px-4 py-2 text-sm bg-purple-600 rounded-lg hover:bg-purple-500 transition disabled:bg-gray-500 flex items-center gap-2">
                  {isGeneratingBio ? 'Generating...' : <>✨ Gen AI Bio</>}
                </button>
                <div className="flex gap-2">
                    <button onClick={handleCancelEdit} className="px-4 py-2 text-sm bg-gray-600 rounded-lg hover:bg-gray-500 transition">Cancel</button>
                    <button onClick={handleSave} className="px-4 py-2 text-sm bg-indigo-600 rounded-lg hover:bg-indigo-500 transition">Save</button>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-gray-300 whitespace-pre-wrap">{bio}</p>
              <button onClick={() => setIsEditing(true)} className="mt-4 px-4 py-2 text-sm bg-gray-700 hover:bg-gray-600 transition rounded-lg">Edit Profile</button>
            </div>
          )}
        </div>
        
        {!user.isPremium && (
             <div className="mt-8 bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 p-6 rounded-2xl text-center text-gray-900 shadow-lg">
                <h2 className="text-2xl font-bold">Go Premium!</h2>
                <p className="mt-2">Unlock Super Likes, see who likes you, and get unlimited ratings!</p>
                <button 
                    onClick={handleUpgrade}
                    className="mt-4 px-8 py-3 bg-gray-900 text-yellow-300 font-bold rounded-full hover:bg-black transition-transform transform hover:scale-105"
                >
                    Upgrade Now
                </button>
            </div>
        )}
        
        <div className="mt-8 bg-gray-800 p-6 rounded-2xl flex items-center justify-between">
            <div>
                <h3 className="font-semibold text-lg">Need Help?</h3>
                <p className="text-gray-400 text-sm">Contact our support team for any issues.</p>
            </div>
            <button onClick={onContactAdmin} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 transition rounded-lg flex items-center gap-2">
                <TicketIcon className="w-5 h-5"/>
                <span>Create Ticket</span>
            </button>
        </div>
      </div>
    </div>
  );
};