import { useEffect, useState } from "react";
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
import { useNavigate } from "react-router-dom";

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
        zIndex: 0,
      }}
      size={style.size}
    />
  );
};

const About = () => {
  const [isPageLoading, setPageLoading] = useState(true);
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

  const navigate = useNavigate();

  return isPageLoading ? (
    <Loading />
  ) : (
    <div className="min-h-screen text-base-content relative overflow-hidden">
      {/* Floating Background Icons */}
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

      {/* Section 3: Powered By */}
      <section className="w-full relative z-0">
        <div className="backdrop-blur-lg py-[5rem] my-2 shadow-xl relative z-3">
          <h1 className="text-4xl sm:text-6xl font-bold tracking-wide text-center">
            Nox Cart
          </h1>
          <ThreeDynamics />
        </div>
      </section>
      <section className="w-full relative z-0">
        <div className="backdrop-blur-lg p-12 py-[5rem] my-2 shadow-xl relative z-3">

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

      {/* Section 1: Welcome + Core Values */}
      <section className="w-full relative z-3">
        <div className="backdrop-blur-lg p-10 sm:p-16 shadow-xl relative z-3">
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
            <div className="bg-base-200 backdrop-blur-md p-10 rounded-2xl border border-base-300 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <FaEye className="text-primary text-2xl" />
                <h3 className="text-2xl font-bold">Our Vision</h3>
              </div>
              <p className="leading-relaxed">
                We envision a digital realm where online shopping transcends
                expectations. By harmonizing beauty and intelligence, Nox Cart
                transforms ordinary interactions into delightful journeys.
              </p>
            </div>
            <div className="bg-base-200 backdrop-blur-md p-10 rounded-2xl border border-base-300 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <FaBullseye className="text-primary text-2xl" />
                <h3 className="text-2xl font-bold">Our Mission</h3>
              </div>
              <p className="leading-relaxed">
                To push the boundaries of what's possible in e-commerce. With
                advanced tech and creative design, we offer users a futuristic,
                yet friendly, shopping experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="w-full relative z-3">
        <div className="backdrop-blur-lg mt-2 p-12 py-[6rem] shadow-2xl text-center relative z-3">
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
          <button onClick={() => navigate("/")} className="btn btn-primary btn-wide">Explore Nox Cart</button>
        </div>
      </section>
    </div>
  );
};

export default About;
