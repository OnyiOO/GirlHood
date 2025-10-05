import { useState, useEffect, useRef, useCallback } from 'react';
import { Phone, Mic, MicOff, Video, VideoOff, Volume2, AlertCircle, Send, Flower2, Circle, Settings, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { toast } from 'sonner@2.0.3';
import type { EmergencyContact } from '../App';
import type { Language } from '../utils/translations';

interface CallViewProps {
  onEndCall: (callData?: { duration: number; messageCount: number; hasAlerts: boolean }) => void;
  isInCall: boolean;
  emergencyContacts: EmergencyContact[];
  language: Language;
  aiName: string;
}

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: Date;
  isVoice?: boolean;
}

export function CallView({ onEndCall, isInCall, emergencyContacts, language, aiName }: CallViewProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: "Hey! Good to hear from you! How's everything going? What's up?",
      timestamp: new Date(),
      isVoice: true,
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [voiceMode, setVoiceMode] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [codeWord, setCodeWord] = useState('pineapple');
  const [tempCodeWord, setTempCodeWord] = useState('pineapple');
  const [showCodeWordDialog, setShowCodeWordDialog] = useState(false);
  const [hasAlerts, setHasAlerts] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const speakingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    return () => {
      clearInterval(timer);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (speakingTimeoutRef.current) clearTimeout(speakingTimeoutRef.current);
      if (recordingTimerRef.current) clearTimeout(recordingTimerRef.current);
    };
  }, []);

  // Recording timer
  useEffect(() => {
    if (isRecording) {
      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
      setRecordingDuration(0);
    }

    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };
  }, [isRecording]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const sendLocationToContacts = (reason: 'code_word' | 'emotion_detected') => {
    const mockLocation = '123 Main St, New York, NY 10001';
    const reasonText = reason === 'code_word' ? 'Code word detected' : 'Distress detected';
    
    setHasAlerts(true); // Mark that this call had alerts
    
    emergencyContacts.forEach(contact => {
      toast.success(`📍 Alert sent to ${contact.name}`, {
        description: `${reasonText}: ${mockLocation}`,
        duration: 5000,
      });
    });

    // Add AI message - keep it casual to not alert anyone nearby
    const alertMessage: Message = {
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      sender: 'ai',
      text: reason === 'code_word' 
        ? "Got it! So anyway, have you seen any good movies lately? I've been wanting to catch up on some new releases."
        : "I hear you. By the way, speaking of that, have you been doing anything fun this week? Any plans coming up?",
      timestamp: new Date(),
      isVoice: true,
    };
    
    setMessages(prev => [...prev, alertMessage]);
  };

  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      toast.success('🔴 Recording started', {
        description: 'Your call is now being recorded',
      });
    } else {
      setIsRecording(false);
      toast.success('⏹️ Recording saved', {
        description: `Recording duration: ${formatDuration(recordingDuration)}`,
      });
    }
  };

  const saveCodeWord = () => {
    setCodeWord(tempCodeWord);
    setShowCodeWordDialog(false);
    toast.success('✅ Code word updated', {
      description: `Your emergency code word is now: "${tempCodeWord}"`,
    });
  };

  const getContextualResponse = useCallback((userText: string): string => {
    const text = userText.toLowerCase();
    
    // Natural conversation responses (not safety-focused)
    // Greetings
    if (text.includes('hi') || text.includes('hello') || text.includes('hey')) {
      const responses = [
        "Hey! How's your day going so far?",
        "Hi there! What's new with you?",
        "Hello! Nice to hear from you. What have you been up to?",
        "Hey! Good to talk to you. How are things?",
        "Hi! It's good to hear your voice. What's happening?",
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // How are you / feeling
    if (text.includes('how are you') || text.includes('how r u') || text.includes("how're you")) {
      const responses = [
        "I'm doing great, thanks for asking! How about you? How's your day been?",
        "Pretty good! Just here chatting with you. What about you, how are you feeling?",
        "I'm good! More importantly, how are you doing today?",
        "Doing well! What about you - anything interesting going on?",
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Fine/good/okay responses
    if ((text.includes('fine') || text.includes('good') || text.includes('okay') || text.includes('ok') || text.includes('alright')) && text.split(' ').length < 5) {
      const responses = [
        "That's good to hear! So what have you been up to today?",
        "Nice! Anything exciting happening in your world?",
        "Glad to hear it! What are you doing right now?",
        "Awesome! Tell me, what's been the highlight of your day?",
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Bad/not good/rough
    if (text.includes('bad') || text.includes('not good') || text.includes('rough') || text.includes('terrible') || text.includes('awful')) {
      const responses = [
        "Ah, I'm sorry to hear that. Want to talk about it? Sometimes it helps to vent.",
        "That's tough. Do you want to share what's going on? I'm all ears.",
        "Aw, that's not fun. What's been making it difficult?",
        "I hear you. Some days are just like that, aren't they? What's weighing on you?",
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Location/where questions
    if (text.includes('where are you') || text.includes('where r u')) {
      const responses = [
        "I'm right here with you! Where are you at right now?",
        "Just hanging out here! What about you, are you out somewhere or at home?",
        "I'm always here when you need me! Are you somewhere fun?",
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Time/when questions  
    if (text.includes('what time') || text.includes('when')) {
      const responses = [
        "Time really flies, doesn't it? Are you in a rush or just wondering?",
        "Good question! Do you have somewhere to be soon?",
        "Oh, keeping track of time? Got any plans coming up?",
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Shopping/buying
    if (text.includes('shop') || text.includes('buy') || text.includes('store') || text.includes('mall')) {
      const responses = [
        "Ooh shopping! Are you looking for anything specific or just browsing?",
        "Nice! I love a good shopping trip. What are you in the market for?",
        "Fun! Are you shopping for yourself or getting gifts for someone?",
        "Cool! Online or in-person shopping? Both have their perks!",
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Travel/vacation
    if (text.includes('travel') || text.includes('trip') || text.includes('vacation') || text.includes('holiday')) {
      const responses = [
        "Oh wow, travel! Where are you thinking of going?",
        "That sounds exciting! Is this for fun or work?",
        "Nice! I love hearing about people's trips. Have you been there before?",
        "Ooh a trip! How long are you planning to go for?",
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Exercise/gym/health
    if (text.includes('gym') || text.includes('exercise') || text.includes('workout') || text.includes('run') || text.includes('fitness')) {
      const responses = [
        "That's awesome! Staying active is so important. What's your routine like?",
        "Nice! Are you training for something specific or just staying in shape?",
        "That's great! How often do you usually work out?",
        "Good for you! Do you prefer morning or evening workouts?",
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Hobbies/interests  
    if (text.includes('hobby') || text.includes('interest') || text.includes('like to')) {
      const responses = [
        "Oh cool! What kind of hobbies are you into?",
        "That's interesting! How long have you been doing that?",
        "Nice! It's so important to have things you're passionate about.",
        "That sounds fun! Do you do that often or just when you have time?",
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Pets/animals
    if (text.includes('dog') || text.includes('cat') || text.includes('pet') || text.includes('animal')) {
      const responses = [
        "Aww, pets are the best! What kind do you have?",
        "Oh I love animals! Tell me about your pet!",
        "That's so sweet! How long have you had them?",
        "Pets really are family, aren't they? What's their personality like?",
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Books/reading
    if (text.includes('book') || text.includes('read') || text.includes('novel')) {
      const responses = [
        "Oh nice! What genre do you usually read?",
        "I love a good book! What are you reading right now?",
        "That's cool! Do you prefer physical books or e-books?",
        "Reading is such a great hobby. Who's your favorite author?",
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Gaming
    if (text.includes('game') || text.includes('gaming') || text.includes('play') || text.includes('video')) {
      const responses = [
        "Gaming! What do you like to play?",
        "That's fun! Console, PC, or mobile?",
        "Nice! Are you more into single-player or multiplayer games?",
        "Cool! Have you been playing anything good lately?",
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Coffee/drinks
    if (text.includes('coffee') || text.includes('tea') || text.includes('drink') || text.includes('cafe')) {
      const responses = [
        "Ooh coffee! Are you a coffee or tea person?",
        "Nice! What's your go-to drink order?",
        "That sounds good! Do you have a favorite café spot?",
        "I get that! Sometimes you just need a good drink to start the day.",
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Stress/anxiety
    if (text.includes('stress') || text.includes('anxiety') || text.includes('anxious') || text.includes('worry') || text.includes('nervous')) {
      const responses = [
        "I understand, stress can be really overwhelming. What's been causing it?",
        "That's really tough to deal with. Have you tried any techniques that help you relax?",
        "I hear you. Anxiety is no joke. Do you want to talk through what's on your mind?",
        "That sounds really challenging. Is there anything specific that's making you feel this way?",
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Bored
    if (text.includes('bored') || text.includes('boring') || text.includes('nothing to do')) {
      const responses = [
        "Boredom is the worst! Have you thought about trying something new?",
        "I feel that. What do you usually do for fun when you're looking for something to do?",
        "Yeah, those days happen. Want to brainstorm some ideas together?",
        "I get it! Maybe it's a sign to pick up a new hobby or revisit an old one?",
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Thank you
    if (text.includes('thank') || text.includes('thanks')) {
      const responses = [
        "Of course! Anytime. What else is going on?",
        "You're so welcome! Happy to help.",
        "No problem at all! Is there anything else you want to chat about?",
        "My pleasure! That's what I'm here for.",
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Weather talk
    if (text.includes('weather') || text.includes('cold') || text.includes('hot') || text.includes('rain')) {
      const responses = [
        "I know, right? The weather's been something else lately. Are you staying warm/cool out there?",
        "Yeah, I heard about that! What do you usually like to do when the weather's like this?",
        "Tell me about it! At least it's a good excuse to stay cozy indoors, right?",
        "I've been hearing that from everyone today. Hope you dressed for it!",
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Work/school
    if (text.includes('work') || text.includes('job') || text.includes('school') || text.includes('class')) {
      const responses = [
        "Oh nice! How's that been going for you? Keeping you busy?",
        "That sounds interesting! Do you enjoy it?",
        "I feel you on that. Some days are better than others, right?",
        "That's cool! What's the best part about it?",
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Food/eating
    if (text.includes('food') || text.includes('eat') || text.includes('hungry') || text.includes('dinner') || text.includes('lunch')) {
      const responses = [
        "Ooh, that sounds good! What are you thinking of getting?",
        "Nice! I love food talk. What's your go-to meal?",
        "Food is always a good topic! Have you tried any new places lately?",
        "That makes me hungry just thinking about it. What's your favorite cuisine?",
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Entertainment
    if (text.includes('movie') || text.includes('show') || text.includes('watch') || text.includes('tv') || text.includes('netflix')) {
      const responses = [
        "Oh I've heard about that! Is it any good?",
        "Nice! I love a good show. What genre are you into?",
        "That's cool! Have you been binge-watching or just casual viewing?",
        "Sounds fun! I'm always looking for recommendations. Would you suggest it?",
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Music
    if (text.includes('music') || text.includes('song') || text.includes('listen')) {
      const responses = [
        "Oh nice! What kind of music are you into these days?",
        "That's awesome! Music really sets the mood, doesn't it?",
        "Cool! Have you discovered any new artists lately?",
        "I love that! What's on your playlist right now?",
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Weekend/plans
    if (text.includes('weekend') || text.includes('plans') || text.includes('tonight')) {
      const responses = [
        "Oh fun! What are you thinking of doing?",
        "That sounds nice! Are you doing anything exciting?",
        "Cool! Do you have anything special planned?",
        "Nice! Sometimes the best plans are no plans, right?",
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Friends/family
    if (text.includes('friend') || text.includes('family') || text.includes('mom') || text.includes('dad') || text.includes('sister') || text.includes('brother')) {
      const responses = [
        "Aw, that's sweet! How are they doing?",
        "That's nice! Family/friends are so important.",
        "That sounds lovely! Do you see them often?",
        "That's great! It's always good to stay connected with people you care about.",
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Tired/exhausted
    if (text.includes('tired') || text.includes('exhaust') || text.includes('sleep')) {
      const responses = [
        "I totally get that. Long day? Sometimes you just need a good rest.",
        "Yeah, I hear you. Have you been getting enough sleep lately?",
        "Ugh, I feel that. Maybe take it easy tonight if you can?",
        "That's rough. Hope you can catch up on some rest soon!",
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Positive emotions
    if (text.includes('happy') || text.includes('excited') || text.includes('great') || text.includes('amazing')) {
      const responses = [
        "That's so awesome! I love hearing that. What's got you feeling so good?",
        "Yes! That's the energy we love. Tell me more!",
        "That's wonderful! You deserve all the good vibes.",
        "I'm so glad to hear that! What's making today so special?",
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Going somewhere
    if (text.includes('going') || text.includes('heading') || text.includes('walk')) {
      const responses = [
        "Oh nice! Where are you headed?",
        "Cool! Is it close by or a bit of a journey?",
        "That's good! Getting some fresh air?",
        "Nice! Hope the weather's good for it.",
        "Sounds good! Are you walking or taking transportation?",
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Yes/Yeah/Yep responses
    if ((text === 'yes' || text === 'yeah' || text === 'yep' || text === 'yup' || text === 'mhm') && text.split(' ').length < 3) {
      const responses = [
        "Cool, cool! So what's the plan?",
        "Awesome! Tell me more about it.",
        "Nice! What else is happening?",
        "Got it! So what are you thinking?",
        "Right on! What's next?",
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // No/Nope/Nah responses
    if ((text === 'no' || text === 'nope' || text === 'nah' || text === 'not really') && text.split(' ').length < 4) {
      const responses = [
        "Fair enough! What would you rather talk about?",
        "No worries! Anything else on your mind?",
        "That's okay! So what else is going on?",
        "Totally get it. What's been keeping you busy then?",
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Questions about the AI
    if (text.includes('who are you') || text.includes('what are you') || text.includes('your name')) {
      const responses = [
        `I'm ${aiName}, just here to chat with you! How can I help today?`,
        `I'm ${aiName}! Think of me as your friendly conversation partner. What's on your mind?`,
        `${aiName} here! I'm just here to keep you company. What would you like to talk about?`,
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Compliments to the AI
    if (text.includes('you\'re nice') || text.includes('you\'re great') || text.includes('you\'re cool') || text.includes('you\'re awesome')) {
      const responses = [
        "Aw, that's so sweet of you to say! You're pretty great yourself!",
        "Thanks! That really means a lot. You're easy to talk to too!",
        "You're making me blush! Thanks, you're pretty awesome too!",
        "That's kind of you! I'm just glad we can have a good chat.",
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Jokes/funny
    if (text.includes('joke') || text.includes('funny') || text.includes('laugh')) {
      const responses = [
        "Haha! I love a good laugh. What's been making you smile lately?",
        "Laughter is the best medicine, right? Got any funny stories to share?",
        "That's awesome! Humor makes everything better. What kind of comedy do you like?",
        "I love that! Do you have a good sense of humor? What makes you laugh?",
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Default casual conversation responses
    const defaultResponses = [
      "That's interesting! Tell me more about that.",
      "Oh really? How do you feel about it?",
      "I see what you mean. That makes sense.",
      "Yeah, I get that. What else is going on?",
      "That's cool! What made you think of that?",
      "Totally! I know what you mean.",
      "Interesting perspective! I hadn't thought of it that way.",
      "That's a good point! What do you usually do in that situation?",
      "I hear you. Anything else on your mind?",
      "Right, right. So what's the plan?",
      "That sounds like you! What happened next?",
      "Haha, classic! I can totally picture that.",
      "No way! How did that turn out?",
      "For sure! I think everyone feels that way sometimes.",
      "That's pretty cool actually. Have you always been into that?",
      "I'm following you. Keep going, what else?",
      "Mhm, I get what you're saying. What do you think about it?",
      "That sounds about right! How are you handling it?",
      "I can relate to that! Has this happened before?",
      "True, true! What's your take on the whole thing?",
      "Oh wow! That must have been something. How did you react?",
      "I'd probably feel the same way. What are you gonna do?",
      "That's wild! I bet that was an experience.",
      "Understandable! What would you do differently?",
      "Real talk! How long has this been going on?",
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  }, [aiName]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      sender: 'user',
      text: inputMessage,
      timestamp: new Date(),
      isVoice: voiceMode,
    };

    const messageText = inputMessage;
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    // Check for code word
    if (messageText.toLowerCase().includes(codeWord.toLowerCase())) {
      sendLocationToContacts('code_word');
      return; // Don't send normal AI response
    }

    // Check for emotion indicators (scared, help, fear, etc.)
    const emotionKeywords = ['scared', 'afraid', 'help', 'emergency', 'fear', 'terrified', 'panic'];
    const containsEmotionKeyword = emotionKeywords.some(keyword => 
      messageText.toLowerCase().includes(keyword)
    );

    if (containsEmotionKeyword) {
      // Send location to emergency contacts
      setTimeout(() => {
        sendLocationToContacts('emotion_detected');
      }, 1500);
    }

    // Show typing indicator
    setIsTyping(true);

    // Clear any existing timeouts
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (speakingTimeoutRef.current) clearTimeout(speakingTimeoutRef.current);

    // Simulate AI thinking and responding
    timeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      setIsAiSpeaking(true);
      
      const aiMessage: Message = {
        id: `ai-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        sender: 'ai',
        text: getContextualResponse(messageText),
        timestamp: new Date(),
        isVoice: true,
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // Simulate voice duration based on message length
      const speakingDuration = Math.max(2000, aiMessage.text.length * 50);
      speakingTimeoutRef.current = setTimeout(() => {
        setIsAiSpeaking(false);
      }, speakingDuration);
    }, 800 + Math.random() * 700); // Variable delay for naturalness
  };

  const handleEndCall = () => {
    // Save call data before ending
    onEndCall({
      duration: callDuration,
      messageCount: messages.length,
      hasAlerts: hasAlerts,
    });
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-pink-950 via-rose-900 to-purple-950 relative overflow-hidden">
      {/* Decorative Background Flowers */}
      <div className="absolute top-10 left-10 w-40 h-40 opacity-5">
        <Flower2 className="w-full h-full text-pink-300 rotate-12" />
      </div>
      <div className="absolute bottom-20 right-10 w-48 h-48 opacity-5">
        <Flower2 className="w-full h-full text-rose-300 -rotate-45" />
      </div>
      
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-sm border-b border-white/10 p-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className={`w-12 h-12 bg-gradient-to-br from-pink-400 to-rose-400 rounded-full flex items-center justify-center transition-all ${
                  isAiSpeaking ? 'ring-4 ring-pink-400/50 scale-110' : ''
                }`}>
                  <Phone className="w-6 h-6 text-white" />
                </div>
                {isAiSpeaking && (
                  <div className="absolute inset-0 rounded-full bg-pink-400 animate-ping opacity-75"></div>
                )}
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <div>
                <h3 className="text-white">Alex</h3>
                <div className="flex items-center gap-2">
                  {isAiSpeaking ? (
                    <Badge variant="secondary" className="bg-pink-500/30 text-pink-200 border-pink-500/50 animate-pulse">
                      🎙️ Speaking...
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/50">
                      Active
                    </Badge>
                  )}
                  <span className="text-white/70 text-sm">{formatDuration(callDuration)}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className={`text-xs ${voiceMode ? 'bg-pink-500/20 text-pink-300' : 'text-white/50'}`}
                onClick={() => setVoiceMode(!voiceMode)}
              >
                {voiceMode ? '🎤 Voice' : '💬 Text'}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                <Volume2 className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Banner */}
      <div className="bg-pink-600/20 border-b border-pink-500/30 backdrop-blur-sm p-3 relative z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-2 text-pink-100 text-sm">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 flex-shrink-0" />
            <p>🔒 Call in progress</p>
          </div>
          <div className="flex items-center gap-3">
            {isRecording && (
              <Badge className="bg-red-500 text-white animate-pulse">
                <Circle className="w-2 h-2 fill-current mr-1" />
                REC {formatDuration(recordingDuration)}
              </Badge>
            )}
            <Dialog open={showCodeWordDialog} onOpenChange={setShowCodeWordDialog}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-pink-100 hover:text-white hover:bg-pink-500/20 gap-1"
                >
                  <Settings className="w-3 h-3" />
                  Code: {codeWord}
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gradient-to-b from-pink-50 to-rose-50 dark:from-gray-900 dark:to-gray-800">
                <DialogHeader>
                  <DialogTitle>Emergency Code Word</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Your Secret Code Word</Label>
                    <Input
                      value={tempCodeWord}
                      onChange={(e) => setTempCodeWord(e.target.value)}
                      placeholder="Enter a code word..."
                      className="bg-white dark:bg-gray-800"
                    />
                    <p className="text-xs text-muted-foreground">
                      Discreetly say this word during any conversation to instantly alert your emergency contacts with your location.
                    </p>
                  </div>
                  <Button onClick={saveCodeWord} className="w-full bg-pink-500 hover:bg-pink-600">
                    Save Code Word
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-hidden relative z-10">
        <div className="max-w-4xl mx-auto h-full flex flex-col p-4">
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
          >
            <div className="space-y-4 pb-4">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className="flex items-end gap-2 max-w-[80%] md:max-w-[60%]">
                    {message.sender === 'ai' && (
                      <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-rose-400 rounded-full flex items-center justify-center text-white flex-shrink-0 mb-1">
                        A
                      </div>
                    )}
                    <div
                      className={`rounded-2xl p-4 ${
                        message.sender === 'user'
                          ? 'bg-pink-600 text-white'
                          : 'bg-white/10 backdrop-blur-sm text-white border border-white/20'
                      }`}
                    >
                      {message.isVoice && message.sender === 'ai' && (
                        <div className="flex items-center gap-1 mb-2 opacity-70">
                          <div className="flex gap-0.5">
                            <div className="w-1 h-3 bg-pink-300 rounded-full" style={{ animationName: 'pulse', animationDuration: '2s', animationTimingFunction: 'cubic-bezier(0.4, 0, 0.6, 1)', animationIterationCount: 'infinite', animationDelay: '0ms' }}></div>
                            <div className="w-1 h-4 bg-pink-300 rounded-full" style={{ animationName: 'pulse', animationDuration: '2s', animationTimingFunction: 'cubic-bezier(0.4, 0, 0.6, 1)', animationIterationCount: 'infinite', animationDelay: '75ms' }}></div>
                            <div className="w-1 h-2 bg-pink-300 rounded-full" style={{ animationName: 'pulse', animationDuration: '2s', animationTimingFunction: 'cubic-bezier(0.4, 0, 0.6, 1)', animationIterationCount: 'infinite', animationDelay: '150ms' }}></div>
                            <div className="w-1 h-5 bg-pink-300 rounded-full" style={{ animationName: 'pulse', animationDuration: '2s', animationTimingFunction: 'cubic-bezier(0.4, 0, 0.6, 1)', animationIterationCount: 'infinite', animationDelay: '0ms' }}></div>
                          </div>
                          <span className="text-xs text-pink-200">Voice message</span>
                        </div>
                      )}
                      <p>{message.text}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-end gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-rose-400 rounded-full flex items-center justify-center text-white flex-shrink-0">
                      A
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-pink-300 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-pink-300 rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-pink-300 rounded-full animate-bounce delay-200"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Message Input */}
          <div className="mt-4">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-3">
                <div className="flex gap-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                    placeholder={voiceMode ? "Speak or type your message..." : "Type your message..."}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                  <Button
                    onClick={handleSendMessage}
                    className="bg-pink-500 hover:bg-pink-600 text-white"
                    disabled={!inputMessage.trim()}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                {voiceMode && (
                  <p className="text-xs text-white/50 mt-2">
                    🎤 Voice mode active - Alex will respond with human-like voice
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Call Controls */}
      <div className="bg-black/40 backdrop-blur-sm border-t border-white/10 p-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Voice Visualization */}
          {isAiSpeaking && (
            <div className="mb-4 flex items-center justify-center gap-1">
              {[...Array(20)].map((_, i) => {
                const duration = Math.random() * 0.5 + 0.3;
                return (
                  <div
                    key={i}
                    className="w-1 bg-gradient-to-t from-pink-400 to-rose-300 rounded-full transition-all"
                    style={{
                      height: `${Math.random() * 40 + 10}px`,
                      animationName: 'pulse',
                      animationDuration: `${duration}s`,
                      animationTimingFunction: 'ease-in-out',
                      animationIterationCount: 'infinite',
                      animationDelay: `${i * 0.05}s`,
                    }}
                  ></div>
                );
              })}
            </div>
          )}
          
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="icon"
              className={`w-14 h-14 rounded-full border-white/20 ${
                isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-white/10 hover:bg-white/20'
              } text-white`}
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </Button>

            <Button
              variant="outline"
              size="icon"
              className={`w-14 h-14 rounded-full border-white/20 ${
                isRecording ? 'bg-red-500 hover:bg-red-600 animate-pulse' : 'bg-white/10 hover:bg-white/20'
              } text-white relative`}
              onClick={toggleRecording}
            >
              <Circle className={`w-6 h-6 ${isRecording ? 'fill-current' : ''}`} />
              {isRecording && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full animate-ping"></div>
              )}
            </Button>

            <Button
              size="icon"
              className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg"
              onClick={handleEndCall}
            >
              <Phone className="w-7 h-7 rotate-[135deg]" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className={`w-14 h-14 rounded-full border-white/20 ${
                isVideoOn ? 'bg-white/10 hover:bg-white/20' : 'bg-red-500 hover:bg-red-600'
              } text-white`}
              onClick={() => setIsVideoOn(!isVideoOn)}
            >
              {isVideoOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
            </Button>
          </div>

          <p className="text-center text-white/70 text-sm mt-4">
            {isAiSpeaking 
              ? "Alex is speaking..." 
              : isRecording
              ? "Recording in progress..."
              : "Tap the red button to end call"}
          </p>
        </div>
      </div>
    </div>
  );
}
