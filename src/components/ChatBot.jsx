import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false); // NEW: open/close state
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "👋 Hello! Ask me about **hotels**, **events**, or travel tips in Sri Lanka! 🚀",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { from: "user", text: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_CHAT_API_URL}/chat`,
        {
          message: userMessage.text,
        },
      );

      const botMessage = { from: "bot", text: res.data.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      const errorMsg = {
        from: "bot",
        text: "❌ Sorry, connection error. Check if backend is running on port 5000.",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat toggle button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center text-xl"
        >
          💬
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div className="w-96 bg-white/95 backdrop-blur-md border border-gray-200 rounded-2xl shadow-2xl flex flex-col max-h-[80vh]">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-t-2xl flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                🤖
              </div>
              <div>
                <h3 className="font-bold text-lg">Gamage Tours AI</h3>
                <p className="text-sm opacity-90">Hotels & Events Assistant</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white font-bold text-xl hover:text-gray-200"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.from === "bot" ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-[85%] p-4 rounded-2xl shadow-md prose prose-sm max-w-none leading-relaxed ${
                    msg.from === "bot"
                      ? "bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-br-sm"
                      : "bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-bl-sm"
                  }`}
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.text}
                  </ReactMarkdown>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 p-4 rounded-2xl rounded-br-sm max-w-[85%] shadow-md">
                  <div className="flex items-center gap-2 text-blue-600">
                    <div className="w-5 h-5 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                    <span className="font-medium">
                      Gamage AI is thinking...
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 pt-0 border-t border-gray-100">
            <div className="flex gap-2 items-end">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none placeholder-gray-500"
                placeholder="Ask about hotels, events, or travel plans..."
                onKeyDown={(e) =>
                  e.key === "Enter" && !e.shiftKey && sendMessage()
                }
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "➤"
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1 text-center">
              Powered by Gemini 2.5 Flash ✨
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
