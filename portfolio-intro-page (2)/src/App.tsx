/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  ExternalLink, 
  MapPin, 
  Calendar, 
  Send, 
  Sparkles, 
  Folder, 
  ArrowLeft, 
  BookOpen, 
  Code, 
  Brush, 
  Trash2,
  CheckCircle,
  Instagram
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
// @ts-ignore
import defaultPortrait from "./assets/images/kimeunbin_portrait_1781527351351.jpg";

// Structure of guestbook notes
interface GuestbookNote {
  id: string;
  name: string;
  message: string;
  date: string;
  paperColor: string;
}

// Predefined list of selected projects styled as analog index cards
const PROJECTS = [
  {
    id: "chronos",
    title: "Chronos Sundial",
    category: "Creative Dev",
    description: "An analog digital clock workspace mimicking natural lighting, cast shadows, and solar orbits based on real-time geolocating sun paths.",
    tech: ["React", "HTML5 Canvas", "SVG Path", "CSS 3D"],
    color: "#F4EDE2",
    details: "Built as an exploration of digital timekeeping using physical constraints. Uses custom shaders to render genuine paper shadow texture that elongates and shrinks depending on the time of day."
  },
  {
    id: "scribe",
    title: "Scribe Notebook",
    category: "Performance",
    description: "A gorgeous, distraction-free markdown note-taking suite with realistic ink dispersion, paper-crinkle feedback, and local-first syncing.",
    tech: ["WebSockets", "IndexedDB", "Markdown-IT", "Tailwind CSS"],
    color: "#EFECE6",
    details: "Scribe translates raw markdown strings into natural handwriting on screen. Implements a customized low-latency ink shader that simulates physical ink dry times on various parchment textures."
  },
  {
    id: "linen-canvas",
    title: "Linen Board",
    category: "Design System",
    description: "A collaborative drawing whiteboard with deckle-edge visual rendering and custom canvas brushes that mimic charcoal and graphite.",
    tech: ["React", "Canvas API", "WebRtc", "D3.js Grid"],
    color: "#EAE6DF",
    details: "Linen Board uses a customized high-performance rendering engine that applies interactive paper-grain noise to drawings. Features standard cross-session persistence and real-time cursor synchrony."
  }
];

// Predefined creative gallery item descriptions
const GALLERY_ITEMS = [
  {
    id: "digi-design-01",
    title: "01 요가는 김은빈에게...",
    src: "/digi_design_01.png",
    alt: "Digi Design 01",
    description: "요가는 김은빈에게 단순한 신체 수련을 넘어, 일상의 소음을 잠재우고 내면에 온전히 귀를 기울이는 고요한 쉼터입니다. 호흡의 흐름을 따라 몸과 마음의 진정한 균형과 온전한 자아 회복을 경험하는 여정입니다.",
    tag: "Yoga & Mindfulness"
  },
  {
    id: "font-concept",
    title: "02 Professional",
    src: "/font_concept.png",
    alt: "Font Concept Sheet",
    description: "폰트를 이용해 단어를 시각화한 타이포그래피 작품입니다.\n형태감이 없는 형용사를 형용사 뜻의 느낌이 시각적으로 잘 나타나도록 디자인한 작품입니다.",
    tag: "Typography Research"
  },
  {
    id: "template-shape",
    title: "03 패턴",
    src: "/template_shape.png",
    alt: "Shape Template",
    description: "단순한 한글 자모 및 기초 기하 조형의 무한 증식과 레이어 중첩, 회전 및 크기 스케일 조정을 통해 구조적인 패턴 디자인을 탐구하는 조형 실험 템플릿입니다. 규칙이 만들어내는 유기적인 입체 형태와 볼륨감을 제공합니다.",
    tag: "Generative Shape Experiment"
  },
  {
    id: "bookplate",
    title: "04 EX LIBRIS",
    src: "/bookplate.png",
    alt: "Ex Libris Bookplate Design Art",
    description: "다채라는 제목의 장서표 디자인 출품작입니다.\n단순히 책을 읽는 공간이 아니라, 다양한 경험과 문화가 어우러지는 복합문화공간인 인제 기적의 도서관을 다채로운 색으로 변하는 카멜레온에 형상과 색채로 표현하였습니다.",
    tag: "Ex Libris Artwork"
  },
  {
    id: "memories",
    title: "05 추억",
    src: "/memories.png",
    alt: "Memories concept",
    description: "실루엣을 이용한 표현 작품입니다. 소중하고 따스했던 일상 속의 기억들을 표현했습니다.",
    tag: "Creative Archive & Photography"
  }
];

// Pre-seeded guestbook entries for instant visual richness
const SEED_NOTES: GuestbookNote[] = [
  {
    id: "seed-1",
    name: "Aria Thorne",
    message: "Building an envelope that unfolds in pure CSS and React is such a wonderful detail! The tactile responsiveness is incredible.",
    date: "Jun 14, 2026",
    paperColor: "bg-[#FAF7F2]"
  },
  {
    id: "seed-2",
    name: "Marc Sterling",
    message: "Absolutely head over heels for this warm color palette. Feels like an editorial journal instead of standard tech-bro layouts. Love it!",
    date: "Jun 13, 2026",
    paperColor: "bg-[#F3EFE9]"
  }
];

const NOTE_COLORS = [
  "bg-[#FAF7F2]", // soft cream
  "bg-[#F3EFE9]", // light beige
  "bg-[#EFECE5]", // paper gray
  "bg-[#EAE6DD]", // warm clay
];

function isPortraitValid(src: any): boolean {
  if (!src) return false;
  if (typeof src !== "string") return false;
  const trimmed = src.trim();
  if (
    trimmed === "" || 
    trimmed === "null" || 
    trimmed === "undefined" || 
    trimmed === "[object Object]"
  ) {
    return false;
  }
  return (
    trimmed.startsWith("data:") || 
    trimmed.startsWith("blob:") || 
    trimmed.startsWith("http") || 
    trimmed.startsWith("/")
  );
}

export default function App() {
  // --- STATE FOR INTRO ENVELOPE SCREEN ---
  const [isOpen, setIsOpen] = useState(false);
  const [isFlapBehind, setIsFlapBehind] = useState(false);
  const [isLetterInFront, setIsLetterInFront] = useState(false);

  // --- TRANSITION STATES ---
  const [currentScreen, setCurrentScreen] = useState<"intro" | "portfolio">("intro");
  const [portfolioView, setPortfolioView] = useState<"cover" | "profile" | "gallery">("cover");
  const [selectedGalleryIdx, setSelectedGalleryIdx] = useState<number>(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // --- PORTFOLIO SCREEN STATES ---
  const [selectedProject, setSelectedProject] = useState<typeof PROJECTS[0] | null>(null);
  const [guestNotes, setGuestNotes] = useState<GuestbookNote[]>([]);
  const [newName, setNewName] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [showSubmissionSuccess, setShowSubmissionSuccess] = useState(false);
  
  // --- CUSTOM PORTRAIT IMAGE STATE ---
  const [customPortrait, setCustomPortrait] = useState<string | null>(null);

  // --- SHOW CHOSEN PROFILE DETAILS STATE ---
  const [showDetails, setShowDetails] = useState(false);
  const [hideCaption, setHideCaption] = useState(false);

  // --- TYPEWRITER AUTO EFFECT ON SECOND SCREEN LOAD ---
  const [typedTextLines, setTypedTextLines] = useState<string[]>(["", "", ""]);

  useEffect(() => {
    if (currentScreen !== "portfolio" || portfolioView !== "cover") {
      setTypedTextLines(["", "", ""]);
      return;
    }

    const fullLines = [
      "Kimeunbin",
      "Undergraduate student",
      "Visual Design / Art Direction"
    ];

    let currentLineIdx = 0;
    let currentCharIdx = 0;
    let timerId: any = null;

    // Reset before start typing
    setTypedTextLines(["", "", ""]);

    const typeNextChar = () => {
      if (currentLineIdx >= fullLines.length) {
        return;
      }

      const fullText = fullLines[currentLineIdx];
      if (currentCharIdx < fullText.length) {
        currentCharIdx++;
        setTypedTextLines(prev => {
          const next = [...prev];
          next[currentLineIdx] = fullText.slice(0, currentCharIdx);
          return next;
        });
        timerId = setTimeout(typeNextChar, 50); // Typing speed
      } else {
        currentLineIdx++;
        currentCharIdx = 0;
        timerId = setTimeout(typeNextChar, 250); // Pause before next line
      }
    };

    timerId = setTimeout(typeNextChar, 100);

    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [currentScreen, portfolioView]);

  // --- AUTOMATIC SCROLL TO THE CLICKED GALLERY PIECE ---
  useEffect(() => {
    if (portfolioView === "gallery") {
      const timer = setTimeout(() => {
        const element = document.getElementById(`gallery-item-${selectedGalleryIdx}`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [portfolioView, selectedGalleryIdx]);

  // --- LOAD/PERSIST GUESTBOOK & CUSTOM PORTRAIT ---
  useEffect(() => {
    const saved = localStorage.getItem("kimeunbin_guestbook_v1");
    if (saved) {
      try {
        setGuestNotes(JSON.parse(saved));
      } catch (e) {
        setGuestNotes(SEED_NOTES);
      }
    } else {
      setGuestNotes(SEED_NOTES);
      localStorage.setItem("kimeunbin_guestbook_v1", JSON.stringify(SEED_NOTES));
    }

    // Load custom portrait if any
    const savedPortrait = localStorage.getItem("kimeunbin_custom_portrait");
    if (savedPortrait) {
      if (!isPortraitValid(savedPortrait) || savedPortrait.includes("/src/assets/")) {
        localStorage.removeItem("kimeunbin_custom_portrait");
        setCustomPortrait(null);
      } else {
        setCustomPortrait(savedPortrait);
      }
    }
  }, []);

  // Sync flap z-indices in a physically correct 3D transition timing
  useEffect(() => {
    let timer: any;
    let letterTimer: any;
    if (isOpen) {
      // When opening, bring top flap back (lower z) so letter slides in front of it
      timer = setTimeout(() => {
        setIsFlapBehind(true);
      }, 150);

      // Slide letter out and then bring it to the absolute front of all flaps (over z-25)
      letterTimer = setTimeout(() => {
        setIsLetterInFront(true);
      }, 500);
    } else {
      // When closing, immediately return letter to inside pocket (z-10), and close flap afterward
      setIsLetterInFront(false);
      timer = setTimeout(() => {
        setIsFlapBehind(false);
      }, 200);
    }
    return () => {
      clearTimeout(timer);
      clearTimeout(letterTimer);
    };
  }, [isOpen]);

  // Transition from Intro to Portfolio
  const handleEnterPortfolio = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentScreen("portfolio");
      setPortfolioView("cover");
      setIsTransitioning(false);
      // Scroll to top
      window.scrollTo(0, 0);
    }, 1000);
  };

  // Back to Intro
  const handleBackToIntro = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentScreen("intro");
      setIsOpen(false);
      setIsFlapBehind(false);
      setIsTransitioning(false);
      setShowDetails(false);
      setHideCaption(false);
    }, 800);
  };

  // Back to cover or intro
  const handleBackToCoverOrIntro = () => {
    if (showDetails) {
      setShowDetails(false);
      setTimeout(() => {
        setHideCaption(false);
      }, 500);
    } else {
      handleBackToIntro();
    }
  };

  // Handle photo click with sequential fade and slide animation
  const handlePhotoClick = () => {
    if (!showDetails) {
      // 1. Hide caption first
      setHideCaption(true);
      // 2. Wait for typewriter caption fade-out to complete, then slide left and show details
      setTimeout(() => {
        setShowDetails(true);
      }, 300);
    } else {
      // 1. Slide back and hide details
      setShowDetails(false);
      // 2. Wait for slide animation to complete, then restore typewriter caption
      setTimeout(() => {
        setHideCaption(false);
      }, 600);
    }
  };

  // Handle click on any moodboard side image to view details
  const handleImageClick = (idx: number) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedGalleryIdx(idx);
      setPortfolioView("gallery");
      setIsTransitioning(false);
      window.scrollTo(0, 0);
    }, 450);
  };

  // Add notes to stationery guestbook
  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newMessage.trim()) return;

    const chosenColor = NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)];
    const newNote: GuestbookNote = {
      id: "note-" + Date.now(),
      name: newName.trim(),
      message: newMessage.trim(),
      date: new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' }),
      paperColor: chosenColor
    };

    const updated = [newNote, ...guestNotes];
    setGuestNotes(updated);
    localStorage.setItem("kimeunbin_guestbook_v1", JSON.stringify(updated));

    setNewName("");
    setNewMessage("");
    setShowSubmissionSuccess(true);
    setTimeout(() => setShowSubmissionSuccess(false), 4000);
  };

  // Clear note
  const handleDeleteNote = (id: string) => {
    const updated = guestNotes.filter(n => n.id !== id);
    setGuestNotes(updated);
    localStorage.setItem("kimeunbin_guestbook_v1", JSON.stringify(updated));
  };

  return (
    <div id="main-canvas" className="min-h-screen bg-[#FAF6F2] text-[#3D2B1F] relative overflow-x-hidden font-lora">
      
      {/* 1. PREMIUM STATIC SVG PAPER-GRAIN NOISE FILTER */}
      {/* High-fidelity, GPU-accelerated noise pattern creating organic tactile charm */}
      <svg id="texture-noise-overlay" className="fixed pointer-events-none opacity-[0.035] w-full h-full left-0 top-0 z-[999]">
        <filter id="paper-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="matrix" values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.07 0" />
          <feBlend mode="multiply" in="SourceGraphic" />
        </filter>
        <rect width="100%" height="100%" filter="url(#paper-noise)" />
      </svg>



      {/* --- INTRO SCREEN VIEW --- */}
      {currentScreen === "intro" && (
        <div 
          id="intro-view"
          className={`min-h-screen w-full flex flex-col items-center justify-center relative p-6 transition-opacity duration-1000 ${
            isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"
          }`}
        >
          {/* Main Envelope Wrap Box */}
          {/* Pure click triggers opening and transition cleanly */}
          <div 
            id="envelope-stage"
            className="w-full max-w-[700px] flex flex-col items-center justify-center relative animate-[fadeIn_0.6s_ease-out]"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
            onClick={handleEnterPortfolio}
          >
            {/* Envelope Outer Frame with subtle perspective for rotating 3D flap */}
            <div 
              id="envelope-body-container"
              className="relative w-[280px] h-[196px] sm:w-[500px] sm:h-[350px] select-none cursor-pointer"
              style={{ perspective: "1200px" }}
            >
              
              {/* BACKPLATE / INNER ENVELOPE WALL (Z-0) */}
              <div 
                id="envelope-backplate"
                className="absolute inset-0 bg-[#FFFFFF] border border-neutral-300 rounded-sm overflow-hidden transition-all duration-300"
              />
 
               {/* THE LETTER CARD (Z-10 / Z-[25]) */}
              {/* Slides physically out of the pocket when envelope is opened, then moves in front of the flaps */}
              <div 
                id="stationery-letter"
                className={`absolute left-[5%] w-[90%] h-[180px] sm:h-[320px] bg-white rounded-sm letter-slide shadow-[0_4px_16px_rgba(0,0,0,0.04)] flex items-center justify-center p-4 sm:p-8 ${
                  isLetterInFront ? "z-[25] cursor-pointer is-front" : "z-10 cursor-default"
                } ${isOpen ? "is-open" : ""}`}
              >
                <div className="text-center select-none pointer-events-none transition-all duration-300">
                  <h1 
                    className="text-[#3D2B1F] text-base sm:text-2xl font-normal tracking-tight leading-tight"
                    style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
                  >
                    Nice to meet you ^-^
                  </h1>
                </div>
              </div>

              {/* FRONT OUTER INTERLOCKING FLAPS (Z-20) */}
              {/* These cover the bottom half so the letter starts completely hidden inside */}
              
              {/* Left Flap */}
              <div 
                id="envelope-left-flap"
                className="absolute inset-0 z-20 pointer-events-none transition-opacity duration-300"
              >
                <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <polygon points="0,0 50,50 0,100" fill="#FFFFFF" stroke="none" />
                </svg>
              </div>

              {/* Right Flap */}
              <div 
                id="envelope-right-flap"
                className="absolute inset-0 z-20 pointer-events-none transition-opacity duration-300"
              >
                <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <polygon points="100,0 50,50 100,100" fill="#FFFFFF" stroke="none" />
                </svg>
              </div>

              {/* Bottom Flap (Overlaps Left & Right slightly by peaking at 45% center) */}
              <div 
                id="envelope-bottom-flap"
                className="absolute inset-0 z-20 pointer-events-none transition-all duration-300"
              >
                <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <polygon points="0,100 50,45 100,100" fill="#FFFFFF" stroke="none" />
                </svg>
              </div>

              {/* THREE-DIMENSIONAL ROTATING TOP FLAP (Z-30 when closed, Z-5 when opened) */}
              <div 
                id="envelope-top-flap"
                className={`absolute top-0 left-0 w-full h-[55%] origin-top`}
                style={{
                  transform: isOpen ? "rotateX(180deg)" : "rotateX(0deg)",
                  transformStyle: "preserve-3d",
                  zIndex: isFlapBehind ? 5 : 30, // Toggle z-index precisely when folder passes horizontal flat
                  transition: "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), z-index 0.5s",
                }}
              >
                {/* SVG polygon rendering the precise hanging triangle shape of the flap */}
                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                  {/* Flap Outer Paper */}
                  <polygon points="0,0 50,100 100,0" fill="#FFFFFF" stroke="all" className="stroke-neutral-300/80" strokeWidth="0.5" />
                </svg>
              </div>

            </div>

             {/* Elegant centered text under envelope exactly matching Slide 1 */}
            <div className="absolute top-[calc(100%+32px)] left-0 right-0 text-center animate-[fadeIn_0.8s_ease-out_0.2s_both] select-none pointer-events-none">
              <span 
                className="text-[#3D2B1F]/90 text-sm sm:text-base font-medium tracking-[0.05em] font-sans"
                style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
              >
                Kimeunbin’s portfolio
              </span>
            </div>
          </div>

        </div>
      )}

      {/* --- PORTFOLIO CONTENT SCREEN VIEW --- */}
      {currentScreen === "portfolio" && (
        <div 
          id="portfolio-view"
          className={`w-full min-h-screen transition-opacity duration-1000 ${
            isTransitioning ? "opacity-0" : "opacity-100"
          }`}
        >
          {/* SLIDE 2 COVER: Pristine full-viewport screen centering the portrait of Kimeunbin */}
          {portfolioView === "cover" && (
            <div 
              id="slide2-cover"
              className="w-full h-screen relative flex flex-col items-center justify-center p-6 bg-[#FAF6F2] select-none overflow-hidden"
            >
              {/* Backside/Background Interactive Creative Studio Moodboard Elements */}
              {!showDetails && (
                <>
                  {/* 1. Top-Left: digi_design_01.png */}
                  <div 
                    onClick={() => handleImageClick(0)}
                    className="absolute left-[10%] top-[10%] sm:left-[16%] sm:top-[14%] lg:left-[20%] lg:top-[16%] z-[5] w-[75px] sm:w-[110px] md:w-[135px] lg:w-[160px] opacity-0 hover:opacity-100 cursor-pointer"
                  >
                    <img 
                      src="/digi_design_01.png" 
                      alt="Digi Design 01" 
                      className="w-full h-auto object-contain select-none pointer-events-none"
                    />
                  </div>

                  {/* 2. Top-Right: Font Concept Sheet */}
                  <div 
                    onClick={() => handleImageClick(1)}
                    className="absolute right-[10%] top-[10%] sm:right-[16%] sm:top-[14%] lg:right-[20%] lg:top-[16%] z-[5] w-[75px] sm:w-[110px] md:w-[135px] lg:w-[160px] opacity-0 hover:opacity-100 cursor-pointer"
                  >
                    <img 
                      src="/font_concept.png" 
                      alt="Font Concept Sheet" 
                      className="w-full h-auto object-contain select-none pointer-events-none"
                    />
                  </div>

                  {/* 3. Bottom-Left: Shape Template */}
                  <div 
                    onClick={() => handleImageClick(2)}
                    className="absolute left-[10%] bottom-[12%] sm:left-[16%] sm:bottom-[16%] lg:left-[20%] lg:bottom-[18%] z-[5] w-[75px] sm:w-[110px] md:w-[135px] lg:w-[160px] opacity-0 hover:opacity-100 cursor-pointer"
                  >
                    <img 
                      src="/template_shape.png" 
                      alt="Shape Template" 
                      className="w-full h-auto object-contain select-none pointer-events-none"
                    />
                  </div>

                  {/* 4. Bottom-Right: Ex Libris multi-layered bookplate art */}
                  <div 
                    onClick={() => handleImageClick(3)}
                    className="absolute right-[10%] bottom-[12%] sm:right-[16%] sm:bottom-[16%] lg:right-[20%] lg:bottom-[18%] z-[5] w-[75px] sm:w-[110px] md:w-[135px] lg:w-[160px] opacity-0 hover:opacity-100 cursor-pointer"
                  >
                    <img 
                      src="/bookplate.png" 
                      alt="Ex Libris Bookplate Design Art" 
                      className="w-full h-auto object-contain select-none pointer-events-none"
                    />
                  </div>

                  {/* 5. Middle-Left (Safe side space): Memories photo */}
                  <div 
                    onClick={() => handleImageClick(4)}
                    className="absolute left-[8%] top-[50%] -translate-y-1/2 sm:left-[12%] lg:left-[15%] z-[5] w-[75px] sm:w-[110px] md:w-[135px] lg:w-[160px] opacity-0 hover:opacity-100 cursor-pointer"
                  >
                    <img 
                      src="/memories.png" 
                      alt="Memories concept" 
                      className="w-full h-auto object-contain select-none pointer-events-none"
                    />
                  </div>
                </>
              )}

              {/* Centered or Left-aligned photograph with detailed description */}
              <motion.div 
                layout
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className={`relative flex ${showDetails ? "flex-col sm:flex-row items-start sm:items-center gap-8 sm:gap-16" : "flex-col items-center pb-24 sm:pb-28"} w-full max-w-3xl justify-center mx-auto`}
              >
                <motion.div 
                  layout
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                  whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                  onClick={handlePhotoClick}
                  className="w-[280px] h-[210px] sm:w-[360px] sm:h-[270px] shrink-0 rounded-none overflow-hidden border border-neutral-200/60 shadow-[0_4px_24px_rgba(0,0,0,0.03)] cursor-pointer"
                >
                  <img 
                    src={isPortraitValid(customPortrait) ? customPortrait : defaultPortrait} 
                    alt="Kimeunbin's Portrait" 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover select-none pointer-events-none"
                  />
                </motion.div>

                {/* Right side container */}
                <AnimatePresence mode="wait">
                  {(!hideCaption && !showDetails) && (
                    <motion.div 
                      key="typewriter-block"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                      className="absolute top-[230px] sm:top-[295px] w-full max-w-[280px] sm:max-w-[360px] h-20 flex flex-col items-start justify-start text-left"
                    >
                      <div className="font-mono leading-relaxed tracking-wider text-[#3D2B1F]">
                        <div className="font-semibold text-[#8B2E2E] text-[14px] min-h-[1.5em]" style={{ contentVisibility: 'auto' }}>{typedTextLines[0]}</div>
                        <div className="text-[#3D2B1F]/80 text-[12.5px] min-h-[1.5em]">{typedTextLines[1]}</div>
                        <div className="text-[#3D2B1F]/80 text-[12.5px] font-medium min-h-[1.5em]">{typedTextLines[2]}</div>
                      </div>
                    </motion.div>
                  )}
                  {showDetails && (
                    <motion.div 
                      key="details-block"
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ delay: 0.1, duration: 0.4, ease: "easeOut" }}
                      className="flex flex-col items-start text-left space-y-1.5 max-w-sm font-omni tracking-wide text-[#3D2B1F]"
                    >
                      <h2 className="text-xl font-semibold tracking-tight text-black font-omni mb-1">김은빈</h2>
                      <p className="text-black text-sm font-normal font-omni">2004</p>
                      <p className="text-black text-sm font-normal font-omni">한림대학교</p>
                      
                      <p className="text-[#3D2B1F]/90 text-sm font-normal font-omni pt-1">러시아어와 시각 디자인</p>
                      <p className="text-[10px] font-mono tracking-wider text-[#66605c] leading-none">
                        (RUSSIAN LANGUAGE & VISUAL DESIGN)
                      </p>
                      
                      <div className="pt-2 font-omni text-sm text-[#3D2B1F]/90">
                        <span className="font-normal mr-1.5 font-omni">이메일</span>
                        <a 
                          href="mailto:akeb110@naver.com" 
                          onClick={(e) => e.stopPropagation()}
                          className="hover:text-[#8B2E2E] underline transition-colors"
                        >
                          akeb110@naver.com
                        </a>
                      </div>
                       <div className="pt-1 font-omni text-sm text-[#3D2B1F]/90 flex items-center">
                        <span className="font-normal mr-1.5 font-omni">인스타그램</span>
                        <a 
                          href="https://www.instagram.com/eunbinkix?igsh=MTF6N2MwNmxjbGl2eQ%3D%3D&utm_source=qr" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="hover:text-[#8B2E2E] transition-colors inline-flex items-center"
                          title="eunbinkix Instagram"
                        >
                          <Instagram className="w-5 h-5 ml-1" />
                        </a>
                      </div>

                      <div className="pt-1.5 font-omni text-sm text-[#3D2B1F]/90 flex items-center">
                        <span className="font-normal mr-1.5 font-omni">VibeFinder</span>
                        <a 
                          href="https://music-tan-two.vercel.app/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="hover:text-[#8B2E2E] underline transition-colors inline-flex items-center gap-0.5"
                        >
                          바로가기
                          <ExternalLink className="w-3 h-3 ml-0.5 inline-block" />
                        </a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          )}

          {/* MAIN PORTFOLIO DETAILED CONTENT SECTION */}
          {portfolioView === "profile" && (
            <div 
              id="portfolio-content-section"
              className="w-full min-h-screen relative flex flex-col items-center justify-center p-6 bg-[#FAF6F2] cursor-pointer animate-[fadeIn_0.8s_ease-out]"
              onClick={() => {
                setIsTransitioning(true);
                setTimeout(() => {
                  setPortfolioView("cover");
                  setIsTransitioning(false);
                  window.scrollTo(0, 0);
                }, 400);
              }}
            >
              {/* Back button - small minimalist icon with no text, placed at top left */}
              <div className="absolute top-6 left-6" onClick={(e) => e.stopPropagation()}>
                <button
                  id="back-btn"
                  onClick={() => {
                    setIsTransitioning(true);
                    setTimeout(() => {
                      setPortfolioView("cover");
                      setIsTransitioning(false);
                      window.scrollTo(0, 0);
                    }, 400);
                  }}
                  className="group flex items-center justify-center p-2 rounded-sm bg-[#3D2B1F]/5 text-[#3D2B1F] hover:bg-[#8B2E2E] hover:text-white transition-all duration-300 cursor-pointer animate-[fadeIn_0.5s_ease-out]"
                  aria-label="Back"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:translate-x-[-2px] transition-transform" />
                </button>
              </div>

              {/* Absolutely blank page content, completely satisfying "아무것도 적지 말아줘" and "내용 다 없애줘" */}
            </div>
          )}

          {/* ARCHIVE GALLERY DETAILED VIEW SECTION */}
          {portfolioView === "gallery" && (
            <div 
              id="gallery-detailed-section"
              className="w-full min-h-screen bg-[#FAF6F2] font-sans pb-24 text-[#3D2B1F]"
            >
              {/* Elegant floating/sticky header */}
              <div className="sticky top-0 z-[40] bg-[#FAF6F2]/90 backdrop-blur-md border-b border-[#3D2B1F]/5 w-full py-4 px-6 md:px-12 flex items-center justify-between">
                <button
                  onClick={() => {
                    setIsTransitioning(true);
                    setTimeout(() => {
                      setPortfolioView("cover");
                      setIsTransitioning(false);
                      window.scrollTo(0, 0);
                    }, 400);
                  }}
                  className="group flex items-center gap-2 text-sm font-medium text-[#3D2B1F]/80 hover:text-[#8B2E2E] transition-all duration-300"
                >
                  <ArrowLeft className="w-5 h-5 group-hover:translate-x-[-2px] transition-transform" />
                </button>
                <div 
                  style={{ 
                    fontFamily: 'Arial, sans-serif', 
                    fontWeight: 'normal', 
                    fontStyle: 'normal', 
                    fontSize: '15px', 
                    lineHeight: '22px', 
                    color: '#a7856c' 
                  }}
                  className="tracking-widest"
                >
                  2026 Digital Design
                </div>
              </div>

              {/* Gallery Items container */}
              <div className="max-w-5xl mx-auto px-6 pt-12 space-y-24">
                {GALLERY_ITEMS.map((item, idx) => {
                  const isEven = idx % 2 === 0;
                  return (
                    <motion.div
                      key={item.id}
                      id={`gallery-item-${idx}`}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-10%" }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className={`flex flex-col ${
                        isEven ? "md:flex-row" : "md:flex-row-reverse"
                      } items-center gap-8 md:gap-16 py-10 border-b border-[#3D2B1F]/5 last:border-0`}
                    >
                      {/* Image Frame Container - stripped of background, frame, or shadow for raw minimalism */}
                      <div className="w-full md:w-[50%] flex items-center justify-center">
                        <div className="w-full h-auto overflow-hidden relative group">
                          <img 
                            src={item.src} 
                            alt={item.alt}
                            className="w-full h-auto max-h-[350px] md:max-h-[450px] object-contain mx-auto select-none transition-transform duration-500 group-hover:scale-[1.01]"
                          />
                        </div>
                      </div>

                      {/* Explanation Container */}
                      <div className="w-full md:w-[50%] flex flex-col justify-center text-left">
                        <h3 className="text-lg sm:text-lg font-medium tracking-tight text-[#3D2B1F] mb-3">
                          {item.title}
                        </h3>
                        
                        <p className="text-xs sm:text-sm leading-relaxed text-[#3D2B1F]/80 font-light whitespace-pre-line">
                          {item.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
      </div>
    )}

      {/* Tailwind specific custom transitions embedded in style block to prevent config mismatches */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Sequential calligraphic ribbon writing animation */
        @keyframes writeRibbon {
          to {
            stroke-dashoffset: 0;
          }
        }

        .ribbon-written-path {
          stroke-dasharray: 2400;
          stroke-dashoffset: 2400;
          animation: writeRibbon 1.3s cubic-bezier(0.25, 1, 0.5, 1) 0.2s forwards;
        }

        .perspective-1200 {
          perspective: 1200px;
        }
        .letter-slide {
          transform: translateY(0px);
          transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1) 0ms, box-shadow 0.4s ease;
        }
        .letter-slide.is-open {
          transform: translateY(-90px);
          transition: transform 0.45s cubic-bezier(0.25, 1, 0.5, 1) 180ms, box-shadow 0.4s ease;
        }
        .letter-slide.is-open.is-front {
          transform: translateY(10px);
          transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0ms, box-shadow 0.5s ease;
          box-shadow: 0 10px 24px rgba(61,43,31,0.08);
        }
        @media (min-width: 640px) {
          .letter-slide.is-open {
            transform: translateY(-180px);
          }
          .letter-slide.is-open.is-front {
            transform: translateY(20px);
            box-shadow: 0 15px 36px rgba(61,43,31,0.09);
          }
        }
      `}</style>
    </div>
  );
}
