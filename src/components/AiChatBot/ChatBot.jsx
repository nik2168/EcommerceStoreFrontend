import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getSocket } from "../../utils/socket";
import { AIRESPONSE, NEW_MESSAGE, ONLINE_USERS } from "../../utils/events";
import {
  loginUser,
  logoutUser,
  setOnlineUsers,
} from "../../features/user/userSlice";
import axios from "axios";
import { server } from "../../features/config";
import ReactMarkdown from "react-markdown";
import { useSocketEvents } from "../../hooks/hook";

const CHAT_SUBTITLE =
  import.meta.env.VITE_AI_LABEL ?? "Nox AI · smart shopping help";

const DEFAULT_WELCOME = {
  role: "assistant",
  content: "Hi, how can I help you today?",
};

const CHAT_STORAGE_PREFIX = "noxcart_chat_";
const MAX_EMIT_HISTORY_MESSAGES = 12;
const MAX_EMIT_HISTORY_CHARS = 8000;
const MAX_EMIT_MSG_CHARS = 1500;
const MAX_STORED_MESSAGES = 80;

/**
 * Prior turns only (caller should pass `messages` before appending the new user message).
 */
function buildEmitHistory(messages) {
  const pairs = messages
    .filter(
      (m) =>
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string"
    )
    .map((m) => ({
      role: m.role,
      content: m.content.slice(0, MAX_EMIT_MSG_CHARS),
    }))
    .slice(-MAX_EMIT_HISTORY_MESSAGES);

  let total = 0;
  const out = [];
  for (let i = pairs.length - 1; i >= 0; i--) {
    const len = pairs[i].content.length + 24;
    if (total + len > MAX_EMIT_HISTORY_CHARS) break;
    total += len;
    out.unshift(pairs[i]);
  }
  return out;
}

function loadStoredMessages(userId) {
  if (!userId) return null;
  try {
    const raw = sessionStorage.getItem(`${CHAT_STORAGE_PREFIX}${userId}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return null;
    const valid = parsed.every(
      (m) =>
        m &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string"
    );
    if (!valid) return null;
    return parsed.slice(-MAX_STORED_MESSAGES);
  } catch {
    return null;
  }
}

const Chatbot = () => {
  const user = useSelector((state) => state.userState.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const socket = getSocket();
  const messagesEndRef = useRef(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([DEFAULT_WELCOME]);
  const [chatStorageReady, setChatStorageReady] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [showGuide, setShowGuide] = useState(true);

  const recommendedQuestions = [
    "Show me some best iphones",
    "Suggest a gift under $50",
    "Suggest me some shirts under $20",
  ];

  useEffect(() => {
    axios
      .get(`${server}/api/v1/user/profile`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("nox_token")}`,
        },
      })
      .then(({ data }) => dispatch(loginUser(data)))
      .catch((err) => {
        console.log(err);
        dispatch(logoutUser());
      });
  }, [dispatch]);

  useEffect(() => {
    setChatStorageReady(false);
    if (!user?._id) {
      setMessages([DEFAULT_WELCOME]);
      return;
    }
    const stored = loadStoredMessages(user._id);
    if (stored?.length) {
      setMessages(stored);
    } else {
      setMessages([DEFAULT_WELCOME]);
    }
    setChatStorageReady(true);
  }, [user?._id]);

  useEffect(() => {
    if (!user?._id || !chatStorageReady) return;
    try {
      sessionStorage.setItem(
        `${CHAT_STORAGE_PREFIX}${user._id}`,
        JSON.stringify(messages.slice(-MAX_STORED_MESSAGES))
      );
    } catch {
      /* quota */
    }
  }, [messages, user?._id, chatStorageReady]);

  const handleQuestionClick = (question) => {
    setInput(question);
    onSubmitAction({ preventDefault: () => {} });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const onSubmitAction = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const isProductQuery = /show me|suggest|deal|gift|recommend/i.test(input);

    const history = buildEmitHistory(messages);

    const newUserMessage = {
      role: "user",
      content: input,
      type: isProductQuery,
      userId: user._id,
      history,
    };

    socket.emit(NEW_MESSAGE, newUserMessage);
    setMessages((prev) => [...prev, newUserMessage]);
    setInput("");
    setIsThinking(true);
  };

  const aiResponseHandler = useCallback(
    (data) => {
      if (data?.userId.toString() === user?._id.toString()) {
        setMessages((prev) => [...prev, data]);
        setIsThinking(false);
      }
    },
    [user]
  );

  const onlineUsersHandler = (data) => {
    dispatch(setOnlineUsers(data));
  };

  useSocketEvents(socket, {
    [AIRESPONSE]: aiResponseHandler,
    [ONLINE_USERS]: onlineUsersHandler,
  });

  const toggleChat = () => {
    if (!user) {
      setIsAuthenticated(false);
      setIsOpen(false);
      return;
    }
    setIsOpen((prev) => !prev);
  };

  const dismissGuide = () => setShowGuide(false);

  return (
    <>
      {!isOpen && showGuide && (
        <div className="fixed bottom-24 right-6 w-72 md:w-80 rounded-xl bg-white/30 backdrop-blur-md border border-white/40 text-gray-900 shadow-xl p-4 z-30 transition-all duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-semibold text-sm text-blue-400">Need Help?</p>
              <p className="text-xs text-content">
                Tap the chat icon to talk with our AI assistant.
              </p>
            </div>
            <button
              onClick={dismissGuide}
              className="text-gray-700 hover:text-black text-lg font-bold px-1 rounded-md"
              aria-label="Dismiss Guide"
            >
              ×
            </button>
          </div>
        </div>
      )}
      <button
        className="fixed  bottom-4 right-4 inline-flex items-center justify-center text-sm font-medium disabled:pointer-events-none disabled:opacity-50 border rounded-full w-16 h-16 btn btn-primary  m-0 cursor-pointer border-gray-200 p-0 normal-case leading-5 hover:text-gray-900"
        type="button"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={toggleChat}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-white block border-gray-200 align-middle"
        >
          <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
        </svg>
      </button>

      {(isOpen || !isAuthenticated) && (
        <div className="fixed bottom-[calc(4rem+1.5rem)] right-0 mr-4 z-[72] w-[360px] md:w-[440px] h-[530px] md:h-[634px] backdrop-blur-xl rounded-2xl border border-white/30 shadow-xl overflow-hidden flex flex-col bg-base-200 transition-all duration-300">
          {!isAuthenticated && (
            <div className="absolute inset-0 z-10 flex flex-col justify-center items-center backdrop-blur-3xl text-center">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Login Required
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Please login to access the chatbot.
              </p>
              <button
                onClick={() => navigate("/login")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm transition"
              >
                Go to Login
              </button>
            </div>
          )}

          <div
            className={`relative z-0 flex flex-col h-full p-6 ${
              !isAuthenticated ? "pointer-events-none opacity-90 blur-sm" : ""
            }`}
          >
            <div className="flex flex-col space-y-1.5 pb-4">
              <h2 className="font-semibold text-gray-700 text-lg tracking-tight">
                Nox AI Chatbot
              </h2>
              <p className="text-sm text-[#6b7280] leading-3">{CHAT_SUBTITLE}</p>
            </div>

            <div className="flex flex-wrap gap-2 pb-4">
              {recommendedQuestions.map((question, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleQuestionClick(question)}
                  className="bg-gray-100 text-sm px-3 py-1 text-blue-700 rounded-full hover:bg-gray-200 transition"
                >
                  {question}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto pr-2 no-scrollbar min-h-0">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex gap-3 my-3 text-sm ${
                    msg.role === "user"
                      ? "justify-end text-right"
                      : "justify-start text-left"
                  }`}
                >
                  <div className="flex items-start gap-2 max-w-[80%]">
                    {msg.role === "assistant" && (
                      <div className="rounded-full bg-gray-100 border p-1 w-8 h-8 flex items-center justify-center shrink-0">
                        🤖
                      </div>
                    )}
                    <div className="bg-gray-100 rounded-md px-3 py-2 text-gray-700 max-w-[100%] text-left">
                      {msg.role === "assistant" ? (
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      ) : (
                        msg.content
                      )}
                      {msg.role === "assistant" &&
                        msg.type &&
                        Array.isArray(msg.products) &&
                        msg.products.length > 0 && (
                          <div className="mt-3 overflow-x-auto flex gap-3 pb-2 scrollbar">
                            {msg.products.map((product) => (
                              <div
                                key={product._id}
                                role="button"
                                tabIndex={0}
                                onClick={() =>
                                  navigate(`/products/${product._id}`)
                                }
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" || e.key === " ") {
                                    navigate(`/products/${product._id}`);
                                  }
                                }}
                                className="min-w-[120px] cursor-pointer bg-white border rounded-md p-2 shadow-sm flex-shrink-0"
                              >
                                <img
                                  src={product.image?.url}
                                  alt={product.title || product.name || "Product"}
                                  className="w-full h-20 object-cover rounded"
                                />
                                <p className="text-xs mt-2 font-semibold">
                                  {product.title || product.name}
                                </p>
                                <p className="text-xs text-gray-500 font-bold">
                                  ${product.price}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                    </div>
                    {msg.role === "user" && (
                      <div className="rounded-full bg-gray-100 border p-1 w-8 h-8 flex items-center justify-center shrink-0">
                        🧑
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isThinking && (
                <div className="text-gray-400 text-sm italic">Thinking...</div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form
              onSubmit={onSubmitAction}
              className="flex items-center pt-4 space-x-2 shrink-0"
            >
              <input
                className="flex h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Type your message"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={!isAuthenticated}
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2"
                disabled={!isAuthenticated}
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
