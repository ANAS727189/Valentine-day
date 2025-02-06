import React, { useState, useEffect, useRef } from 'react';
import { Heart, Music, Volume2, VolumeX, Sparkles, Stars } from 'lucide-react';
import { render } from 'ai/rsc'
import OpenAI from 'openai'
import { z } from 'zod'

const openai = new OpenAI()

async function submitMessage(userInput) { 
  'use server'

  return render({
    provider: openai,
    model: 'gpt-4-0125-preview',
    messages: [
      { role: 'system', content: 'You are a helpful assistant' },
      { role: 'user', content: userInput }
    ],
    text: ({ content }) => <p>{content}</p>,
    tools: {
      get_city_weather: {
        description: 'Get the current weather for a city',
        parameters: z.object({
          city: z.string().describe('the city')
        }).required(),
        render: async function* ({ city }) {
          yield <Spinner/>
          const weather = await getWeather(city)
          return <Weather info={weather} />
        }
      }
    }
  })
}

const ValentinesDay = () => {
  const [showMessage, setShowMessage] = useState(false);
  const [hearts, setHearts] = useState([]);
  const [noCount, setNoCount] = useState(0);
  const [yesPressed, setYesPressed] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [shakeScreen, setShakeScreen] = useState(false);
  const [sparkles, setSparkles] = useState([]);
  const [showStars, setShowStars] = useState(false);
  
  const sadAudioRef = useRef(null);
  const happyAudioRef = useRef(null);
  
  const sadSounds = [
    "/tum-hi-ho.mp3",
    "/channa-mereya.mp3",
    "/tadap-tadap.mp3",
    "/mai-dhundhne-ko-zamane.mp3"
  ];
  
  const happySounds = [
    "/tum-hi-ho.mp3",
    "/mere-rang-mein.mp3"
  ];
  
  const messages = [
    "You're the Raj to my Simran! 💑",
    "Tum hi ho... my Valentine! 💖",
    "My heart does 'Dhak Dhak' when I see you! 💓",
    "You're my favorite person in the whole world! ✨",
    "Life is better with you in it! 🌟",
    "Together forever? 🎈"
  ];
  
  const noMessages = [
    "Ek baar phir soch lo... 🥺",
    "Mere dil ko aisa dhakka? 💔",
    "Koi mil gaya kya? 😢",
    "Main mar jaunga! 😭",
    "Ankhen nam hai... 🌧️",
    "Dil ye mera tut gaya... 💔"
  ];

  useEffect(() => {
    sadAudioRef.current = new Audio();
    happyAudioRef.current = new Audio();
    
    sadSounds.forEach(sound => {
      const audio = new Audio(sound);
      audio.preload = 'auto';
    });
    
    happySounds.forEach(sound => {
      const audio = new Audio(sound);
      audio.preload = 'auto';
    });

    return () => {
      if (sadAudioRef.current) {
        sadAudioRef.current.pause();
        sadAudioRef.current = null;
      }
      if (happyAudioRef.current) {
        happyAudioRef.current.pause();
        happyAudioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (sadAudioRef.current) {
      sadAudioRef.current.muted = isMuted;
    }
    if (happyAudioRef.current) {
      happyAudioRef.current.muted = isMuted;
    }
  }, [isMuted]);


  useEffect(() => {
    const interval = setInterval(() => {
      if (yesPressed) {
        const newHeart = {
          id: Date.now(),
          left: Math.random() * 100,
          animationDuration: 3 + Math.random() * 3,
          size: 20 + Math.random() * 20,
          rotate: Math.random() * 360
        };
        setHearts(prev => [...prev, newHeart]);
      }
    }, 300);

    return () => clearInterval(interval);
  }, [yesPressed]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (yesPressed) {
        const newSparkle = {
          id: Date.now(),
          x: e.clientX,
          y: e.clientY,
          size: 10 + Math.random() * 20
        };
        setSparkles(prev => [...prev, newSparkle]);
        setTimeout(() => {
          setSparkles(prev => prev.filter(s => s.id !== newSparkle.id));
        }, 1000);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [yesPressed]);

  useEffect(() => {
    if (yesPressed) {
      setShowStars(true);
    }
  }, [yesPressed]);

  const playSound = (isHappy = false) => {
    if (isMuted) return;
    
    if (sadAudioRef.current) sadAudioRef.current.pause();
    if (happyAudioRef.current) happyAudioRef.current.pause();
    
    const audioRef = isHappy ? happyAudioRef : sadAudioRef;
    const sounds = isHappy ? happySounds : sadSounds;
    
    if (audioRef.current) {
      audioRef.current.src = sounds[Math.floor(Math.random() * sounds.length)];
      audioRef.current.currentTime = 0;
      
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log("Audio playback error:", error);
        });
      }
    }
  };

  const handleNoClick = () => {
    setNoCount(prev => prev + 1);
    playSound(false);
    setShakeScreen(true);
    setTimeout(() => setShakeScreen(false), 1000);
  };

  const handleYesClick = () => {
    setYesPressed(true);
    setShowMessage(true);
    playSound(true);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-pink-200 via-red-100 to-rose-200 flex flex-col items-center justify-center p-4 relative overflow-hidden ${shakeScreen ? 'animate-shake' : ''}`}>
      {/* Animated background gradient */}
      <div className="fixed inset-0 pointer-events-none animate-gradient-shift">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-200/50 via-red-100/50 to-rose-200/50 animate-pulse" />
      </div>

      submitMessage
      {/* Floating sparkles */}
      {sparkles.map(sparkle => (
        <div
          key={sparkle.id}
          className="absolute animate-sparkle-fade"
          style={{
            left: sparkle.x,
            top: sparkle.y,
            transform: `translate(-50%, -50%)`
          }}
        >
          <Sparkles 
            className="text-yellow-400" 
            size={sparkle.size}
          />
        </div>
      ))}

      {/* Animated stars background */}
      {showStars && (
        <div className="fixed inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <Stars
              key={i}
              className="absolute text-yellow-300 animate-twinkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`
              }}
              size={Math.random() * 20 + 10}
            />
          ))}
        </div>
      )}

      {/* Falling hearts */}
      {hearts.map(heart => (
        <div
          key={heart.id}
          className="absolute animate-fall"
          style={{
            left: `${heart.left}%`,
            animation: `fall ${heart.animationDuration}s linear, pulse 1s ease-in-out infinite`,
            transform: `rotate(${heart.rotate}deg)`
          }}
        >
          <Heart 
            className="text-pink-500 drop-shadow-lg" 
            fill="currentColor"
            size={heart.size}
          />
        </div>
      ))}

      {/* Sound control */}
      <button 
        onClick={() => setIsMuted(!isMuted)}
        className="absolute top-4 right-4 p-3 rounded-full bg-white/30 hover:bg-white/50 transition-all transform hover:scale-110 hover:rotate-12 backdrop-blur-sm"
      >
        {isMuted ? 
          <VolumeX size={24} className="text-pink-600" /> : 
          <Volume2 size={24} className="text-pink-600" />
        }
      </button>

      {/* Main content */}
      <div className="text-center z-10 relative">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-12">
          <Music className="text-pink-600 animate-bounce-slow" size={40} />
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-pink-600 mb-12 animate-float drop-shadow-lg">
          Kya tum mere Valentine banoge? 💝
        </h1>
        
        {!yesPressed && (
          <div className="space-y-6">
            <button
              onClick={handleYesClick}
              className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-bold py-4 px-10 rounded-full mx-2 transform hover:scale-110 transition-all shadow-lg hover:shadow-pink-300/50 animate-pulse-slow"
            >
              Haan! Zaroor! 😊
            </button>
            
            <button
              onClick={handleNoClick}
              className="bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white font-bold py-4 px-10 rounded-full mx-2 transform transition-all shadow-lg"
              style={{
                transform: `translate(${Math.sin(noCount) * 100}px, ${Math.cos(noCount) * 20}px) scale(${Math.max(0.5, 1 - noCount * 0.1)})`,
              }}
            >
              {noCount < noMessages.length ? noMessages[noCount] : "Please? 🥺"}
            </button>
          </div>
        )}

        {showMessage && (
          <div className="mt-12 space-y-6 animate-float">
            <h2 className="text-3xl md:text-5xl font-bold text-pink-600 drop-shadow-lg">
              Mere dil ki dhadkan! 🎉
            </h2>
            <div className="space-y-4">
              {messages.map((message, index) => (
                <p
                  key={index}
                  className="text-xl md:text-2xl text-pink-600 font-medium"
                  style={{
                    animation: `fadeInUp ${0.5 + index * 0.2}s ease-out forwards, float 3s ease-in-out infinite`,
                    animationDelay: `${index * 0.2}s`,
                    opacity: 0,
                  }}
                >
                  {message}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fall {
          0% { 
            transform: translateY(-20px) rotate(0deg) scale(1);
            opacity: 1;
          }
          100% { 
            transform: translateY(100vh) rotate(360deg) scale(0.5);
            opacity: 0.5;
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0) rotate(0); }
          25% { transform: translateX(-10px) rotate(-5deg); }
          75% { transform: translateX(10px) rotate(5deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes sparkle-fade {
          0% { opacity: 1; transform: scale(0); }
          50% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(0.5); }
        }
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.7); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
        .animate-bounce-slow {
          animation: bounce 2s ease-in-out infinite;
        }
        .animate-sparkle-fade {
          animation: sparkle-fade 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ValentinesDay;