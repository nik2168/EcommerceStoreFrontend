import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaRobot,
  FaRocket,
  FaBolt,
  FaEye,
  FaBullseye,
  FaCogs,
  FaShoppingCart,
} from "react-icons/fa";
import Loading from "../components/Loading";
import ThreeDynamics from "../components/ThreeDynamics";

// Floating icons
const floatingIcons = [
  FaShoppingCart,
  FaRobot,
  FaRocket,
  FaBolt,
  FaEye,
  FaBullseye,
  FaCogs,
];

const generatePositions = () =>
  floatingIcons.map(() => {
    const pos = ["top", "bottom"];
    const side = ["left", "right"];
    const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const randPercent = () => `${Math.floor(Math.random() * 80) + 10}%`;
    return {
      [rand(pos)]: randPercent(),
      [rand(side)]: randPercent(),
      size: 88 + Math.random() * 40,
      rotate: Math.random() * 30 - 15,
    };
  });

const FloatingIcon = ({ Icon, style, scrollY, index }) => {
  const depth = 0.15 + (index % 5) * 0.03;
  const floatOffset = Math.sin(Date.now() / 1000 + index) * 10;
  const translateY = scrollY * depth + floatOffset;

  return (
    <Icon
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
        zIndex: 0,
      }}
      size={style.size}
    />
  );
};

const About = () => {
  const navigate = useNavigate();
  const [isPageLoading, setPageLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const positions = useMemo(() => generatePositions(), []);

  // Delay to mimic page loading
  useEffect(() => {
    const timer = setTimeout(() => setPageLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  // Scroll tracking (optimized)
  useEffect(() => {
    let animationFrame;
    const updateScroll = () => {
      setScrollY((prev) => {
        const current = window.scrollY;
        return Math.abs(current - prev) > 1 ? current : prev;
      });
      animationFrame = requestAnimationFrame(updateScroll);
    };
    animationFrame = requestAnimationFrame(updateScroll);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  if (isPageLoading) return <Loading />;

  return (
    <div className="min-h-screen text-base-content relative overflow-hidden">
      {/* Floating Background Icons */}
      {floatingIcons.map((Icon, i) => (
        <FloatingIcon
          key={i}
          Icon={Icon}
          style={positions[i]}
          scrollY={scrollY}
          index={i}
        />
      ))}

      {/* Powered By Section */}
      <section className="w-full relative z-0">
        <div className="backdrop-blur-lg py-[5rem] my-2 shadow-xl">
          <h1 className="text-4xl sm:text-6xl font-bold tracking-wide text-center">
            Nox Cart
          </h1>
          <ThreeDynamics />
        </div>
      </section>

      <section className="w-full relative z-0">
        <div className="backdrop-blur-lg p-12 py-[5rem] my-2 shadow-xl">
          <div className="flex items-center justify-center gap-3 mb-8">
            <FaCogs className="text-primary text-2xl" />
            <h2 className="text-4xl font-bold">Powered By</h2>
          </div>
          <p className="mb-10 text-center max-w-3xl mx-auto">
            Behind Nox Cart is a stack of powerful and flexible technologies
            that drive performance, responsiveness, and intelligence.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              "ReactJS",
              "TailwindCSS",
              "DaisyUI",
              "TensorFlow.js",
              "MongoDB",
              "Node.js",
              "Cloudinary",
              "WebSockets",
            ].map((tech, i) => (
              <div
                key={i}
                className="bg-base-200 px-6 py-4 rounded-xl text-sm shadow-md text-center font-medium"
              >
                {tech}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="w-full relative z-3">
        <div className="backdrop-blur-lg p-10 sm:p-16 shadow-xl">
          <div className="grid grid-cols-1 mt-[3rem] sm:grid-cols-3 gap-10">
            {[
              {
                title: "Futuristic UI",
                desc: "Our interface blends modern design principles with futuristic aesthetics — soft blur, layered depth, and iOS-style cards that make browsing immersive.",
                icon: <FaRocket className="text-primary text-3xl mb-3" />,
              },
              {
                title: "AI Intelligence",
                desc: "Empowered by smart algorithms, we tailor your shopping journey based on preferences, history, and behavior, creating a truly personal experience.",
                icon: <FaRobot className="text-primary text-3xl mb-3" />,
              },
              {
                title: "Performance",
                desc: "We ensure lightning-speed page loads and smooth transitions with optimized code and modern deployment strategies.",
                icon: <FaBolt className="text-primary text-3xl mb-3" />,
              },
            ].map(({ title, desc, icon }, idx) => (
              <div
                key={idx}
                className="p-8 rounded-2xl bg-base-200 backdrop-blur-xl border border-base-300 shadow-xl text-center"
              >
                {icon}
                <h2 className="text-xl font-bold mb-2">{title}</h2>
                <p className="text-sm opacity-80 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-10">
            {[
              {
                title: "Our Vision",
                icon: <FaEye className="text-primary text-2xl" />,
                desc: `We envision a digital realm where online shopping transcends expectations. By harmonizing beauty and intelligence, Nox Cart transforms ordinary interactions into delightful journeys.`,
              },
              {
                title: "Our Mission",
                icon: <FaBullseye className="text-primary text-2xl" />,
                desc: `To push the boundaries of what's possible in e-commerce. With advanced tech and creative design, we offer users a futuristic, yet friendly, shopping experience.`,
              },
            ].map(({ title, desc, icon }, i) => (
              <div
                key={i}
                className="bg-base-200 backdrop-blur-md p-10 rounded-2xl border border-base-300 shadow-lg"
              >
                <div className="flex items-center gap-3 mb-4">
                  {icon}
                  <h3 className="text-2xl font-bold">{title}</h3>
                </div>
                <p className="leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full relative z-3">
        <div className="backdrop-blur-lg mt-2 p-12 py-[6rem] shadow-2xl text-center">
          <div className="flex justify-center items-center gap-3 mb-4">
            <FaShoppingCart className="text-primary text-2xl" />
            <h2 className="text-3xl font-bold">
              Ready to experience the future?
            </h2>
          </div>
          <p className="mb-6 max-w-2xl mx-auto">
            Explore Nox Cart today and discover a smarter, more stylish way to
            shop. We aren't just another platform — we're your gateway to
            next-gen commerce.
          </p>
          <button
            onClick={() => navigate("/")}
            className="btn btn-primary btn-wide"
          >
            Explore Nox Cart
          </button>
        </div>
      </section>
    </div>
  );
};

export default About;
