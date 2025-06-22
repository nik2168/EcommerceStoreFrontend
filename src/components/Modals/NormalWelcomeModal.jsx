// components/WelcomePreferenceModal.jsx
import { useState, useEffect } from "react";
import { FaHeart, FaTags, FaBuilding, FaCheck } from "react-icons/fa";
import { useSelector } from "react-redux";
import {
  useLazyFetchCategoriesQuery,
  useLazyFetchCompaniesQuery,
} from "../../features/api";
import toast from "react-hot-toast";
import { BsCart, BsSave, BsSave2Fill } from "react-icons/bs";
import { TextGenerateEffect } from "../ui/TextGenerateEffect";
import { useNavigate } from "react-router-dom";

// const categories = [
//   "Electronics",
//   "Fashion",
//   "Books",
//   "Home",
//   "Beauty",
//   "Sports",
// ];
// const companies = ["Apple", "Samsung", "Nike", "Sony", "Adidas", "LG"];

const NormalWelcomeModal = ({ isOpen, onClose, onSave }) => {
  const { user } = useSelector((state) => state.userState);
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[73] flex items-center justify-center bg-black/50">
      <div className="bg-white/10 backdrop-blur-2xl border border-white/30 rounded-3xl p-8 w-full max-w-7xl h-[60%] md:h-[80%] lg:h-[80%] mx-4 shadow-2xl relative text-base-content flex flex-col justify-center items-center">
        <button
          className="absolute top-4 right-4 text-white hover:text-primary"
          onClick={onClose}
        >
          ✕
        </button>
        <BsCart className="text-teal-400 text-5xl md:text-8xl lg:text-8xl my-3" />
        <div className="text-center mb-6 max-w-4xl ">
          {/* <h2 className="text-4xl text-base-200 font-bold mb-2">
            Welcome, {user?.username} 🎉
          </h2> */}
          {user ? (
            <TextGenerateEffect
              words={`Welcome to NOX-CART, ${user?.username} 🎉`}
              className="text-3xl md:text-6xl lg:text-7xl text-white font-bold mb-2"
              gradientIdx={2}
              delay={1}
            />
          ) : (
            <TextGenerateEffect
              words={`Welcome to NOX-CART`}
              className="text-3xl md:text-6xl lg:text-7xl text-white font-bold mb-2"
              gradientIdx={2}
              delay={1}
            />
          )}

          {/* <p className="text-base text-base-200 opacity-80">
            Let's personalize your experience with AI & Machine Learning
          </p> */}
          <TextGenerateEffect
            words={`${
              user
                ? "Let's personalize your experience with AI & Machine Learning"
                : "Please login to get personalized experience with AI & Machine Learning"
            }`}
            className="text-base text-white mt-6 opacity-80"
            gradientIdx={90}
            delay={0.9}
            duration={1}
          />
        </div>
        {!user && (
          <div className="text-center flex py-1 justify-center items-center">
            <button
              onClick={() => navigate("/login")}
              className="bg-gradient-to-r from-[#a5fecb] to-[#6dd5ed]   p-3 px-6 rounded-full  transition-all text-gray-800   flex items-center justify-center gap-2"
            >
              Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NormalWelcomeModal;
