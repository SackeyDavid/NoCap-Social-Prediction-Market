import React, { useState } from 'react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const avatars = ['👑', '✨', '🎯', '💎', '🌟', '🔥', '⚡', '🎵', '🦅', '🚀', '💫', '🎭'];

export const CreateProfile = () => {
  const [username, setUsername] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(avatars[0]);
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-[#050505] p-6 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/otp')}
          className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-full hover:bg-white/10 transition-colors"
        >
          <ArrowLeft size={20} className="text-white" />
        </button>
        <h2 className="text-white">Create Profile</h2>
      </div>
      
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <p className="text-gray-400 mb-8 text-center">
            Choose your vibe
          </p>
          
          {/* Avatar Selection */}
          <div className="grid grid-cols-6 gap-3 mb-8">
            {avatars.map((avatar) => (
              <button
                key={avatar}
                onClick={() => setSelectedAvatar(avatar)}
                className={`w-full aspect-square rounded-2xl text-3xl flex items-center justify-center transition-all ${
                  selectedAvatar === avatar
                    ? 'bg-gradient-to-br from-[#00FF94] to-[#2E5CFF] scale-110'
                    : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                {avatar}
              </button>
            ))}
          </div>
          
          {/* Username Input */}
          <Input
            placeholder="Enter username"
            value={username}
            onChange={setUsername}
          />
          
          <p className="text-gray-500 text-sm mt-2 text-center">
            This is how others will see you
          </p>
        </div>
        
        <Button
          onClick={() => navigate('/home')}
          variant="primary"
          size="lg"
          fullWidth
          disabled={username.length < 3}
        >
          Save & Continue
        </Button>
      </div>
    </div>
  );
};
