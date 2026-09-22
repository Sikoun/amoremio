import fs from 'fs';
import path from 'path';
import { CoupleData, PartnerId, Question, WidgyResponse, Poke, W12Row } from './types';
import { QUESTION_BANK } from './questionBank';
import { calculateDaysTogether } from './calculations';

const DATA_DIR = process.env.VERCEL
  ? path.join('/tmp', 'amoremio_data')
  : path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'store.json');

const DEFAULT_STATE: CoupleData = {
  anniversaryDate: '2023-01-01',
  partner1: {
    id: 'partner1',
    name: 'Gaspar',
    nickname: 'Babe',
    avatarEmoji: '🐻',
    mood: 'Happy & coding',
    moodEmoji: '🥰',
    lastActive: new Date().toISOString(),
  },
  partner2: {
    id: 'partner2',
    name: 'Mi Amor',
    nickname: 'Princess',
    avatarEmoji: '🐰',
    mood: 'Missing you',
    moodEmoji: '🥺',
    lastActive: new Date().toISOString(),
  },
  dailyQuestions: {},
  answers: {},
  recentPokes: [
    {
      id: 'poke-init',
      from: 'partner2',
      message: 'Sent you a warm hug!',
      emoji: '🫂',
      timestamp: new Date().toISOString(),
    },
  ],
};

// In-memory fallback if filesystem is strictly read-only
let memoryState: CoupleData = { ...DEFAULT_STATE };

function ensureDataFile(): CoupleData {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(DEFAULT_STATE, null, 2), 'utf-8');
      return DEFAULT_STATE;
    }

    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    memoryState = { ...DEFAULT_STATE, ...parsed };
    return memoryState;
  } catch (error) {
    console.warn('Filesystem access warning (using in-memory state):', error);
    return memoryState;
  }
}

export function saveState(data: CoupleData): void {
  memoryState = data;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.warn('Filesystem write warning (state kept in memory):', error);
  }
}

export function getCoupleState(): CoupleData {
  const state = ensureDataFile();
  const todayKey = getTodayDateKey();

  // If today's question isn't assigned yet, pick one deterministically from the bank
  if (!state.dailyQuestions[todayKey]) {
    const dayOfYear = Math.floor(
      (new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
    );
    const bankIndex = Math.abs(dayOfYear) % QUESTION_BANK.length;
    const template = QUESTION_BANK[bankIndex];

    const newQuestion: Question = {
      id: `q-${todayKey}`,
      text: template.text,
      category: template.category,
      date: todayKey,
    };

    state.dailyQuestions[todayKey] = newQuestion;
    saveState(state);
  }

  return state;
}

export function getTodayDateKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}


export function submitAnswer(
  partnerId: PartnerId,
  date: string,
  answerText: string
): CoupleData {
  const state = getCoupleState();

  if (!state.answers[date]) {
    const question = state.dailyQuestions[date];
    state.answers[date] = {
      questionId: question ? question.id : `q-${date}`,
      date,
    };
  }

  state.answers[date][partnerId] = {
    text: answerText.trim(),
    answeredAt: new Date().toISOString(),
  };

  // Update last active
  state[partnerId].lastActive = new Date().toISOString();

  saveState(state);
  return state;
}

export function updateMood(
  partnerId: PartnerId,
  mood: string,
  moodEmoji: string
): CoupleData {
  const state = getCoupleState();
  state[partnerId].mood = mood.trim();
  state[partnerId].moodEmoji = moodEmoji;
  state[partnerId].lastActive = new Date().toISOString();

  saveState(state);
  return state;
}

export function sendPoke(
  fromPartnerId: PartnerId,
  emoji: string,
  message: string
): CoupleData {
  const state = getCoupleState();
  const newPoke: Poke = {
    id: `poke-${Date.now()}`,
    from: fromPartnerId,
    message: message || 'Sent you love!',
    emoji: emoji || '💖',
    timestamp: new Date().toISOString(),
  };

  state.recentPokes = [newPoke, ...(state.recentPokes || [])].slice(0, 10);
  state[fromPartnerId].lastActive = new Date().toISOString();

  saveState(state);
  return state;
}

export function updateSettings(
  partner1Name?: string,
  partner2Name?: string,
  anniversaryDate?: string
): CoupleData {
  const state = getCoupleState();
  if (partner1Name) state.partner1.name = partner1Name.trim();
  if (partner2Name) state.partner2.name = partner2Name.trim();
  if (anniversaryDate) state.anniversaryDate = anniversaryDate.trim();

  saveState(state);
  return state;
}

export function getWidgyPayload(forPartnerId: PartnerId, baseUrl: string = ''): WidgyResponse {
  const state = getCoupleState();
  const todayKey = getTodayDateKey();
  const question = state.dailyQuestions[todayKey];
  const answers = state.answers[todayKey] || { questionId: question.id, date: todayKey };

  const partnerId = forPartnerId;
  const otherPartnerId: PartnerId = partnerId === 'partner1' ? 'partner2' : 'partner1';

  const myAnswer = answers[partnerId];
  const partnerAnswer = answers[otherPartnerId];

  const partnerUser = state[otherPartnerId];
  const days = calculateDaysTogether(state.anniversaryDate);

  // Status computation
  let unlockStatus: WidgyResponse['unlock_status'] = 'needs_my_answer';
  let statusMessage = `Answer to unlock ${partnerUser.name}'s answer!`;
  let partnerStatusBadge = `${partnerUser.name} hasn't answered yet`;

  if (partnerAnswer && !myAnswer) {
    unlockStatus = 'locked';
    partnerStatusBadge = `${partnerUser.name} answered! 🔒`;
    statusMessage = `${partnerUser.name} already answered! Tap to submit yours & reveal`;
  } else if (!partnerAnswer && myAnswer) {
    unlockStatus = 'waiting_partner';
    partnerStatusBadge = `Waiting for ${partnerUser.name}... ⏳`;
    statusMessage = `You answered! Waiting for ${partnerUser.name}`;
  } else if (partnerAnswer && myAnswer) {
    unlockStatus = 'unlocked';
    partnerStatusBadge = `Both answered! 🎉`;
    statusMessage = `Unlocked! Tap to read ${partnerUser.name}'s answer 💕`;
  }

  const latestPoke = (state.recentPokes || []).find((p) => p.from === otherPartnerId) || state.recentPokes?.[0];

  return {
    app_name: 'Amore Mio',
    headline: 'Question of the Day',
    question_text: question ? question.text : "What made you smile today?",
    question_category: question ? question.category.toUpperCase() : 'ROMANTIC',
    days_together: `${days} Days Together`,
    days_together_num: days,
    partner_name: partnerUser.name,
    partner_mood: `${partnerUser.moodEmoji} ${partnerUser.mood}`,
    partner_mood_emoji: partnerUser.moodEmoji,
    partner_status_badge: partnerStatusBadge,
    unlock_status: unlockStatus,
    status_message: statusMessage,
    last_poke_text: latestPoke ? `${latestPoke.emoji} ${latestPoke.message}` : 'Sending you love',
    last_poke_time: latestPoke ? new Date(latestPoke.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
    deep_link_url: baseUrl ? `${baseUrl}/?partner=${partnerId}` : `/?partner=${partnerId}`,
    updated_at: new Date().toISOString(),
  };
}

export function getW12Payload(forPartnerId: PartnerId): W12Row[] {
  const state = getCoupleState();
  const todayKey = getTodayDateKey();
  const question = state.dailyQuestions[todayKey];
  const answers = state.answers[todayKey] || { questionId: question ? question.id : 'q-init', date: todayKey };

  const partnerId = forPartnerId;
  const otherPartnerId: PartnerId = partnerId === 'partner1' ? 'partner2' : 'partner1';

  const myAnswer = answers[partnerId];
  const partnerAnswer = answers[otherPartnerId];
  const partnerUser = state[otherPartnerId];
  const days = calculateDaysTogether(state.anniversaryDate);

  let partnerBadge = 'Not answered yet';
  let partnerColor: W12Row['color'] = 'warning';

  if (partnerAnswer && !myAnswer) {
    partnerBadge = 'Answered! 🔒';
    partnerColor = 'success';
  } else if (!partnerAnswer && myAnswer) {
    partnerBadge = 'Waiting... ⏳';
    partnerColor = 'warning';
  } else if (partnerAnswer && myAnswer) {
    partnerBadge = 'Unlocked! 💕';
    partnerColor = 'success';
  }

  const rows: W12Row[] = [];

  // Row 1: Header / Days
  rows.push({
    key: '💕 AMORE MIO',
    value: `${days} Days`,
    color: 'main',
  });

  // Row 2: Partner status badge
  rows.push({
    key: partnerUser.name.slice(0, 14),
    value: partnerBadge,
    color: partnerColor,
  });

  // Row 3: Partner mood
  const moodStr = `${partnerUser.moodEmoji || '🥰'} ${partnerUser.mood || 'Missing you'}`.slice(0, 24);
  rows.push({
    key: 'Mood',
    value: moodStr,
  });

  // Row 4: Spacer
  rows.push({ key: '' });

  // Row 5: Prompt Category
  const cat = (question?.category || 'ROMANTIC').slice(0, 12).toUpperCase();
  rows.push({
    key: "TODAY'S QUESTION",
    value: cat,
    color: 'main',
  });

  // Word-wrap question into lines of <= 24 characters
  const qText = question ? question.text : 'What made you smile today?';
  const words = qText.split(/\s+/);
  const qLines: string[] = [];
  let currentLine = '';
  for (const w of words) {
    if (!currentLine) {
      currentLine = w;
    } else if ((currentLine + ' ' + w).length <= 24) {
      currentLine += ' ' + w;
    } else {
      qLines.push(currentLine);
      currentLine = w;
    }
  }
  if (currentLine) {
    qLines.push(currentLine);
  }

  // Up to 4 question lines (ensures total rows stay within 12)
  for (const line of qLines.slice(0, 4)) {
    rows.push({ key: line.slice(0, 24) });
  }

  // Spacer
  rows.push({ key: '' });

  // Footer / Status action
  let footerAction = 'Tap app to answer';
  if (partnerAnswer && myAnswer) {
    footerAction = 'Tap to read answers 💕';
  } else if (partnerAnswer && !myAnswer) {
    footerAction = 'Answer to reveal! 🔒';
  }
  rows.push({
    key: footerAction.slice(0, 24),
  });

  return rows.slice(0, 12);
}
