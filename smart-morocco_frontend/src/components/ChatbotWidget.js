import React, { useMemo, useState } from "react";
import { Bot, X, MessageCircle, Send } from "lucide-react";

const quickQuestions = [
  "Quels packs sont disponibles ?",
  "Comment faire une réservation ?",
  "Comment créer un compte ?",
  "Comment contacter Smart Morocco ?",
];

const cannedAnswers = [
  {
    match: ["pack", "packs", "disponible", "disponibles"],
    answer: "Vous pouvez explorer nos packs dans la page Packs. Je peux aussi vous aider à choisir selon la ville ou la durée.",
  },
  {
    match: ["reservation", "réservation", "reserver", "réserver"],
    answer: "Pour réserver, ouvrez un pack, choisissez la date de départ, le nombre de voyageurs, puis confirmez la réservation.",
  },
  {
    match: ["compte", "inscrire", "inscription", "register"],
    answer: "Pour créer un compte, cliquez sur Inscription puis remplissez votre nom, prénom, email et mot de passe.",
  },
  {
    match: ["contact", "support", "aide"],
    answer: "Vous pouvez contacter Smart Morocco via la page Contact pour envoyer votre message à l’équipe.",
  },
];

const normalizeText = (value = "") =>
  String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

const getAutoReply = (question) => {
  const normalizedQuestion = normalizeText(question);
  if (!normalizedQuestion) {
    return "Je peux vous aider avec les packs, les réservations, le compte ou le contact.";
  }

  const match = cannedAnswers.find((item) =>
    item.match.some((term) => normalizedQuestion.includes(normalizeText(term)))
  );

  return match
    ? match.answer
    : "Je peux vous aider avec les packs, la réservation, la création de compte ou les informations de contact. Quelle question voulez-vous poser ?";
};

const ChatbotWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "bot",
      text: "Bonjour, je suis Smart Morocco. Quelle question puis-je vous aider à résoudre ?",
    },
  ]);
  const [input, setInput] = useState("");

  const canSend = useMemo(() => input.trim().length > 0, [input]);

  const pushBotMessage = (text) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now() + 1,
        role: "bot",
        text,
      },
    ]);
  };

  const handleSend = (textOverride) => {
    const text = (textOverride ?? input).trim();
    if (!text) return;

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        role: "user",
        text,
      },
    ]);
    setInput("");

    window.setTimeout(() => {
      pushBotMessage(getAutoReply(text));
    }, 250);
  };

  return (
    <>
      <button
        type="button"
        className={`chatbot-fab ${open ? "open" : ""}`}
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Ouvrir le chatbot"
      >
        {open ? <X size={22} /> : <Bot size={22} />}
      </button>

      {open && (
        <div className="chatbot-panel">
          <div className="chatbot-header">
            <div className="chatbot-title">
              <span className="chatbot-badge">
                <MessageCircle size={14} />
              </span>
              <div>
                <strong>Smart Morocco</strong>
                <p>Assistant de voyage</p>
              </div>
            </div>
            <button
              type="button"
              className="chatbot-close"
              onClick={() => setOpen(false)}
              aria-label="Fermer le chatbot"
            >
              <X size={16} />
            </button>
          </div>

          <div className="chatbot-body">
            <div className="chatbot-hero">
              <Bot size={18} />
              <div>
                <strong>Bonjour, je suis Smart Morocco</strong>
                <p>Quelle question pouvez-vous poser ?</p>
              </div>
            </div>

            <div className="chatbot-messages">
              {messages.map((message) => (
                <div key={message.id} className={`chatbot-message ${message.role}`}>
                  {message.text}
                </div>
              ))}
            </div>

            <div className="chatbot-quick">
              {quickQuestions.map((question) => (
                <button
                  type="button"
                  key={question}
                  className="chatbot-chip"
                  onClick={() => handleSend(question)}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          <div className="chatbot-footer">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSend();
                }
              }}
              placeholder="Écrivez votre question..."
            />
            <button
              type="button"
              className="chatbot-send"
              onClick={() => handleSend()}
              disabled={!canSend}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      <style>{`
        /* ---------- STYLE ÉLÉGANT ---------- */
        .chatbot-fab {
          position: fixed;
          right: 24px;
          bottom: 24px;
          width: 60px;
          height: 60px;
          border: none;
          border-radius: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #0f4c75, #bf5700);
          color: white;
          box-shadow: 0 8px 20px rgba(15, 76, 117, 0.3), 0 2px 6px rgba(0,0,0,0.05);
          cursor: pointer;
          z-index: 2500;
          transition: transform 0.2s cubic-bezier(0.2, 0.9, 0.4, 1.1), box-shadow 0.2s;
        }
        .chatbot-fab:hover {
          transform: scale(1.05) translateY(-2px);
          box-shadow: 0 16px 28px rgba(15, 76, 117, 0.4);
        }
        .chatbot-fab.open {
          background: #1e293b;
          box-shadow: 0 6px 14px rgba(0,0,0,0.2);
        }
        .chatbot-panel {
          position: fixed;
          right: 24px;
          bottom: 96px;
          width: 380px;
          max-width: calc(100vw - 32px);
          height: 560px;
          border-radius: 28px;
          background: #ffffff;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0,0,0,0.02);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          z-index: 2500;
          animation: slideUp 0.25s ease-out;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .chatbot-header {
          background: linear-gradient(135deg, #0f4c75, #bf5700);
          padding: 18px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: white;
        }
        .chatbot-title {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .chatbot-title strong {
          font-size: 1rem;
          font-weight: 600;
          letter-spacing: -0.2px;
        }
        .chatbot-title p {
          margin: 2px 0 0;
          font-size: 0.72rem;
          opacity: 0.85;
        }
        .chatbot-badge {
          width: 36px;
          height: 36px;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(4px);
          border-radius: 40px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .chatbot-close {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          width: 32px;
          height: 32px;
          border-radius: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: white;
          transition: background 0.2s;
        }
        .chatbot-close:hover {
          background: rgba(255, 255, 255, 0.35);
        }
        .chatbot-body {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 18px 16px 16px;
          background: #f9fafc;
          overflow-y: auto;
        }
        .chatbot-hero {
          display: flex;
          gap: 12px;
          background: white;
          padding: 14px 16px;
          border-radius: 24px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.03);
          border: 1px solid #edf2f7;
        }
        .chatbot-hero strong {
          display: block;
          font-size: 0.9rem;
          color: #0f4c75;
        }
        .chatbot-hero p {
          margin: 4px 0 0;
          font-size: 0.8rem;
          color: #4a627a;
        }
        .chatbot-messages {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 12px;
          overflow-y: auto;
          padding-right: 4px;
        }
        .chatbot-message {
          max-width: 86%;
          padding: 12px 16px;
          border-radius: 20px;
          font-size: 0.88rem;
          line-height: 1.45;
          word-break: break-word;
          box-shadow: 0 1px 2px rgba(0,0,0,0.02);
        }
        .chatbot-message.bot {
          background: #ffffff;
          border: 1px solid #e9edf2;
          color: #1f2a44;
          border-top-left-radius: 6px;
        }
        .chatbot-message.user {
          align-self: flex-end;
          background: linear-gradient(135deg, #0f4c75, #bf5700);
          color: white;
          border-top-right-radius: 6px;
          box-shadow: 0 4px 12px rgba(191,87,0,0.2);
        }
        .chatbot-quick {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 6px;
        }
        .chatbot-chip {
          background: #f1f5f9;
          border: none;
          padding: 8px 14px;
          border-radius: 40px;
          font-size: 0.75rem;
          font-weight: 500;
          color: #0f4c75;
          cursor: pointer;
          transition: all 0.2s;
          backdrop-filter: blur(2px);
        }
        .chatbot-chip:hover {
          background: linear-gradient(135deg, #0f4c75, #bf5700);
          color: white;
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(191,87,0,0.2);
        }
        .chatbot-footer {
          display: flex;
          gap: 12px;
          padding: 14px 16px;
          background: white;
          border-top: 1px solid #ecf3f8;
        }
        .chatbot-footer input {
          flex: 1;
          border: 1px solid #e2e8f0;
          border-radius: 40px;
          padding: 12px 16px;
          font-size: 0.85rem;
          outline: none;
          background: #fefefe;
          transition: 0.2s;
        }
        .chatbot-footer input:focus {
          border-color: #bf5700;
          box-shadow: 0 0 0 3px rgba(191,87,0,0.1);
        }
        .chatbot-send {
          width: 46px;
          height: 46px;
          border: none;
          border-radius: 40px;
          background: linear-gradient(135deg, #0f4c75, #bf5700);
          color: white;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: 0.2s;
        }
        .chatbot-send:disabled {
          opacity: 0.45;
          cursor: not-allowed;
          transform: none;
        }
        .chatbot-send:not(:disabled):hover {
          transform: scale(1.02);
          box-shadow: 0 4px 10px rgba(191,87,0,0.3);
        }
        /* Scrollbar personnalisée */
        .chatbot-messages::-webkit-scrollbar {
          width: 4px;
        }
        .chatbot-messages::-webkit-scrollbar-track {
          background: #f0f2f5;
          border-radius: 4px;
        }
        .chatbot-messages::-webkit-scrollbar-thumb {
          background: #bf5700;
          border-radius: 4px;
        }
        @media (max-width: 520px) {
          .chatbot-panel {
            right: 12px;
            left: 12px;
            width: auto;
            bottom: 80px;
            height: 65vh;
          }
          .chatbot-fab {
            right: 16px;
            bottom: 16px;
          }
        }
      `}</style>
    </>
  );
};

export default ChatbotWidget;