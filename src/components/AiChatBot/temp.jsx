import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { server } from "../../features/config";
import { useSocketEvents } from "../../hooks/hook";
import { AIRESPONSE, NEW_MESSAGE, ONLINE_USERS } from "../../utils/events";
import {
  loginUser,
  logoutUser,
  setOnlineUsers,
} from "../../features/user/userSlice";
import axios from "axios";
import useSocket from "../../utils/socket";
import ReactMarkdown from "react-markdown";

const Chatbot = () => {
  const user = useSelector((state) => state.userState.user);
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi, how can I help you today?" },
  ]);

  const [isThinking, setIsThinking] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const messagesEndRef = useRef(null);

  const toggleChat = () => {
    if (!user) {
      // navigate("/login");
      setIsAuthenticated(!isAuthenticated);
      setIsOpen(false);
      return;
    }
    setIsOpen(!isOpen);
  };
  useEffect(() => {
    axios
      .get(`${server}/api/v1/user/profile`, {
        withCredentials: true,
        authorization: `Bearer ${localStorage.getItem("nox_token")}`,
      })
      .then(({ data }) => {
        // console.log(data?.user?.role)
        dispatch(loginUser(data));
      })
      .catch((err) => {
        console.log(err);
        dispatch(logoutUser());
      });
  }, [dispatch]);

  const recommendedQuestions = [
    "Show me some best iphones",
    "Suggest a gift under $50",
    "Suggest me some shirts under $20",
  ];

  const handleQuestionClick = (question) => {
    setInput(question);
    onSubmitAction({ preventDefault: () => {} });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // const socket = useRef(null); // keep socket instance here
  // useEffect(() => {
  //   // 1. Connect to socket server (adjust URL as needed)
  //   socket.current = io(server, {
  //     transports: ["websocket"], // optional, more stable
  //     withCredentials: true, // optional if needed for cookies
  //   });

  //   // 2. Listen to events
  //   socket.current.on("connect", () => {
  //     console.log("Socket connected:", socket.current.id);
  //   });

  //   socket.current.on("disconnect", () => {
  //     console.log("Socket disconnected");
  //   });

  //   // 3. Clean up on unmount
  //   return () => {
  //     socket.current.disconnect();
  //   };
  // }, []);

  const socket = useSocket();

  const onSubmitAction = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const isProductQuery = /show me|suggest|deal|gift|recommend/i.test(input);

    const newUserMessage = {
      role: "user",
      content: input,
      type: isProductQuery ? true : false,
      userId: user._id,
    };
    socket?.current?.emit(NEW_MESSAGE, newUserMessage);
    setMessages((prev) => [...prev, newUserMessage]);
    setInput("");
    setIsThinking(true);
  };

  // const newMessageHandler = useCallback((data) => {
  //   if(data?.userId == user?._id)
  //   setMessages((prev) => [...prev, data]);
  // }, []);

  const aiResponseHandler = useCallback((data) => {
    if (data?.userId.toString() === user?._id.toString()) {
      setMessages((prev) => [...prev, data]);
      setIsThinking(false);
    }
  }, []);

  const onlineUsersHandler = (data) => {
    dispatch(setOnlineUsers(data));
  };

  const eventHandler = {
    [AIRESPONSE]: aiResponseHandler,
    [ONLINE_USERS]: onlineUsersHandler,
  };

  useSocketEvents(socket?.current, eventHandler);

  const [showGuide, setShowGuide] = useState(true);
  // useEffect(() => {
  //   const dismissed = localStorage.getItem("chatGuideDismissed");
  //   if (dismissed === "true") setShowGuide(false);
  // }, []);

  const dismissGuide = () => {
    // localStorage.setItem("chatGuideDismissed", "true");
    setShowGuide(false);
  };

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
              onClick={() => dismissGuide(false)}
              className="text-gray-700 hover:text-black text-lg font-bold px-1 rounded-md"
              aria-label="Dismiss Guide"
            >
              ×
            </button>
          </div>
        </div>
      )}
      {/* Floating Button */}
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

      {/* Chat Window */}
      {(isOpen || !isAuthenticated) && (
        <div className="fixed bottom-[calc(4rem+1.5rem)] right-0 mr-4 z-10 w-[360px] md:w-[440px] h-[530px] md:h-[634px] backdrop-blur-xl  rounded-2xl  border  border-white/30 shadow-xl overflow-hidden transition-all duration-300">
          {/* Overlay if not authenticated */}
          {!isAuthenticated && (
            <div className="absolute inset-0 z-10 flex flex-col justify-center items-center   backdrop-blur-3xl text-center">
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

          {/* Chat content */}
          <div
            className={`relative z-0 flex flex-col h-full p-6 blur-sm bg-base-200 ${
              !isAuthenticated ? "pointer-events-none opacity-90" : ""
            }`}
          >
            <div className="flex flex-col space-y-1.5 pb-4">
              <h2 className="font-semibold text-gray-700 text-lg tracking-tight">
                Noxy AI Chatbot
              </h2>
              <p className="text-sm text-[#6b7280] leading-3">
                Powered by Gemini + Tensorflow.js
              </p>
            </div>

            {/* Recommended Questions */}
            <div className="flex flex-wrap gap-2 pb-4">
              {recommendedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleQuestionClick(question)}
                  className="bg-gray-100 text-sm px-3 py-1 text-blue-700 rounded-full hover:bg-gray-200 transition"
                >
                  {question}
                </button>
              ))}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto pr-2 no-scrollbar">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex gap-3 my-3 text-sm ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div className="flex items-start gap-2 max-w-[80%]">
                    {msg.role === "assistant" && (
                      <div className="rounded-full bg-gray-100 border p-1 w-8 h-8 flex items-center justify-center">
                        🤖
                      </div>
                    )}
                    <div className="bg-gray-100 rounded-md px-3 py-2 text-gray-700 max-w-[100%]">
                      {msg.content}
                      {msg.type === "product-recommendation" && (
                        <div className="mt-3 overflow-x-auto flex gap-3 pb-2 scrollbar">
                          {msg?.products?.map((product) => (
                            <div
                              key={product.id}
                              className="min-w-[120px] bg-white border rounded-md p-2 shadow-sm flex-shrink-0"
                            >
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-20 object-cover rounded"
                              />
                              <p className="text-xs mt-2 font-semibold">
                                {product.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {product.price}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    {msg.role === "user" && (
                      <div className="rounded-full bg-gray-100 border p-1 w-8 h-8 flex items-center justify-center">
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

            {/* Input Form */}
            <form
              onSubmit={onSubmitAction}
              className="flex items-center pt-4 space-x-2"
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

      {isOpen && (
        <div className="fixed bottom-[calc(4rem+1.5rem)] right-0 mr-4 bg-white p-6 rounded-lg border border-[#e5e7eb] z-50 w-[360px] md:w-[440px] lg:w-[440px] h-[530px] md:h-[634px] lg:h-[634px] shadow-md flex flex-col">
          {/* Header */}
          <div className="flex flex-col space-y-1.5 pb-4">
            <h2 className="font-semibold text-gray-700 text-lg tracking-tight">
              Noxy AI Chatbot
            </h2>
            <p className="text-sm text-[#6b7280] leading-3">
              Powered by Gemini + Tensorflow.js
            </p>
          </div>

          {/* Recommended Questions */}
          <div className="flex flex-wrap gap-2 pb-4">
            {recommendedQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleQuestionClick(question)}
                className="bg-gray-100 text-sm px-3 py-1 text-blue-700 rounded-full hover:bg-gray-200 transition"
              >
                {question}
              </button>
            ))}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto pr-2">
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
                    <div className="rounded-full bg-gray-100 border p-1 w-8 h-8 flex items-center justify-center">
                      🤖
                    </div>
                  )}
                  <div className="bg-gray-100 rounded-md px-3 py-2 text-gray-700 max-w-[100%]">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                    {/* If assistant recommends products, render them */}
                    {msg?.products?.length && msg?.type && (
                      <div className="mt-3 overflow-x-auto flex gap-3 pb-2 scrollbar">
                        {msg?.products?.map((product) => (
                          <div
                            key={product._id}
                            onClick={() => {
                              navigate(`/products/${product._id}`);
                            }}
                            className="min-w-[120px] cursor-pointer bg-white border rounded-md p-2 shadow-sm flex-shrink-0"
                          >
                            <img
                              src={product.image.url}
                              alt={product.name}
                              className="w-25 h-20 object-cover rounded"
                            />
                            <p className="text-xs mt-2 font-semibold">
                              {product.name}
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
                    <div className="rounded-full bg-gray-100 border p-1 w-8 h-8 flex items-center justify-center">
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

          {/* Input Form */}
          <form
            onSubmit={onSubmitAction}
            className="flex items-center pt-4 space-x-2"
          >
            <input
              className="flex h-10 w-full rounded-md border  border-[#e5e7eb] px-3 py-2 text-sm placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#9ca3af] disabled:cursor-not-allowed disabled:opacity-50 text-content focus-visible:ring-offset-2"
              placeholder="Type your message"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium text-white disabled:pointer-events-none disabled:opacity-50 btn btn-primary  h-10 px-4 py-2"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;
