import React, { useState, useEffect, useRef } from "react";
import {
  Users,
  Play,
  Clock,
  Smile,
  Meh,
  Frown,
  RefreshCcw,
  Hand,
  Volume2,
  Star,
  Sparkles,
  HeartHandshake,
  Download,
  AlertCircle,
} from "lucide-react";

// --- Role-Specific Problems Data ---
const ROLE_PROBLEMS = {
  พ่อ: [
    "ที่ทำงานลดจำนวนคน ทำให้ต้องทำงานหนักขึ้น 2 เท่าโดยไม่ได้เงินเพิ่ม",
    "หมุนเงินไม่ทันในเดือนนี้ และเครียดเรื่องภาระค่าใช้จ่ายในบ้าน",
    "เหนื่อยจากการทำงานแล้วพอกลับมาบ้านก็เจอคนในบ้านทะเลาะกัน",
    "รู้สึกกดดันที่เป็นเสาหลักและไม่มีใครรับฟังความอ่อนแอ",
  ],
  แม่: [
    "รู้สึกผิดที่ไม่มีเวลาดูแลลูกหรือคนในบ้านได้อย่างเต็มที่เพราะงานยุ่งมาก",
    "เหนื่อยล้ากับการจัดการงานบ้านและงานนอกบ้านที่ถมเข้ามาทุกวัน",
    "รู้สึกว่าความเหนื่อยของตัวเองถูกมองข้ามและไม่มีใครช่วยแบ่งเบา",
    "กังวลเรื่องอนาคตและการศึกษาของลูกจนนอนไม่หลับ",
  ],
  ลูก: [
    "โดนเพื่อนที่โรงเรียนล้อเลียนเรื่องรูปร่างหน้าตาจนไม่อยากไปโรงเรียน",
    "อยากเรียนต่อตามความฝัน แต่ที่บ้านคาดหวังให้เรียนสายอื่น",
    "พยายามตั้งใจอ่านหนังสือสอบแล้ว แต่คะแนนก็ยังออกมาไม่ดี",
    "เพื่อนสนิทแอบไปเล่นกับกลุ่มอื่นแล้วทิ้งเราไว้คนเดียว",
  ],
  ปู่: [
    "รู้สึกเหงาที่ลูกหลานต่างคนต่างยุ่ง ไม่ค่อยมีใครมาเยี่ยมหรือคุยด้วย",
    "ไปหาหมอแล้วพบว่าเป็นโรคที่ต้องกินยาตลอดชีวิต รู้สึกว่าเป็นภาระ",
    "รู้สึกว่าตัวเองหมดคุณค่าเพราะไม่ได้ทำงานหาเงินเหมือนเมื่อก่อน",
    "อยากช่วยแนะนำลูกหลานแต่กลัวกลายเป็นคนน่ารำคาญ",
  ],
  ย่า: [
    "รู้สึกเหงาและโดดเดี่ยวเวลาอยู่บ้านคนเดียวในตอนที่ทุกคนออกไปทำงาน",
    "สุขภาพร่างกายเริ่มถดถอยทำอะไรไม่ได้ดั่งใจเหมือนเก่า",
    "เป็นห่วงลูกหลานมากเกินไปจนเก็บมาคิด24ชั่วโมง",
    "รู้สึกว่าคำแนะนำของตัวเองเริ่มไม่มีใครรับฟังแล้ว",
  ],
  ตา: [
    "ร่างกายเจ็บป่วยออดๆ แอดๆ ตามสังขาร ทำให้ไม่อยากไปไหนมาไหน",
    "รู้สึกว่าโลกยุคใหม่เปลี่ยนไปเร็วมากจนตามไม่ทันและเข้ากับใครไม่ได้",
    "อยากเล่าเรื่องอดีตให้ฟังแต่ไม่มีใครมีเวลาว่างมานั่งฟัง",
    "หงุดหงิดง่ายกับเรื่องเล็กๆ น้อยๆ ในบ้านเพราะความเครียดสะสม",
  ],
  ยาย: [
    "กังวลเรื่องสุขภาพของคนในครอบครัวมากกว่าสุขภาพของตัวเอง",
    "เหนื่อยกับการต้องคอยจุกจิกดูแลทุกคนแต่ไม่มีใครเห็นความสำคัญ",
    "นอนไม่ค่อยหลับเพราะคิดมากเรื่องปัญหาต่างๆ ในบ้าน",
    "รู้สึกว่าบทบาทของตัวเองในบ้านเริ่มลดน้อยลง",
  ],
  พี่: [
    "รู้สึกว่าพ่อแม่คาดหวังและกดดันให้เป็นตัวอย่างที่ดีให้น้องเสมอ",
    "ต้องแบกรับปัญหาของตัวเองแถมยังต้องคอยแก้ปัญหาน้องอีก",
    "เหนื่อยกับการเรียนหรือการทำงานและไม่มีพื้นที่ส่วนตัว",
    "รู้สึกน้อยใจที่พ่อแม่มักจะให้น้องมากกว่า",
  ],
  น้อง: [
    "รู้สึกว่าตัวเองมักจะโดนมองว่าเป็นเด็กเล็กและไม่มีสิทธิ์ออกความเห็น",
    "โดนเปรียบเทียบกับพี่ตลอดเวลาจนสูญเสียความมั่นใจ",
    "มีปัญหาที่โรงเรียนแต่ไม่กล้าบอกใครเพราะกลัวโดนดุ",
    "รู้สึกอึดอัดที่ต้องทำตามกฎระเบียบเข้มงวดในบ้าน",
  ],
  ลุง: [
    "แบกรับภาระกิจการหรือธุรกิจครอบครัวจนเครียดลงกระเพาะ",
    "ปัญหาเศรษฐกิจทำให้การเงินฝืดเคืองจนไม่กล้าบอกใคร",
    "รู้สึกโดดเดี่ยวเวลาต้องตัดสินใจเรื่องใหญ่ๆ คนเดียว",
    "เหนื่อยล้าจากการรักษาน้ำใจคนในเครือญาติ",
  ],
  ป้า: [
    "ทุ่มเททุกอย่างให้ครอบครัวแต่กลับรู้สึกว่าไม่มีใครเห็นความเหนื่อย",
    "ปวดหัวกับเรื่องจุกจิกภายในบ้านที่แก้ไม่จบสิ้นสักที",
    "มีความลับเรื่องสุขภาพที่ไม่กล้าบอกคนอื่นเพราะไม่อยากให้เป็นห่วง",
    "รู้สึกเหนื่อยหน่ายกับบทบาทแม่บ้านที่ไม่มีวันหยุด",
  ],
  น้า: [
    "รู้สึกว่าเป็นคนนอกที่เข้ามาอยู่ในบ้านแล้วเกรงใจคนอื่น",
    "อยากช่วยออกความเห็นเรื่องในบ้านแต่กลัวโดนมองว่าก้าวก่าย",
    "มีปัญหาชีวิตส่วนตัวแต่ต้องทำเป็นเข้มแข็งต่อหน้าทุกคน",
    "ปรับตัวเข้ากับวิถีชีวิตของคนในบ้านหลังนี้ได้ยาก",
  ],
  อา: [
    "กำลังอยู่ในช่วงเปลี่ยนผ่านของชีวิตและยังหาจุดยืนของตัวเองไม่เจอ",
    "ถูกเปรียบเทียบความสำเร็จกับญาติคนอื่นๆ ในครอบครัว",
    "มีความกดดันเรื่องการสร้างครอบครัวหรือการเงินของตัวเอง",
    "รู้สึกว่าคนในบ้านไม่เข้าใจไลฟ์สไตล์ของตัวเอง",
  ],
};

const ROLES_POOL = Object.keys(ROLE_PROBLEMS);

const EMPATHY_SPECTRUM = [
  {
    id: "pity",
    label: "สงสาร",
    color: "bg-orange-100 text-orange-700 border-orange-200",
  },
  {
    id: "sympathy",
    label: "เห็นใจ",
    color: "bg-blue-100 text-blue-700 border-blue-200",
  },
  {
    id: "empathy",
    label: "เข้าใจ",
    color: "bg-purple-100 text-purple-700 border-purple-200",
  },
  {
    id: "compassion",
    label: "กรุณา",
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
];

const shuffleArray = (array) => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

export default function EmpathyFamilyGame() {
  const [gameState, setGameState] = useState("lobby");

  const [playerCount, setPlayerCount] = useState(4);
  const [currentRound, setCurrentRound] = useState(1);
  const TOTAL_ROUNDS = 2;

  const [players, setPlayers] = useState([]);
  const [roundOwnerIndices, setRoundOwnerIndices] = useState([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [currentSpeakerId, setCurrentSpeakerId] = useState(null);

  const [votingTargetIndex, setVotingTargetIndex] = useState(0);
  const [currentVotes, setCurrentVotes] = useState({});

  const [revealIndex, setRevealIndex] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  const [activeTouches, setActiveTouches] = useState([]);
  const [holdProgress, setHoldProgress] = useState(0);
  const activeTouchesRef = useRef([]);

  useEffect(() => {
    activeTouchesRef.current = activeTouches;
  }, [activeTouches]);

  const startGame = () => {
    setCurrentRound(1);

    const shuffledRoles = shuffleArray(ROLES_POOL).slice(0, playerCount);
    const initialPlayers = shuffledRoles.map((role, idx) => {
      const problemsPool = ROLE_PROBLEMS[role];
      const randomProb =
        problemsPool[Math.floor(Math.random() * problemsPool.length)];

      return {
        id: `P${idx + 1}`,
        name: `ผู้เล่นที่ ${idx + 1}`,
        role: role,
        problem: randomProb,
        emotion: null,
        hasSpoken: false,
        compassionScore: 0,
      };
    });

    const playerIndices = Array.from({ length: playerCount }, (_, i) => i);
    const shuffledIndices = shuffleArray(playerIndices);
    setRoundOwnerIndices(shuffledIndices);

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
      // ดูบทบาทครบแล้ว เข้าหน้าเสนอปัญหาพร้อมเริ่มนับถอยหลังทันที
      setTimeLeft(60);
      setGameState("problem_reflection");
    }
  };

  const getCurrentRoundOwner = () => {
    if (players.length === 0 || roundOwnerIndices.length === 0) return {};
    const ownerIdx = roundOwnerIndices[currentRound - 1] ?? 0;
    return players[ownerIdx] || {};
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
      goToRandomizer();
    }
  };

  const goToRandomizer = () => {
    setActiveTouches([]);
    setHoldProgress(0);
    setGameState("randomizer");
  };

  useEffect(() => {
    const hasTouches = activeTouches.length > 0;
    if (hasTouches && gameState === "randomizer") {
      const startTime = Date.now();
      const duration = 2500;
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const p = Math.min((elapsed / duration) * 100, 100);
        setHoldProgress(p);

        if (p >= 100) {
          clearInterval(interval);
          const currentT = activeTouchesRef.current;
          if (currentT.length > 0) {
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
  }, [activeTouches.length > 0, gameState]);

  const handleTouchStart = (e, id) => {
    e.preventDefault();
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
      setGameState("spectrum_guide");
    } else {
      goToRandomizer();
    }
  };

  // นับเวลาถอยหลัง 60 วิ สำหรับหน้าเสนอปัญหา + Reflection
  useEffect(() => {
    let timer;
    if (gameState === "problem_reflection" && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [gameState, timeLeft]);

  const startVotingPhase = () => {
    setVotingTargetIndex(0);
    setCurrentVotes({});
    setGameState("spectrum_vote");
  };

  const handleVote = (voterId, spectrumId) => {
    setCurrentVotes((prev) => ({ ...prev, [voterId]: spectrumId }));
  };

  const submitVotesForTarget = () => {
    const targetPlayer = players[votingTargetIndex];
    let compassionGained = 0;

    Object.values(currentVotes).forEach((vote) => {
      if (vote === "compassion") compassionGained++;
    });

    const newPlayers = players.map((p) =>
      p.id === targetPlayer.id
        ? { ...p, compassionScore: p.compassionScore + compassionGained }
        : p,
    );
    setPlayers(newPlayers);

    if (votingTargetIndex < players.length - 1) {
      setVotingTargetIndex((prev) => prev + 1);
      setCurrentVotes({});
    } else {
      if (currentRound < TOTAL_ROUNDS) {
        setCurrentRound((prev) => prev + 1);
        setPlayers(
          newPlayers.map((p) => ({ ...p, emotion: null, hasSpoken: false })),
        );
        setCurrentPlayerIndex(0);
        setTimeLeft(60);
        setGameState("problem_reflection"); // เข้าสู่รอบที่ 2 จับเวลาพร้อมปัญหาทันที
      } else {
        setRevealIndex(0);
        setIsCardFlipped(false);
        setGameState("end_game");
      }
    }
  };

  const handleDownloadCard = (e) => {
    e.stopPropagation();
    alert(
      "ระบบเตรียมการ์ดของคุณพร้อมแล้ว! \nกรุณา 'แคปหน้าจอ' (Screenshot) เพื่อบันทึกผลลัพธ์นี้เก็บไว้ในเครื่องของคุณได้เลยครับ 🌸",
    );
  };
  useEffect(() => {
    document.title = "Bloom Together";
  }, []);

  const renderLobby = () => (
    <div className="flex flex-col h-full bg-[#FDF8F5] p-6">
      <div className="flex flex-col items-center justify-center pt-6 pb-6">
        <div className="bg-white p-2 rounded-3xl shadow-sm mb-3 border border-orange-50 flex items-center justify-center">
          <img
            src="/Logo.png"
            alt="Logo"
            className="w-12 h-12 object-contain"
          />
        </div>
        <h1 className="text-2xl font-black text-gray-800 text-center leading-tight">
          Bloom <br /> <span className="text-rose-400">Together</span>
        </h1>
        <p className="text-gray-500 text-xs mt-2 font-medium text-center px-4">
          “Let’s grow our Bloom together”
        </p>
      </div>

      <div className="flex-1 bg-white rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.03)] p-5 flex flex-col gap-6 justify-center">
        <div>
          <label className="text-xs font-bold text-gray-700 mb-2 flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-500" /> จำนวนผู้เล่น
          </label>
          <div className="flex items-center justify-between bg-gray-50 rounded-2xl p-2">
            <button
              onClick={() => setPlayerCount(Math.max(2, playerCount - 1))}
              className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm text-lg font-bold text-gray-600"
            >
              -
            </button>
            <span className="text-xl font-black text-gray-800">
              {playerCount}
            </span>
            <button
              onClick={() => setPlayerCount(Math.min(8, playerCount + 1))}
              className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm text-lg font-bold text-gray-600"
            >
              +
            </button>
          </div>
        </div>

        <button
          onClick={startGame}
          className="w-full bg-emerald-500 hover:bg-emerald-400 text-white rounded-2xl py-4 text-base font-black flex items-center justify-center gap-2 shadow-md active:scale-95 transition-transform"
        >
          <Play className="fill-white w-4 h-4" /> เริ่มเกมสุ่มบทบาท
        </button>
      </div>
    </div>
  );

  const renderPassScreenRole = () => {
    const p = players[currentPlayerIndex] || {};
    return (
      <div className="flex flex-col h-full bg-[#FDF8F5] p-5 text-center">
        <div className="flex justify-between items-center mb-4">
          <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest">
            ช่วงเริ่มต้นเกม
          </span>
          <span className="text-gray-400 font-bold text-xs">
            คนที่ {currentPlayerIndex + 1}/{players.length}
          </span>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center w-full">
          {!isRevealed ? (
            <div className="w-full bg-white p-6 rounded-[2rem] shadow-xl border border-gray-100 flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-blue-400" />
              </div>
              <h2 className="text-xl font-black text-gray-800 mb-1">
                ส่งเครื่องให้
              </h2>
              <h3 className="text-2xl font-black text-blue-500 mb-6">
                {p.name}
              </h3>
              <button
                onClick={() => setIsRevealed(true)}
                className="w-full bg-blue-500 text-white rounded-2xl py-3.5 text-base font-bold shadow-md active:scale-95 transition-transform"
              >
                ฉันคือ {p.name} (กดเพื่อดูบทบาท)
              </button>
            </div>
          ) : (
            <div className="w-full bg-white p-6 rounded-[2rem] shadow-xl border border-gray-100 flex flex-col items-center">
              <span className="text-gray-500 font-bold text-sm mb-4">
                บทบาทและปัญหาลึกๆ ในใจของคุณ
              </span>
              <div className="w-full bg-blue-50 p-5 rounded-3xl border border-blue-100 text-center">
                <div className="text-3xl font-black text-blue-600 mb-2">
                  {p.role}
                </div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                  ปัญหาประจำตัวของคุณ
                </div>
                <p className="text-sm font-bold text-gray-700 leading-relaxed">
                  "{p.problem}"
                </p>
              </div>
              <p className="text-xs text-rose-500 font-bold mt-4">
                จำปัญหาของคุณไว้ให้ดี เพราะอาจถูกสุ่มมาเป็นโจทย์!
              </p>
              <button
                onClick={handleNextPlayerRole}
                className="mt-6 w-full bg-gray-800 text-white rounded-2xl py-3.5 text-base font-bold shadow-md active:scale-95 transition-transform"
              >
                {currentPlayerIndex < players.length - 1
                  ? "ซ่อน และส่งให้คนต่อไป"
                  : "เริ่มรอบที่ 1 ทันที"}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // หน้าจอ: เสนอปัญหา + จับเวลา 60 วินาทีพร้อมกัน
  const renderProblemReflection = () => {
    const owner = getCurrentRoundOwner();
    const isTimeOut = timeLeft === 0;

    return (
      <div className="flex flex-col h-full bg-[#FFF7ED] p-5">
        <div className="flex justify-between items-center mb-3">
          <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest">
            รอบที่ {currentRound}/{TOTAL_ROUNDS}
          </span>
          <div
            className={`px-4 py-1.5 rounded-full shadow-sm flex items-center gap-2 border transition-all ${
              isTimeOut
                ? "bg-red-500 text-white border-red-600 animate-pulse"
                : "bg-white text-orange-600 border-orange-200"
            }`}
          >
            <Clock className="w-4 h-4" />
            <span className="font-black text-lg">{timeLeft}s</span>
          </div>
        </div>

        <div className="flex-1 bg-white rounded-[2rem] shadow-lg border border-orange-100 p-6 flex flex-col justify-between items-center text-center">
          <div className="w-full flex flex-col items-center">
            <div className="inline-flex items-center gap-1.5 bg-orange-50 border border-orange-200 text-orange-700 px-3.5 py-1 rounded-full text-xs font-bold mb-3">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>
                โจทย์ปัญหาจาก: {owner.role} ({owner.name})
              </span>
            </div>

            <h3 className="text-xl font-black text-gray-800 mb-2">
              "{owner.role}" กำลังเผชิญกับปัญหานี้:
            </h3>

            <div className="bg-[#FFFDF9] border-2 border-orange-100 p-5 rounded-2xl w-full my-2 shadow-inner">
              <p className="text-base font-bold text-gray-800 leading-relaxed">
                "{owner.problem}"
              </p>
            </div>
          </div>

          <div className="bg-orange-50/70 p-3.5 rounded-2xl w-full border border-orange-100/60">
            <p className="text-gray-500 text-xs font-medium leading-relaxed">
              🕒 ให้เวลาทุกคน 60 วินาที
              <br />
              ลองสวมบทบาทตัวเอง แล้วตกตะกอนว่ารู้สึกอย่างไรและจะพูดกับ{" "}
              <span className="font-bold text-orange-700">
                {owner.role}
              </span>{" "}
              อย่างไร
            </p>
          </div>
        </div>

        <button
          onClick={startEmotionPhase}
          className={`mt-4 w-full rounded-2xl py-3.5 text-base font-bold shadow-md active:scale-95 transition-all ${
            isTimeOut
              ? "bg-rose-500 hover:bg-rose-600 text-white animate-bounce"
              : "bg-orange-500 hover:bg-orange-600 text-white"
          }`}
        >
          {isTimeOut
            ? "หมดเวลาแล้ว! ไปเลือกอารมณ์"
            : "ทุกคนพร้อมแล้ว (ไปเลือกอารมณ์)"}
        </button>
      </div>
    );
  };

  const renderPassScreenEmotion = () => {
    const p = players[currentPlayerIndex] || {};
    const owner = getCurrentRoundOwner();

    return (
      <div className="flex flex-col h-full bg-[#FDF8F5] p-5 text-center">
        <div className="flex justify-between items-center mb-4">
          <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest">
            รอบที่ {currentRound}/{TOTAL_ROUNDS}
          </span>
          <span className="text-gray-400 font-bold text-xs">
            คนที่ {currentPlayerIndex + 1}/{players.length}
          </span>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center w-full">
          {!isRevealed ? (
            <div className="w-full bg-white p-6 rounded-[2rem] shadow-xl border border-gray-100 flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-blue-400" />
              </div>
              <h2 className="text-xl font-black text-gray-800 mb-1">
                ส่งเครื่องให้
              </h2>
              <h3 className="text-2xl font-black text-blue-500 mb-6">
                {p.name}
              </h3>
              <button
                onClick={() => setIsRevealed(true)}
                className="w-full bg-blue-500 text-white rounded-2xl py-3.5 text-base font-bold shadow-md active:scale-95 transition-transform"
              >
                ฉันคือ {p.name} (กดเพื่อเลือกอารมณ์)
              </button>
            </div>
          ) : (
            <div className="w-full bg-white p-6 rounded-[2rem] shadow-xl border border-gray-100 flex flex-col items-center animate-in zoom-in-95">
              <span className="text-gray-500 font-bold text-sm mb-4">
                คุณ ({p.role}) รู้สึกอย่างไรกับปัญหาของ {owner.role}?
              </span>
              <div className="w-full grid gap-3 mt-1">
                <button
                  onClick={() => handleSelectEmotion("green")}
                  className="flex items-center gap-3 p-3.5 rounded-2xl border-2 border-green-100 bg-green-50 active:scale-95 transition-transform"
                >
                  <Smile className="w-8 h-8 text-green-500" />
                  <span className="font-bold text-green-700 text-base">
                    สบายใจ / ให้กำลังใจ
                  </span>
                </button>
                <button
                  onClick={() => handleSelectEmotion("gray")}
                  className="flex items-center gap-3 p-3.5 rounded-2xl border-2 border-gray-100 bg-gray-50 active:scale-95 transition-transform"
                >
                  <Meh className="w-8 h-8 text-gray-500" />
                  <span className="font-bold text-gray-700 text-base">
                    เฉยๆ / รับฟังปกติ
                  </span>
                </button>
                <button
                  onClick={() => handleSelectEmotion("red")}
                  className="flex items-center gap-3 p-3.5 rounded-2xl border-2 border-red-100 bg-red-50 active:scale-95 transition-transform"
                >
                  <Frown className="w-8 h-8 text-red-500" />
                  <span className="font-bold text-red-700 text-base">
                    ไม่สบายใจ / เครียดตาม
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderRandomizer = () => {
    const unSpokenPlayers = players.filter((p) => !p.hasSpoken);
    return (
      <div className="flex flex-col h-full bg-[#F8FAFC] p-5 relative overflow-hidden">
        <div
          className="absolute bottom-0 left-0 h-full bg-emerald-100 transition-all ease-linear"
          style={{
            width: `${holdProgress}%`,
            opacity: holdProgress > 0 ? 0.5 : 0,
          }}
        />
        <div className="relative z-10 flex flex-col h-full">
          <div className="text-center mt-2 mb-6">
            <h2 className="text-xl font-black text-gray-800 mb-1">
              สุ่มผู้พูดคนต่อไป
            </h2>
            <p className="text-gray-500 text-xs font-medium bg-white py-1.5 px-3 rounded-full shadow-sm inline-block">
              ให้ผู้ที่ยังไม่ได้พูด{" "}
              <span className="text-emerald-500 font-bold">วางนิ้วค้างไว้</span>
            </p>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-3 place-content-center">
            {unSpokenPlayers.map((p) => {
              const isActive = activeTouches.includes(p.id);
              return (
                <div
                  key={p.id}
                  className={`relative bg-white rounded-2xl p-4 flex flex-col items-center justify-center shadow-md border-2 select-none touch-none transition-all duration-300 ${
                    isActive
                      ? "border-emerald-500 scale-95 bg-emerald-50"
                      : "border-gray-100"
                  }`}
                  onMouseDown={(e) => handleTouchStart(e, p.id)}
                  onMouseUp={(e) => handleTouchEnd(e, p.id)}
                  onMouseLeave={(e) => handleTouchEnd(e, p.id)}
                  onTouchStart={(e) => handleTouchStart(e, p.id)}
                  onTouchEnd={(e) => handleTouchEnd(e, p.id)}
                  onTouchCancel={(e) => handleTouchEnd(e, p.id)}
                >
                  <span className="font-black text-xl text-gray-800">
                    {p.role}
                  </span>
                  <span className="text-[10px] font-bold text-gray-400 mt-0.5">
                    {p.name}
                  </span>
                  <div className="mt-2">
                    {p.emotion === "green" && (
                      <Smile className="text-green-500 w-6 h-6" />
                    )}
                    {p.emotion === "gray" && (
                      <Meh className="text-gray-500 w-6 h-6" />
                    )}
                    {p.emotion === "red" && (
                      <Frown className="text-red-500 w-6 h-6" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderSpeaker = () => {
    const speaker = players.find((p) => p.id === currentSpeakerId) || {};
    const owner = getCurrentRoundOwner();

    return (
      <div className="flex flex-col h-full bg-[#FEF2F2] p-5">
        <div className="flex justify-center mb-4 pt-2">
          <div className="bg-red-100 text-red-600 px-4 py-1.5 rounded-full font-bold text-xs flex items-center gap-1.5">
            <Volume2 className="w-4 h-4" /> ผู้พูดปัจจุบัน
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="bg-white w-full rounded-[2rem] shadow-xl border border-red-100 p-6 flex flex-col items-center text-center">
            <div className="text-xs font-bold text-gray-400 mb-0.5">
              {speaker.name}
            </div>
            <div className="text-3xl font-black text-gray-800 mb-2">
              {speaker.role}
            </div>
            <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-xl mb-4">
              <span className="text-xs font-bold text-gray-500">อารมณ์:</span>
              {speaker.emotion === "green" && (
                <Smile className="text-green-500 w-5 h-5" />
              )}
              {speaker.emotion === "gray" && (
                <Meh className="text-gray-500 w-5 h-5" />
              )}
              {speaker.emotion === "red" && (
                <Frown className="text-red-500 w-5 h-5" />
              )}
            </div>
            <div className="bg-red-50 p-4 rounded-2xl w-full border border-red-100">
              <span className="text-[10px] font-bold text-red-400 uppercase block mb-1">
                หัวข้อสนทนา: ปัญหาของ {owner.role}
              </span>
              <p className="text-xs font-bold text-red-800 leading-relaxed">
                "{owner.problem}"
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={handleFinishedSpeaking}
          className="w-full bg-red-500 text-white rounded-2xl py-3.5 text-base font-bold shadow-md active:scale-95 transition-transform"
        >
          พูดจบแล้ว
        </button>
      </div>
    );
  };

  const renderSpectrumGuide = () => (
    <div className="flex flex-col h-full bg-[#FDF8F5] p-5 overflow-y-auto">
      <div className="text-center mt-2 mb-4">
        <h2 className="text-xl font-black text-gray-800">
          ทำความรู้จัก 4 ระดับ
        </h2>
        <p className="text-gray-500 text-xs mt-0.5 font-medium">
          ก่อนเริ่มประเมินการสื่อสารของแต่ละคนในรอบนี้
        </p>
      </div>
      <div className="flex flex-col gap-3 flex-1">
        <div className="bg-white p-3.5 rounded-2xl border-l-4 border-orange-400 shadow-sm">
          <h3 className="font-bold text-orange-700 text-sm">Pity (สงสาร)</h3>
          <p className="text-xs text-gray-600 mt-0.5">
            มองจากที่สูงกว่า รู้สึกสงสารแต่ไม่ได้อยากเข้าไปช่วยคลี่คลาย
            หรือใช้คำพูดบั่นทอนโดยไม่รู้ตัว
          </p>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border-l-4 border-blue-400 shadow-sm">
          <h3 className="font-bold text-blue-700 text-sm">Sympathy (เห็นใจ)</h3>
          <p className="text-xs text-gray-600 mt-0.5">
            รับรู้ความรู้สึกของอีกฝ่าย
            พยายามปลอบใจแต่อาจจะรีบให้คำแนะนำหรือตัดสินปัญหาเร็วเกินไป
          </p>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border-l-4 border-purple-400 shadow-sm">
          <h3 className="font-bold text-purple-700 text-sm">
            Empathy (เข้าใจ)
          </h3>
          <p className="text-xs text-gray-600 mt-0.5">
            เอาใจเขามาใส่ใจเรา รับฟังอย่างลึกซึ้งโดยไม่ตัดสิน
            และสะท้อนความรู้สึกของอีกฝ่ายได้ตรงจุด
          </p>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border-l-4 border-emerald-400 shadow-sm">
          <h3 className="font-bold text-emerald-700 text-sm">
            Compassion (กรุณา)
          </h3>
          <p className="text-xs text-gray-600 mt-0.5">
            เข้าใจความรู้สึกอย่างถ่องแท้
            และพร้อมที่จะร่วมมือหาทางออกหรือซัพพอร์ตด้วยความเต็มใจ
          </p>
        </div>
      </div>
      <button
        onClick={startVotingPhase}
        className="mt-4 w-full bg-indigo-500 text-white rounded-2xl py-3.5 text-base font-bold shadow-md active:scale-95 transition-transform"
      >
        เริ่มโหวตให้เพื่อนๆ
      </button>
    </div>
  );

  const renderSpectrumVote = () => {
    const targetPlayer = players[votingTargetIndex] || {};
    const voters = players.filter((p) => p.id !== targetPlayer.id);
    const allVoted = voters.every((v) => currentVotes[v.id]);

    return (
      <div className="flex flex-col h-full bg-[#F8FAFC] p-4 overflow-y-auto">
        <div className="bg-indigo-50 p-3.5 rounded-2xl mb-3 border border-indigo-100 text-center">
          <p className="text-indigo-600 text-xs font-bold mb-0.5">
            โหวตการสื่อสารของ
          </p>
          <h2 className="text-2xl font-black text-indigo-900">
            {targetPlayer.role}{" "}
            <span className="text-base text-indigo-500">
              ({targetPlayer.name})
            </span>
          </h2>
        </div>

        <div className="flex-1 flex flex-col gap-3">
          {voters.map((voter) => (
            <div
              key={voter.id}
              className="bg-white p-3.5 rounded-2xl shadow-sm border border-gray-100"
            >
              <div className="text-xs font-bold text-gray-500 mb-2">
                {voter.role} ({voter.name}) คิดว่าเป็นแบบไหน?
              </div>
              <div className="grid grid-cols-2 gap-2">
                {EMPATHY_SPECTRUM.map((spec) => {
                  const isSelected = currentVotes[voter.id] === spec.id;
                  return (
                    <button
                      key={spec.id}
                      onClick={() => handleVote(voter.id, spec.id)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        isSelected
                          ? `${spec.color} ring-2 ring-offset-1 ring-${spec.color.split("-")[1]}-400`
                          : "bg-gray-50 text-gray-400 border-gray-200"
                      }`}
                    >
                      {spec.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={submitVotesForTarget}
          disabled={!allVoted}
          className={`mt-3 w-full rounded-2xl py-3.5 text-base font-bold transition-all shadow-md ${
            allVoted
              ? "bg-indigo-500 text-white active:scale-95"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          {votingTargetIndex < players.length - 1
            ? "ยืนยัน และโหวตคนต่อไป"
            : currentRound < TOTAL_ROUNDS
              ? "จบรอบที่ 1 (ไปรอบที่ 2)"
              : "ดูผลลัพธ์จบเกม"}
        </button>
      </div>
    );
  };

  const getLotusResult = (score) => {
    // 7 - 8 ครั้งขึ้นไป
    if (score >= 7) {
      return {
        title: "ฝักบัวแสนอร่อยพร้อมแบ่งปัน",
        filename: "lotus-shower.jpg",
        condition: "ตอบตรงกับ Compassionate Communication 7-8 ครั้ง",
        desc: "ศูนย์รวมความสงบที่มั่นคง รับฟังลึกซึ้งไร้การตัดสิน ทุกคำพูดคือสะพานเชื่อมใจที่เปลี่ยนแรงตึงเครียดให้เป็นพลังสุข เปรียบดั่งพื้นที่ปลอดภัยที่พร้อมโอบอุ้มให้ทุกคนเปล่งประกายไปด้วยกัน",
      };
    }
    // 4 - 6 ครั้ง
    if (score >= 4) {
      return {
        title: "ดอกบัวบานสะพรั่งส่งกลิ่นหอม",
        filename: "lotus-bloom.jpg",
        condition: "ตอบตรงกับ Compassionate Communication 4-6 ครั้ง",
        desc: "งดงามด้วยการผสานสติและความเมตตา สื่อสารตรงไปตรงมาทว่าอ่อนโยนต่อหัวใจ รับฟังทุกความต่างอย่างเข้าใจและเปลี่ยนบทสนทนาให้ลื่นไหล สร้างบรรยากาศแห่งความไว้วางใจให้ทีมก้าวไปข้างหน้า",
      };
    }
    // 1 - 3 ครั้ง
    if (score >= 1) {
      return {
        title: "ดอกบัวตูมล่องลอยบนน้ำ",
        filename: "lotus-bud.jpg",
        condition: "ตอบตรงกับ Compassionate Communication 1-3 ครั้ง",
        desc: "หัวใจเปี่ยมเจตนาดีที่พร้อมแคร์คนรอบข้าง สติเริ่มตื่นรู้เท่าทันอารมณ์และบรรยากาศ กล้าเปิดใจปรับเปลี่ยนคำพูดอย่างนุ่มนวล ทุกการหยุดฟังคือการค่อยๆ ผลิบานสู่อีกขั้นของความมั่นคงทางใจ",
      };
    }
    // 0 ครั้ง
    return {
      title: "ต้นอ่อนพร้อมเติบโต",
      filename: "lotus-sprout.jpg",
      condition: "ตอบตรงกับ Compassionate Communication 0 ครั้ง",
      desc: "เปี่ยมพลังชีวิต ความจริงใจ และความมุ่งมั่นผลักดันทีม เมล็ดพันธุ์แห่งสติได้ถูกหยั่งรากลงแล้ว เพียงเติมการหยุดหายใจและใส่ใจรับฟัง คุณพร้อมเติบโตเป็นร่มเงาที่แข็งแรงและงดงาม",
    };
  };

  const renderEndGameReveal = () => {
    if (revealIndex >= players.length) {
      return (
        <div className="flex flex-col items-center justify-center h-full bg-[#FDF8F5] p-6 text-center">
          <div className="w-28 h-28 bg-amber-100 rounded-full flex items-center justify-center mb-6 relative shadow-sm">
            <Star className="w-14 h-14 text-amber-500 fill-amber-500" />
            <Sparkles className="w-7 h-7 text-amber-400 absolute top-0 right-0 animate-pulse" />
          </div>
          <h2 className="text-3xl font-black text-gray-800 mb-3">
            ยอดเยี่ยมมาก!
          </h2>
          <p className="text-gray-500 font-medium mb-8 text-base">
            พวกคุณได้ร่วมกันรับฟัง
            <br />
            และโอบกอดปัญหาของกันและกันแล้ว
          </p>
          <button
            onClick={() => {
              setGameState("lobby");
              setPlayerCount(4);
            }}
            className="w-full bg-amber-500 text-white rounded-2xl py-3.5 text-base font-bold flex justify-center items-center gap-2 shadow-md active:scale-95 transition-transform"
          >
            <RefreshCcw className="w-4 h-4" /> เล่นใหม่อีกครั้ง
          </button>
        </div>
      );
    }

    const currentPlayer = players[revealIndex] || {};
    const result = getLotusResult(currentPlayer.compassionScore || 0);

    return (
      <div className="flex-1 w-full bg-[#F8FAFC] p-4 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="w-full max-w-sm h-[80vh] [perspective:1000px] my-auto">
          <div
            className={`relative w-full h-full transition-all duration-700 [transform-style:preserve-3d] cursor-pointer shadow-xl rounded-3xl ${
              isCardFlipped ? "[transform:rotateY(180deg)]" : ""
            }`}
            onClick={() => !isCardFlipped && setIsCardFlipped(true)}
          >
            <div className="absolute inset-0 [backface-visibility:hidden] bg-gradient-to-br from-indigo-500 to-purple-500 rounded-3xl flex flex-col items-center justify-center p-6 text-white shadow-lg">
              <h2 className="text-lg font-bold opacity-80 mb-1">ผลลัพธ์ของ</h2>
              <h3 className="text-3xl font-black mb-1">{currentPlayer.role}</h3>
              <p className="text-base opacity-90 mb-10">
                ({currentPlayer.name})
              </p>
              <div className="animate-bounce">
                <Hand className="w-10 h-10 opacity-80" />
              </div>
              <p className="mt-3 font-medium opacity-80 text-xs">
                แตะเพื่อเปิดการ์ด
              </p>
            </div>

            <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] bg-[#FDF8F5] rounded-3xl p-4 flex flex-col justify-between border-4 border-white shadow-xl">
              <div className="text-center w-full shrink-0">
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                  ผลลัพธ์ของ {currentPlayer.name} ({currentPlayer.role})
                </p>
              </div>

              <div className="w-full flex-1  bg-white rounded-2xl my-2 flex items-center justify-center overflow-hidden shadow-inner border border-gray-100 relative">
                <img
                  src={`/${result.filename}`}
                  alt="Lotus Result"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>
              {/* Text Under Image (Blended Seamlessly) */}
              <div className="text-center px-2 shrink-0 mb-2">
                <h4 className="text-base font-black text-rose-500 leading-tight mb-1">
                  {result.title}
                </h4>
                <div className="max-h-24 overflow-y-auto px-1 text-center scrollbar-none">
                  <p className="text-[11px] text-gray-600 font-medium leading-relaxed">
                    {result.desc}
                  </p>
                </div>
              </div>

              <div className="shrink-0 pt-1">
                <button
                  onClick={handleDownloadCard}
                  className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-600 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-indigo-200 shadow-sm"
                >
                  <Download className="w-4 h-4" /> บันทึกการ์ดใบนี้
                </button>
              </div>
            </div>
          </div>
        </div>

        {isCardFlipped && (
          <div className="w-full max-w-sm mt-3 pb-2 shrink-0">
            <button
              onClick={() => {
                setIsCardFlipped(false);
                setTimeout(() => setRevealIndex((prev) => prev + 1), 200);
              }}
              className="w-full bg-gray-800 hover:bg-gray-900 text-white rounded-2xl py-3.5 text-base font-bold shadow-lg active:scale-95 transition-transform"
            >
              {revealIndex < players.length - 1 ? "ดูผลลัพธ์คนต่อไป" : "จบเกม"}
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-[100dvh] w-full bg-slate-100 flex items-center justify-center font-sans">
      <div className="w-full min-h-[100dvh] bg-white relative flex flex-col">
        <div className="w-full py-3 bg-[#FFF5F5] border-b border-rose-100 flex items-center justify-center sticky top-0 z-50 shadow-sm shrink-0">
          <span className="font-serif italic text-rose-500 font-bold text-lg tracking-wider">
            Bloom Together
          </span>
        </div>

        <div
          key={`${gameState}-${currentRound}`}
          className="flex-1 w-full relative flex flex-col animate-in fade-in zoom-in-[0.98] duration-500 ease-out overflow-hidden"
        >
          {gameState === "lobby" && renderLobby()}
          {gameState === "pass_role" && renderPassScreenRole()}
          {gameState === "problem_reflection" && renderProblemReflection()}
          {gameState === "pass_emotion" && renderPassScreenEmotion()}
          {gameState === "randomizer" && renderRandomizer()}
          {gameState === "speaker" && renderSpeaker()}
          {gameState === "spectrum_guide" && renderSpectrumGuide()}
          {gameState === "spectrum_vote" && renderSpectrumVote()}
          {gameState === "end_game" && renderEndGameReveal()}
        </div>
      </div>
    </div>
  );
}
