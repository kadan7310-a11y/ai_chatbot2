import { useState, useRef, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const AiBot = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "ai", text: "Assalam o Alaikum! 👋 I am your AI Assistant. How can I help you?" }
  ]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) return <p style={{color:"red", textAlign:"center", marginTop:"50px"}}>❌ VITE_GEMINI_API_KEY missing in .env</p>;

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-3.8-flash" });

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userText = input;
    setMessages(prev => [...prev, { role: "user", text: userText }]);
    setInput("");
    setLoading(true);
    try {
      const result = await model.generateContent(userText);
      const aiText = result.response.text();
      setMessages(prev => [...prev, { role: "ai", text: aiText }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: "ai", text: "⚠️ " + e.message + " - try again" }]);
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      display: "flex", justifyContent: "center", alignItems: "center", padding: "20px",
      fontFamily: "Inter, sans-serif"
    }}>
      <div style={{
        width: "100%", maxWidth: "700px", height: "85vh",
        background: "white", borderRadius: "20px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        display: "flex", flexDirection: "column", overflow: "hidden"
      }}>
        {/* Header */}
        <div style={{ background: "linear-gradient(90deg, #667eea, #764ba2)", padding: "18px 25px", color: "white", display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "28px" }}>🤖</span>
          <div>
            <h2 style={{ margin: 0, fontSize: "18px" }}>AI Chatbot</h2>
            <small style={{ opacity: 0.8 }}>Gemini Powered • Online</small>
          </div>
        </div>

        {/* Chat Area */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px", background: "#f8f9ff" }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", marginBottom: "15px" }}>
              <div style={{
                maxWidth: "75%",
                padding: "12px 16px",
                borderRadius: m.role === "user" ? "18px 18px 0 18px" : "18px 18px 18px 0",
                background: m.role === "user" ? "linear-gradient(90deg, #667eea, #764ba2)" : "white",
                color: m.role === "user" ? "white" : "#333",
                boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                lineHeight: "1.5", fontSize: "14px",
                whiteSpace: "pre-wrap"
              }}>
                {m.text}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: "flex", gap: "5px", padding: "10px" }}>
              <span style={{ width: "8px", height: "8px", background: "#667eea", borderRadius: "50%", animation: "bounce 1s infinite" }}></span>
              <span style={{ width: "8px", height: "8px", background: "#667eea", borderRadius: "50%", animation: "bounce 1s infinite 0.2s" }}></span>
              <span style={{ width: "8px", height: "8px", background: "#667eea", borderRadius: "50%", animation: "bounce 1s infinite 0.4s" }}></span>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div style={{ padding: "15px 20px", background: "white", borderTop: "1px solid #eee", display: "flex", gap: "10px" }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
            style={{ flex: 1, padding: "14px 18px", borderRadius: "25px", border: "1px solid #ddd", outline: "none", fontSize: "14px" }}
          />
          <button onClick={sendMessage} disabled={loading}
            style={{
              width: "50px", height: "50px", borderRadius: "50%", border: "none",
              background: "linear-gradient(90deg, #667eea, #764ba2)", color: "white",
              fontSize: "20px", cursor: "pointer", boxShadow: "0 4px 15px rgba(102,126,234,0.4)"
            }}>
            ➤
          </button>
        </div>
      </div>

      <style>{`@keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }`}</style>
    </div>
  );
};

export default AiBot;