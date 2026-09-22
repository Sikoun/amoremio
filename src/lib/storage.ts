import fs from 'fs';
import path from 'path';
import { CoupleData, PartnerId, Question, Poke } from './types';
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
    nickname: 'My Lion',
    avatarEmoji: '🦁',
    mood: 'Thinking of you',
    moodEmoji: '🥰',
    lastActive: new Date().toISOString(),
  },
  partner2: {
    id: 'partner2',
    name: 'Mi Amor',
    nickname: 'My Sea Lion',
    avatarEmoji: '🦭',
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

