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

const HomeLayout = () => {
  const { user } = useSelector((state) => state.userState);

  const [isPageLoading, setPageLoading] = useState(true);
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
    if (currentPage !== "/" || !user) return;

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
          <Outlet />
        </section>
      )}

      <Footer />
      <Chatbot />
    </>
  );
};

export default HomeLayout;
