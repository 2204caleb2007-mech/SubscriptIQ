import { useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Brain, Send, Sparkles, User } from 'lucide-react';

const mockResponses = [
  "I can help you understand your billing and invoices. What would you like to know?",
  "Based on your usage, I recommend considering the Annual Pro plan - you'd save 17% compared to monthly billing.",
  "Your next invoice of $990 is due on March 20, 2025. Would you like me to break down the charges?",
];

const AIChatPage = () => {
  const [messages, setMessages] = useState([
    { role: 'ai', content: "Hello! I'm your AI billing assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'ai', content: mockResponses[Math.floor(Math.random() * mockResponses.length)] }]);
      setIsTyping(false);
    }, 1500);
  };

  const suggestions = ['What is my current plan?', 'Explain my last invoice', 'How can I reduce costs?'];

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto h-[calc(100vh-140px)] flex flex-col">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-accent flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">AI Assistant</h1>
            <p className="text-sm text-muted-foreground">Ask me anything about your subscription</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 mb-4 custom-scrollbar">
          {messages.map((msg, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
              {msg.role === 'ai' && (
                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              )}
              <div className={`chat-bubble ${msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}`}>
                {msg.content}
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </motion.div>
          ))}
          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="chat-bubble chat-bubble-ai">
                <span className="flex gap-1">
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-100" />
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-200" />
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2 mb-4 flex-wrap">
          {suggestions.map((s, i) => (
            <Button key={i} variant="outline" size="sm" onClick={() => { setInput(s); }}>{s}</Button>
          ))}
        </div>

        <div className="flex gap-2">
          <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask me anything..."
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()} className="flex-1" />
          <Button onClick={sendMessage} className="bg-gradient-primary border-0">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AIChatPage;
