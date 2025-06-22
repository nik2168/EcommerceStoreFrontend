// components/WelcomePreferenceModal.jsx
import { useState, useEffect } from "react";
import { FaHeart, FaTags, FaBuilding, FaCheck } from "react-icons/fa";
import { useSelector } from "react-redux";
import {
  useLazyFetchCategoriesQuery,
  useLazyFetchCompaniesQuery,
} from "../../features/api";
import toast from "react-hot-toast";
import { BsSave, BsSave2Fill } from "react-icons/bs";
import { TextGenerateEffect } from "../ui/TextGenerateEffect";

// const categories = [
//   "Electronics",
//   "Fashion",
//   "Books",
//   "Home",
//   "Beauty",
//   "Sports",
// ];
// const companies = ["Apple", "Samsung", "Nike", "Sony", "Adidas", "LG"];

const WelcomePreferenceModal = ({ isOpen, onClose, onSave }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedCompanies, setSelectedCompanies] = useState([]);

  const [categories, setCategories] = useState([]);
  const [companies, setCompanies] = useState([]);

  const [fetchCategories] = useLazyFetchCategoriesQuery();
  const [fetchCompanies] = useLazyFetchCompaniesQuery();

  // Fetch categories and companies on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, comRes] = await Promise.all([
          fetchCategories(),
          fetchCompanies(),
        ]);
        setCategories(catRes?.data?.categories || []);
        setCompanies(comRes?.data?.companies || []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setSelectedCategories([]);
      setSelectedCompanies([]);
    }
  }, [isOpen]);

  const toggleSelection = (type, value) => {
    if (
      type === "category" &&
      3 === selectedCategories.length &&
      !selectedCategories.includes(value)
    ) {
      toast.error("You can only select up to 3 categories");
      return;
    }
    if (
      type === "company" &&
      3 === selectedCompanies.length &&
      !selectedCompanies.includes(value)
    ) {
      toast.error("You can only select up to 3 companies");
      return;
    }
    const set =
      type === "category" ? setSelectedCategories : setSelectedCompanies;
    const current =
      type === "category" ? selectedCategories : selectedCompanies;
    if (current.includes(value)) {
      set(current.filter((v) => v !== value));
    } else {
      set([...current, value]);
    }
  };

  const handleSave = () => {
    onSave({ categories: selectedCategories, companies: selectedCompanies });
    onClose();
  };

  const { user } = useSelector((state) => state.userState);
  if (!isOpen) return null;

  const screenWidth = window.innerWidth;
  let isMobile = screenWidth <= 640;

  return (
    <div className="fixed inset-0 z-[76] flex items-center justify-center bg-black/50">
      <div className="bg-white/10 backdrop-blur-2xl border border-white/30 rounded-3xl p-8 w-full max-w-4xl mx-4 shadow-2xl relative text-base-content">
        <button
          className="absolute top-4 right-4 text-white hover:text-primary"
          onClick={onClose}
        >
          ✕
        </button>
        <div className="text-center mb-6">
          {/* <h2 className="text-4xl text-base-200 font-bold mb-2">
            Welcome, {user?.username} 🎉
          </h2> */}
          <TextGenerateEffect
            words={`Welcome to NOX-CART, ${user?.username} 🎉`}
            className="text-xl md:text-4xl lg:text-4xl text-white font-bold mb-2"
            gradientIdx={2}
            delay={1}
          />
          {/* <p className="text-base text-base-200 opacity-80">
            Let's personalize your experience with AI & Machine Learning
          </p> */}
          <TextGenerateEffect
            words={`Let's personalize your experience `}
            className="text-base text-base-200 opacity-80 text-[0.65rem] md:text-[0.9rem] lg:text-[0.9rem] font-extralight "
            gradientIdx={9}
            delay={0.9}
            duration={1}
          />
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <FaTags className="text-teal-400 size-6" />
            <h3 className="text-lg text-white font-semibold">
              Your Favorite Categories
            </h3>
          </div>
          <div className="flex flex-wrap gap-2 text-xs md:text-sm lg:text-md">
            {categories
              ?.slice(1, isMobile ? 9 : categories.length)
              .map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => toggleSelection("category", cat)}
                  className={`px-4 py-2 rounded-full border ${
                    selectedCategories.includes(cat)
                      ? "bg-primary text-white border-primary"
                      : "bg-white/20 text-white border-white/30"
                  } hover:bg-primary hover:text-white transition`}
                >
                  {cat.name}
                </button>
              ))}
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <FaBuilding className="text-teal-400  size-5" />
            <h3 className="text-lg font-semibold text-white">
              Favorite Brands
            </h3>
          </div>
          <div className="flex flex-wrap gap-2 text-xs md:text-sm lg:text-md">
            {companies
              ?.slice(1, isMobile ? 8 : companies.length)
              .map((comp) => (
                <button
                  key={comp._id}
                  onClick={() => toggleSelection("company", comp)}
                  className={`px-4 py-2 rounded-full border ${
                    selectedCompanies.includes(comp)
                      ? "bg-primary text-white border-primary"
                      : "bg-white/20 text-white border-white/30"
                  } hover:bg-primary hover:text-white transition`}
                >
                  {comp.name}
                </button>
              ))}
          </div>
        </div>

        <div className="text-center flex py-1 justify-center items-center">
          <button
            onClick={handleSave}
            className="bg-primary p-3 px-4 rounded-full hover:bg-opacity-75 transition-all text-base-100 bg-opacity-60  flex items-center justify-center gap-2"
          >
            <BsSave /> Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomePreferenceModal;
