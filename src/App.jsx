import React, { useState, useEffect, useRef } from "react";
import {
  Users,
  Play,
  Clock,
  Smile,
  Meh,
  Frown,
  CheckCircle2,
  ArrowRight,
  RefreshCcw,
  Hand,
  Volume2,
  Heart,
  Star,
  Sparkles,
} from "lucide-react";

// Game Data
const ROLES_POOL = [
  "พ่อ",
  "แม่",
  "ลูก",
  "ปู่",
  "ย่า",
  "ตา",
  "ยาย",
  "พี่",
  "น้อง",
  "ลุง",
  "ป้า",
  "น้า",
  "อา",
];

const CATEGORIES = [
  {
    id: "kids",
    label: "วัยเด็กตอนกลาง",
    color: "bg-[#BAE6FD]",
    text: "text-[#0369A1]",
    border: "border-[#7DD3FC]",
  },
  {
    id: "teens",
    label: "วัยรุ่น",
    color: "bg-[#FDE047]",
    text: "text-[#A16207]",
    border: "border-[#FDE047]",
  },
  {
    id: "adults",
    label: "วัยผู้ใหญ่",
    color: "bg-[#FECDD3]",
    text: "text-[#BE123C]",
    border: "border-[#FDA4AF]",
  },
  {
    id: "seniors",
    label: "วัยผู้สูงอายุ",
    color: "bg-[#D9F99D]",
    text: "text-[#4D7C0F]",
    border: "border-[#BEF264]",
  },
];

const SITUATIONS = {
  kids: [
    "โดนเพื่อนที่โรงเรียนล้อเลียนเรื่องรูปร่างหน้าตาจนไม่อยากไปโรงเรียน",
    "ทำของเล่นชิ้นโปรดของน้องพังโดยไม่ได้ตั้งใจ และกลัวโดนดุ",
    "พยายามตั้งใจอ่านหนังสือสอบแล้ว แต่คะแนนก็ยังออกมาไม่ดี",
    "เพื่อนสนิทแอบไปเล่นกับกลุ่มอื่นแล้วทิ้งเราไว้คนเดียว",
  ],
  teens: [
    "อยากเรียนต่อสายศิลปะ แต่ที่บ้านคาดหวังให้เรียนหมอหรือวิศวะ",
    "แอบชอบเพื่อนสนิทแต่ไม่กล้าบอก เพราะกลัวเสียเพื่อน",
    "รู้สึกว่าพ่อแม่เข้ามาจุ้นจ้านเรื่องส่วนตัวและเช็คโทรศัพท์บ่อยเกินไป",
    "มีปัญหากับเพื่อนในกลุ่มจนโดนแบนออกจากกลุ่มแชท",
  ],
  adults: [
    "ที่ทำงานลดจำนวนคน ทำให้ต้องทำงานหนักขึ้น 2 เท่าโดยไม่ได้เงินเพิ่ม",
    "หมุนเงินไม่ทันในเดือนนี้ และจำเป็นต้องขอยืมเงินคนในครอบครัว",
    "เหนื่อยจากการทำงานแล้วพอกลับมาบ้านก็เจอคนในบ้านทะเลาะกัน",
    "รู้สึกผิดที่ไม่มีเวลาดูแลลูกหรือพ่อแม่ที่แก่ชราได้อย่างเต็มที่",
  ],
  seniors: [
    "รู้สึกเหงาที่ลูกหลานต่างคนต่างยุ่ง ไม่ค่อยมีใครมาเยี่ยมหรือคุยด้วย",
    "ไปหาหมอแล้วพบว่าเป็นโรคที่ต้องกินยาตลอดชีวิต รู้สึกเป็นภาระ",
    "พยายามใช้สมาร์ทโฟนแต่ทำไม่เป็น พอถามลูกหลานก็โดนหงุดหงิดใส่",
    "รู้สึกว่าตัวเองไม่มีคุณค่าแล้วเพราะไม่ได้ทำงานหาเงินเหมือนเมื่อก่อน",
  ],
};

// Helper: Shuffle Array
const shuffleArray = (array) => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

export default function EmpathyFamilyGame() {
  // Game States: 'lobby' | 'setup_round' | 'pass_role' | 'reflection' | 'pass_emotion' | 'reveal_all' | 'randomizer' | 'speaker' | 'end_game'
  const [gameState, setGameState] = useState("lobby");

  // Lobby Settings
  const [playerCount, setPlayerCount] = useState(4);
  const [selectedCats, setSelectedCats] = useState(["kids", "teens", "adults"]);

  // Round Data
  const [currentRound, setCurrentRound] = useState(1);
  const [players, setPlayers] = useState([]); // { id, role, emotion, hasSpoken }
  const [currentSituation, setCurrentSituation] = useState("");

  // Pass & Play Tracking
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);

  // Timer & Interactions
  const [timeLeft, setTimeLeft] = useState(60);
  const [currentSpeakerId, setCurrentSpeakerId] = useState(null);

  // Touch & Hold Logic
  const [activeTouches, setActiveTouches] = useState([]);
  const [holdProgress, setHoldProgress] = useState(0);
  const activeTouchesRef = useRef([]);

  // Sync ref for interval
  useEffect(() => {
    activeTouchesRef.current = activeTouches;
  }, [activeTouches]);

  const startGame = () => {
    if (selectedCats.length === 0)
      return alert("กรุณาเลือกช่วงวัยอย่างน้อย 1 ช่วงวัย");
    setCurrentRound(1);
    setupRound();
  };

  const setupRound = () => {
    // 1. Pick a random situation from selected categories
    const pool = selectedCats.flatMap((catId) => SITUATIONS[catId]);
    const randomSituation = pool[Math.floor(Math.random() * pool.length)];
    setCurrentSituation(randomSituation);

    // 2. Assign random roles
    const shuffledRoles = shuffleArray(ROLES_POOL).slice(0, playerCount);
    const initialPlayers = shuffledRoles.map((role, idx) => ({
      id: `P${idx + 1}`,
      name: `ผู้เล่นที่ ${idx + 1}`,
      role: role,
      emotion: null, // 'red' | 'gray' | 'green'
      hasSpoken: false,
    }));

    setPlayers(initialPlayers);
    setCurrentPlayerIndex(0);
    setIsRevealed(false);
    setGameState("pass_role");
  };

  const handleNextPlayerRole = () => {
    if (currentPlayerIndex < players.length - 1) {
      setCurrentPlayerIndex((prev) => prev + 1);
      setIsRevealed(false);
    } else {
      // Finished passing roles, go to reflection
      setTimeLeft(60);
      setGameState("reflection");
    }
  };

  const startEmotionPhase = () => {
    setCurrentPlayerIndex(0);
    setIsRevealed(false);
    setGameState("pass_emotion");
  };

  const handleSelectEmotion = (emotion) => {
    const newPlayers = [...players];
    newPlayers[currentPlayerIndex].emotion = emotion;
    setPlayers(newPlayers);

    if (currentPlayerIndex < players.length - 1) {
      setCurrentPlayerIndex((prev) => prev + 1);
      setIsRevealed(false);
    } else {
      setGameState("reveal_all");
    }
  };

  const goToRandomizer = () => {
    setActiveTouches([]);
    setHoldProgress(0);
    setGameState("randomizer");
  };

  // The Touch & Hold effect runs when at least one finger is down
  useEffect(() => {
    const hasTouches = activeTouches.length > 0;

    if (hasTouches && gameState === "randomizer") {
      const startTime = Date.now();
      const duration = 2500; // 2.5 seconds hold time

      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const p = Math.min((elapsed / duration) * 100, 100);
        setHoldProgress(p);

        if (p >= 100) {
          clearInterval(interval);
          const currentT = activeTouchesRef.current;
          if (currentT.length > 0) {
            // Pick a winner randomly from those who are holding
            const winnerId =
              currentT[Math.floor(Math.random() * currentT.length)];
            setCurrentSpeakerId(winnerId);
            setGameState("speaker");
            setActiveTouches([]);
          }
        }
      }, 50);

      return () => clearInterval(interval);
    } else {
      setHoldProgress(0);
    }
  }, [activeTouches.length > 0, gameState]); // Only trigger on boolean toggle of touches

  const handleTouchStart = (e, id) => {
    e.preventDefault(); // Prevent scroll/zoom
    setActiveTouches((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const handleTouchEnd = (e, id) => {
    e.preventDefault();
    setActiveTouches((prev) => prev.filter((t) => t !== id));
  };

  const handleFinishedSpeaking = () => {
    const newPlayers = players.map((p) =>
      p.id === currentSpeakerId ? { ...p, hasSpoken: true } : p,
    );
    setPlayers(newPlayers);

    const allSpoken = newPlayers.every((p) => p.hasSpoken);
    if (allSpoken) {
      if (currentRound < 4) {
        setCurrentRound((prev) => prev + 1);
        setupRound();
      } else {
        setGameState("end_game");
      }
    } else {
      goToRandomizer();
    }
  };

  useEffect(() => {
    let timer;
    if (gameState === "reflection" && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [gameState, timeLeft]);

  const renderLobby = () => (
    <div className="flex flex-col h-full bg-[#FDF8F5] p-6 animate-in fade-in zoom-in duration-500">
      <div className="flex flex-col items-center justify-center pt-8 pb-10">
        <div className="bg-white p-4 rounded-3xl shadow-sm mb-4 border border-orange-50">
          <Heart className="w-12 h-12 text-rose-400 fill-rose-100" />
        </div>
        <h1 className="text-3xl font-black text-gray-800 text-center leading-tight">
          Empathy <br /> <span className="text-rose-400">Family Game</span>
        </h1>
        <p className="text-gray-500 text-sm mt-3 font-medium text-center px-4">
          เกมการ์ดครอบครัว เพื่อความเข้าใจอกเข้าใจกัน
        </p>
      </div>

      <div className="flex-1 bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgba(0,0,0,0.03)] p-6 flex flex-col gap-6">
        {/* Player Count */}
        <div>
          <label className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-500" /> จำนวนผู้เล่น
          </label>
          <div className="flex items-center justify-between bg-gray-50 rounded-2xl p-2">
            <button
              onClick={() => setPlayerCount(Math.max(2, playerCount - 1))}
              className="w-12 h-12 flex items-center justify-center bg-white rounded-xl shadow-sm text-xl font-bold text-gray-600 active:scale-95"
            >
              -
            </button>
            <span className="text-2xl font-black text-gray-800">
              {playerCount}
            </span>
            <button
              onClick={() => setPlayerCount(Math.min(8, playerCount + 1))}
              className="w-12 h-12 flex items-center justify-center bg-white rounded-xl shadow-sm text-xl font-bold text-gray-600 active:scale-95"
            >
              +
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="flex-1">
          <label className="text-sm font-bold text-gray-700 mb-3 block">
            ช่วงวัยของสถานการณ์ (เลือกได้หลายข้อ)
          </label>
          <div className="grid grid-cols-2 gap-3">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCats.includes(cat.id);
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCats((prev) =>
                      prev.includes(cat.id)
                        ? prev.filter((id) => id !== cat.id)
                        : [...prev, cat.id],
                    );
                  }}
                  className={`p-4 rounded-2xl border-2 transition-all text-left flex flex-col gap-2 relative overflow-hidden
                    ${isSelected ? `${cat.color} ${cat.border} ring-2 ring-offset-2 ring-white scale-[1.02]` : "bg-gray-50 border-transparent hover:bg-gray-100"}`}
                >
                  <span
                    className={`font-bold text-sm ${isSelected ? cat.text : "text-gray-500"}`}
                  >
                    {cat.label}
                  </span>
                  {isSelected && (
                    <CheckCircle2
                      className={`w-5 h-5 absolute bottom-3 right-3 ${cat.text} opacity-50`}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={startGame}
          className="w-full bg-emerald-500 hover:bg-emerald-400 text-white rounded-2xl py-4 text-lg font-black shadow-[0_4px_20px_rgba(16,185,129,0.3)] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2"
        >
          <Play className="fill-white w-5 h-5" /> เริ่มเกม
        </button>
      </div>
    </div>
  );

  const renderPassScreen = (
    title,
    onReveal,
    children,
    onNext,
    showNextButton,
  ) => {
    const p = players[currentPlayerIndex];
    return (
      <div className="flex flex-col h-full bg-[#FDF8F5] p-6 text-center animate-in fade-in">
        <div className="flex justify-between items-center mb-8">
          <span className="bg-orange-100 text-orange-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
            รอบที่ {currentRound}/4
          </span>
          <span className="text-gray-400 font-bold text-sm">
            คนโจทย์ที่ {currentPlayerIndex + 1}/{players.length}
          </span>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center w-full">
          {!isRevealed ? (
            <div className="w-full max-w-sm bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100 flex flex-col items-center animate-in slide-in-from-bottom-8">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                <Users className="w-10 h-10 text-blue-400" />
              </div>
              <h2 className="text-2xl font-black text-gray-800 mb-2">
                ส่งเครื่องให้
              </h2>
              <h3 className="text-3xl font-black text-blue-500 mb-8">
                {p.name}
              </h3>

              <button
                onClick={() => setIsRevealed(true)}
                className="w-full bg-blue-500 text-white rounded-2xl py-4 text-lg font-bold shadow-lg active:scale-95 transition-transform"
              >
                ฉันคือ {p.name} (กดเพื่อดู)
              </button>
            </div>
          ) : (
            <div className="w-full max-w-sm bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100 flex flex-col items-center animate-in zoom-in-95">
              <span className="text-gray-500 font-bold mb-2">{title}</span>
              {children}

              {showNextButton && (
                <button
                  onClick={onNext}
                  className="mt-8 w-full bg-gray-800 text-white rounded-2xl py-4 text-lg font-bold shadow-lg active:scale-95 transition-transform"
                >
                  ซ่อน และส่งให้คนต่อไป
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderReflection = () => (
    <div className="flex flex-col h-full bg-[#EFF6FF] p-6 animate-in fade-in">
      <div className="flex justify-center mb-6 pt-4">
        <div className="bg-white px-6 py-2 rounded-full shadow-sm flex items-center gap-2 border border-blue-100">
          <Clock className="w-5 h-5 text-blue-500" />
          <span className="text-blue-500 font-black text-xl">{timeLeft}s</span>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-[2rem] shadow-lg border border-blue-100 p-8 flex flex-col justify-center items-center text-center relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-2 bg-blue-500"></div>
        <span className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
          สถานการณ์ปัจจุบัน
        </span>
        <h2 className="text-2xl font-bold text-gray-800 leading-relaxed mb-8">
          "{currentSituation}"
        </h2>
        <p className="text-gray-400 font-medium text-sm">
          ให้เวลาตกตะกอนความคิด ว่าในบทบาทของคุณ <br />
          คุณจะรู้สึกและสื่อสารอย่างไร
        </p>
      </div>

      <button
        onClick={startEmotionPhase}
        className="mt-6 w-full bg-blue-500 text-white rounded-2xl py-4 text-lg font-bold shadow-[0_4px_20px_rgba(59,130,246,0.4)] active:scale-95 transition-transform"
      >
        ทุกคนพร้อมแล้ว (ข้ามเวลา)
      </button>
    </div>
  );

  const renderRevealAll = () => (
    <div className="flex flex-col h-full bg-[#FDF8F5] p-6 animate-in slide-in-from-right">
      <h2 className="text-2xl font-black text-gray-800 mb-6 mt-4 text-center">
        ความรู้สึกของทุกคน
      </h2>

      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-2 gap-4">
          {players.map((p) => (
            <div
              key={p.id}
              className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center gap-3"
            >
              <div className="text-sm font-bold text-gray-400">{p.name}</div>
              <div className="text-xl font-black text-gray-800">{p.role}</div>

              {p.emotion === "green" && (
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <Smile className="text-green-500 w-8 h-8" />
                </div>
              )}
              {p.emotion === "gray" && (
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <Meh className="text-gray-500 w-8 h-8" />
                </div>
              )}
              {p.emotion === "red" && (
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <Frown className="text-red-500 w-8 h-8" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={goToRandomizer}
        className="mt-6 w-full bg-emerald-500 text-white rounded-2xl py-4 text-lg font-bold shadow-[0_4px_20px_rgba(16,185,129,0.4)] active:scale-95 transition-transform"
      >
        เข้าสู่ช่วงเวลาสื่อสาร
      </button>
    </div>
  );

  const renderRandomizer = () => {
    const unSpokenPlayers = players.filter((p) => !p.hasSpoken);

    return (
      <div className="flex flex-col h-full bg-[#F8FAFC] p-6 relative overflow-hidden animate-in fade-in">
        {/* Progress Indicator Background */}
        <div
          className="absolute bottom-0 left-0 h-full bg-emerald-100 transition-all ease-linear"
          style={{
            width: `${holdProgress}%`,
            opacity: holdProgress > 0 ? 0.5 : 0,
          }}
        />

        <div className="relative z-10 flex flex-col h-full">
          <div className="text-center mt-6 mb-8">
            <h2 className="text-2xl font-black text-gray-800 mb-2">
              สุ่มผู้พูดคนต่อไป
            </h2>
            <p className="text-gray-500 font-medium bg-white py-2 px-4 rounded-full shadow-sm inline-block">
              ให้ผู้ที่ยังไม่ได้พูด{" "}
              <span className="text-emerald-500 font-bold">วางนิ้วค้างไว้</span>{" "}
              ที่การ์ดของตนเอง
            </p>
          </div>

          <div className="flex-1 grid grid-cols-2 gap-4 place-content-center">
            {unSpokenPlayers.map((p) => {
              const isActive = activeTouches.includes(p.id);
              return (
                <div
                  key={p.id}
                  className={`
                       relative bg-white rounded-3xl p-6 flex flex-col items-center justify-center shadow-md border-2 select-none touch-none transition-all duration-300
                       ${isActive ? "border-emerald-500 scale-95 shadow-inner bg-emerald-50" : "border-gray-100"}
                     `}
                  onMouseDown={(e) => handleTouchStart(e, p.id)}
                  onMouseUp={(e) => handleTouchEnd(e, p.id)}
                  onMouseLeave={(e) => handleTouchEnd(e, p.id)}
                  onTouchStart={(e) => handleTouchStart(e, p.id)}
                  onTouchEnd={(e) => handleTouchEnd(e, p.id)}
                  onTouchCancel={(e) => handleTouchEnd(e, p.id)}
                >
                  <Hand
                    className={`w-8 h-8 mb-3 ${isActive ? "text-emerald-500 animate-bounce" : "text-gray-300"}`}
                  />
                  <span className="font-black text-lg text-gray-800">
                    {p.role}
                  </span>
                  <span className="text-xs font-bold text-gray-400 mt-1">
                    {p.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderSpeaker = () => {
    const speaker = players.find((p) => p.id === currentSpeakerId);

    return (
      <div className="flex flex-col h-full bg-[#FEF2F2] p-6 animate-in zoom-in-95">
        <div className="flex justify-center mb-6 pt-4">
          <div className="bg-red-100 text-red-600 px-6 py-2 rounded-full font-bold text-sm flex items-center gap-2">
            <Volume2 className="w-5 h-5" /> ผู้พูดปัจจุบัน
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center">
          {/* Speaker Card */}
          <div className="bg-white w-full rounded-[2rem] shadow-xl border border-red-100 p-8 flex flex-col items-center text-center relative overflow-hidden mb-6">
            <div className="absolute top-0 inset-x-0 h-2 bg-red-400"></div>
            <div className="text-sm font-bold text-gray-400 mb-1">
              {speaker.name}
            </div>
            <div className="text-4xl font-black text-gray-800 mb-4">
              {speaker.role}
            </div>

            <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl mb-6">
              <span className="text-sm font-bold text-gray-500">อารมณ์:</span>
              {speaker.emotion === "green" && (
                <Smile className="text-green-500 w-6 h-6" />
              )}
              {speaker.emotion === "gray" && (
                <Meh className="text-gray-500 w-6 h-6" />
              )}
              {speaker.emotion === "red" && (
                <Frown className="text-red-500 w-6 h-6" />
              )}
            </div>

            <div className="bg-red-50 p-4 rounded-2xl w-full border border-red-100">
              <p className="text-sm font-bold text-red-800 leading-relaxed">
                "{currentSituation}"
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleFinishedSpeaking}
          className="w-full bg-red-500 hover:bg-red-600 text-white rounded-2xl py-4 text-lg font-bold shadow-[0_4px_20px_rgba(239,68,68,0.4)] active:scale-95 transition-transform"
        >
          พูดจบแล้ว
        </button>
      </div>
    );
  };

  const renderEndGame = () => (
    <div className="flex flex-col items-center justify-center h-full bg-[#FDF8F5] p-8 text-center animate-in slide-in-from-bottom">
      <div className="w-32 h-32 bg-amber-100 rounded-full flex items-center justify-center mb-8 relative">
        <Star className="w-16 h-16 text-amber-500 fill-amber-500" />
        <Sparkles className="w-8 h-8 text-amber-400 absolute top-0 right-0 animate-pulse" />
      </div>

      <h2 className="text-4xl font-black text-gray-800 mb-4">ยอดเยี่ยมมาก!</h2>
      <p className="text-gray-500 font-medium mb-12 text-lg">
        พวกคุณได้แลกเปลี่ยนมุมมอง
        <br />
        และทำความเข้าใจกันมากขึ้นแล้ว
      </p>

      <button
        onClick={() => {
          setGameState("lobby");
          setPlayerCount(4);
          setSelectedCats(["kids", "teens", "adults"]);
        }}
        className="w-full bg-amber-500 hover:bg-amber-400 text-white rounded-2xl py-4 text-lg font-bold shadow-[0_4px_20px_rgba(245,158,11,0.4)] active:scale-95 transition-transform flex justify-center items-center gap-2"
      >
        <RefreshCcw className="w-5 h-5" /> เล่นใหม่อีกครั้ง
      </button>
    </div>
  );

  return (
    <div className="min-h-[100dvh] w-full font-sans flex flex-col bg-white overflow-x-hidden">
      {/* Dynamic Screen Routing - Full Screen Edge-to-Edge */}
      <div className="flex-1 w-full relative flex flex-col overflow-hidden">
        {gameState === "lobby" && renderLobby()}

        {gameState === "pass_role" &&
          renderPassScreen(
            "บทบาทของคุณในรอบนี้คือ",
            () => setIsRevealed(true),
            <div className="text-5xl font-black text-blue-500 bg-blue-50 w-full py-8 rounded-3xl border border-blue-100">
              {players[currentPlayerIndex]?.role}
            </div>,
            handleNextPlayerRole,
            true,
          )}

        {gameState === "reflection" && renderReflection()}

        {gameState === "pass_emotion" &&
          renderPassScreen(
            `คุณ (${players[currentPlayerIndex]?.role}) รู้สึกอย่างไรกับสถานการณ์นี้?`,
            () => setIsRevealed(true),
            <div className="w-full grid gap-4 mt-2">
              <button
                onClick={() => handleSelectEmotion("green")}
                className="flex items-center gap-4 p-4 rounded-2xl border-2 border-green-100 bg-green-50 active:scale-95 transition-transform"
              >
                <Smile className="w-10 h-10 text-green-500" />
                <span className="font-bold text-green-700 text-lg">สบายใจ</span>
              </button>
              <button
                onClick={() => handleSelectEmotion("gray")}
                className="flex items-center gap-4 p-4 rounded-2xl border-2 border-gray-100 bg-gray-50 active:scale-95 transition-transform"
              >
                <Meh className="w-10 h-10 text-gray-500" />
                <span className="font-bold text-gray-700 text-lg">
                  เฉยๆ / ปกติ
                </span>
              </button>
              <button
                onClick={() => handleSelectEmotion("red")}
                className="flex items-center gap-4 p-4 rounded-2xl border-2 border-red-100 bg-red-50 active:scale-95 transition-transform"
              >
                <Frown className="w-10 h-10 text-red-500" />
                <span className="font-bold text-red-700 text-lg">
                  ไม่สบายใจ
                </span>
              </button>
            </div>,
            null,
            false,
          )}

        {gameState === "reveal_all" && renderRevealAll()}
        {gameState === "randomizer" && renderRandomizer()}
        {gameState === "speaker" && renderSpeaker()}
        {gameState === "end_game" && renderEndGame()}
      </div>
    </div>
  );
}
