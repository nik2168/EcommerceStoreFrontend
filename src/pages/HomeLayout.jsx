import { Outlet } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Loading from "../components/Loading";
import Chatbot from "../components/AiChatBot/ChatBot";
import Footer from "../components/Footer";
import WelcomePreferenceModal from "../components/Modals/WelcomePreferenceModal";
import NormalWelcomeModal from "../components/Modals/NormalWelcomeModal";
import { useUpdateUserPreferencesMutation } from "../features/api";
import { useAsyncMutation } from "../hooks/hook";
import {
  FaRobot,
  FaRocket,
  FaBolt,
  FaEye,
  FaBullseye,
  FaCogs,
  FaShoppingCart,
} from "react-icons/fa";

// All available icons
const floatingIcons = [
  FaShoppingCart,
  FaRobot,
  FaRocket,
  FaBolt,
  FaEye,
  FaBullseye,
  FaCogs,
];

// Generate one position per icon
const generatePositions = () =>
  floatingIcons.map(() => {
    const positions = ["top", "bottom"];
    const sides = ["left", "right"];
    const random = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const randomPercent = () => `${Math.floor(Math.random() * 80) + 10}%`;

    return {
      [random(positions)]: randomPercent(),
      [random(sides)]: randomPercent(),
      size: 88 + Math.random() * 40,
      rotate: Math.random() * 30 - 15,
    };
  });

const FloatingIcon = ({ Icon, style, scrollY, index }) => {
  const depth = 0.15 + (index % 5) * 0.03;
  const time = Date.now() / 1000;
  const floatOffset = Math.sin(time + index) * 10;
  const translateY = scrollY * depth + floatOffset;

  return (
    <Icon
      className="text-base-200"
      style={{
        position: "absolute",
        color: "teal",
        opacity: 0.9,
        filter: "blur(6px)",
        transform: `translateY(${translateY}px) rotate(${style.rotate}deg)`,
        transition: "transform 0.1s linear",
        ...style,
        pointerEvents: "none",
        userSelect: "none",
        zIndex: -1,
      }}
      size={style.size}
    />
  );
};


const HomeLayout = () => {
  const { isPageLoading } = useSelector((state) => state.productState);
  const { user } = useSelector((state) => state.userState);

  const [showModal, setShowModal] = useState(false);
  const [showNormalModal, setNormalModal] = useState(false);

  const [updateUserPreferences] = useAsyncMutation(
    useUpdateUserPreferencesMutation
  );

  const currentPage = useMemo(() => window.location.pathname, []);

  const hasPreferences = useMemo(() => {
    return (
      user?.preferences?.categories?.length === 3 &&
      user?.preferences?.companies?.length === 3
    );
  }, [user]);

  useEffect(() => {
    if (currentPage !== "/") return;

    if (!user) return;

    const timer = setTimeout(() => {
      hasPreferences ? setNormalModal(true) : setShowModal(true);
    }, 600);

    return () => clearTimeout(timer);
  }, [currentPage, user, hasPreferences]);

  const handleSavePreferences = async (preferences) => {
    await updateUserPreferences("Creating personalized experience...", {
      categories: preferences.categories.map((i) => i._id),
      companies: preferences.companies.map((i) => i._id),
    });
  };

    const [scrollY, setScrollY] = useState(0);
    const [positions] = useState(generatePositions());
  
    useEffect(() => {
      const handleScroll = () => setScrollY(window.scrollY);
      window.addEventListener("scroll", handleScroll);
  
      const interval = setInterval(() => {
        setScrollY(window.scrollY);
      }, 40); // ~24 FPS
  
      return () => {
        window.removeEventListener("scroll", handleScroll);
        clearInterval(interval);
      };
    }, []);
  
    useEffect(() => {
      const timer = setTimeout(() => setPageLoading(false), 300);
      return () => clearTimeout(timer);
    }, []);

  return (
    <>
      <Header />
      <Navbar />
      <NormalWelcomeModal
        isOpen={showNormalModal}
        onClose={() => setNormalModal(false)}
      />
      <WelcomePreferenceModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSavePreferences}
      />
      {isPageLoading ? (
        <Loading />
      ) : (
        <section className="relative overflow-hidden min-h-[100vh] max-w-full px-2">
          {floatingIcons.map((Icon, i) => (
            <FloatingIcon
              className="text-primary"
              key={i}
              Icon={Icon}
              style={positions[i]}
              scrollY={scrollY}
              index={i}
            />
          ))}
          <Outlet />
        </section>
      )}
      <Footer />
      <Chatbot />
    </>
  );
};

export default HomeLayout;
