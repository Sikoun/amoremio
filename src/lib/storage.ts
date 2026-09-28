import fs from 'fs';
import path from 'path';
import { eq, desc, asc } from 'drizzle-orm';
import { db } from '@/db';
import { coupleSettings, questions, answers, pokes } from '@/db/schema';
import {
  CoupleData,
  PartnerId,
  Question,
  Poke,
  PetType,
  PET_EMOJIS,
  PetCustomization,
  DailyAnswers,
} from './types';
import { QUESTION_BANK } from './questionBank';

export { PET_EMOJIS };

const DATA_DIR = process.env.VERCEL
  ? path.join('/tmp', 'amoremio_data')
  : path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'store.json');

const DEFAULT_STATE: CoupleData = {
  todayKey: '',
  anniversaryDate: '2023-01-01',
  partner1: {
    id: 'partner1',
    name: 'Gaspar',
    nickname: 'My Sea Lion',
    avatarEmoji: '🦭',
    pet: 'sealion',
    customPet: {
      species: 'sealion',
      colorShade: 'default',
      headAccessory: 'sprout',
      neckAccessory: 'heart_locket',
    },
    mood: 'Thinking of you',
    moodEmoji: '🥰',
    lastActive: new Date().toISOString(),
  },
  partner2: {
    id: 'partner2',
    name: 'Mi Amor',
    nickname: 'My Lion',
    avatarEmoji: '🦁',
    pet: 'lion',
    customPet: {
      species: 'lion',
      colorShade: 'default',
      headAccessory: 'crown',
      neckAccessory: 'bowtie',
    },
    mood: 'Missing you',
    moodEmoji: '🥺',
    lastActive: new Date().toISOString(),
  },
  dailyQuestions: {},
  answers: {},
  recentPokes: [],
};

let memoryState: CoupleData = structuredClone(DEFAULT_STATE);

// --- Local File / Memory Fallback Helpers ---
// The JSON file store is only for local development. On Vercel, /tmp is per-instance
// and ephemeral, so writes there would silently vanish — fail loudly instead.
function getLocalFallbackState(): CoupleData {
  if (process.env.VERCEL) {
    throw new Error('Turso is not configured (TURSO_DATABASE_URL / TURSO_AUTH_TOKEN missing)');
  }
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(DEFAULT_STATE, null, 2), 'utf-8');
      return memoryState;
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    memoryState = {
      ...DEFAULT_STATE,
      ...parsed,
      partner1: {
        ...DEFAULT_STATE.partner1,
        ...(parsed.partner1 || {}),
        customPet: parsed.partner1?.customPet || DEFAULT_STATE.partner1.customPet,
      },
      partner2: {
        ...DEFAULT_STATE.partner2,
        ...(parsed.partner2 || {}),
        customPet: parsed.partner2?.customPet || DEFAULT_STATE.partner2.customPet,
      },
    };
    return memoryState;
  } catch (error) {
    return memoryState;
  }
}

function saveLocalFallbackState(data: CoupleData): void {
  memoryState = data;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    // Memory fallback preserved
  }
}

// The shared "day" rolls over at midnight in this timezone (DST handled by IANA rules).
// Chile's midnight lands at 04:00–06:00 in Italy, so the question changes while both are asleep.
export const COUPLE_TIMEZONE = process.env.COUPLE_TIMEZONE || 'America/Santiago';

export function getTodayDateKey(): string {
  // en-CA formats as YYYY-MM-DD
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: COUPLE_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

export function isValidDateKey(value: unknown): value is string {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !isNaN(Date.parse(value));
}

function getDeterministicQuestion(dateKey: string): Question {
  // Days since epoch for the given date, so the rotation never resets on Jan 1
  const dayNumber = Math.floor(Date.parse(`${dateKey}T00:00:00Z`) / 86400000);
  const bankIndex = Math.abs(dayNumber) % QUESTION_BANK.length;
  const template = QUESTION_BANK[bankIndex];

  return {
    id: `q-${dateKey}`,
    text: template.text,
    category: template.category,
    date: dateKey,
  };
}

// --- Main State Operations (Turso, or local JSON file in development) ---

export async function getCoupleState(): Promise<CoupleData> {
  const todayKey = getTodayDateKey();

  if (db) {
    // All reads in one round trip to Turso
    const [settingsRows, questionRows, answerRows, pokeRows] = await db.batch([
      db.select().from(coupleSettings).where(eq(coupleSettings.id, 'main')).limit(1),
      db.select().from(questions),
      db.select().from(answers).orderBy(asc(answers.answeredAt)),
      db.select().from(pokes).orderBy(desc(pokes.timestamp)).limit(10),
    ]);

    let currentSettings = settingsRows[0];
    const questionsMap: Record<string, Question> = {};
    questionRows.forEach((q) => {
      questionsMap[q.date] = {
        id: q.id,
        text: q.text,
        category: q.category as Question['category'],
        date: q.date,
      };
    });

    // First run ever, or first visit of the day: create the settings row / today's question.
    // onConflictDoNothing keeps simultaneous first visits from both of you safe.
    if (!currentSettings || !questionsMap[todayKey]) {
      const todayQ = getDeterministicQuestion(todayKey);
      const now = new Date().toISOString();
      const [, , [storedSettings], [storedQuestion]] = await db.batch([
        db
          .insert(coupleSettings)
          .values({
            id: 'main',
            partner1CustomPet: DEFAULT_STATE.partner1.customPet,
            partner2CustomPet: DEFAULT_STATE.partner2.customPet,
            updatedAt: now,
          })
          .onConflictDoNothing(),
        db
          .insert(questions)
          .values({
            id: todayQ.id,
            date: todayQ.date,
            text: todayQ.text,
            category: todayQ.category,
            source: 'bank',
            createdAt: now,
          })
          .onConflictDoNothing(),
        db.select().from(coupleSettings).where(eq(coupleSettings.id, 'main')).limit(1),
        db.select().from(questions).where(eq(questions.date, todayKey)).limit(1),
      ]);
      currentSettings = storedSettings;
      questionsMap[todayKey] = {
        id: storedQuestion.id,
        text: storedQuestion.text,
        category: storedQuestion.category as Question['category'],
        date: storedQuestion.date,
      };
    }

    const answersMap: Record<string, DailyAnswers> = {};

    answerRows.forEach((a) => {
      if (!answersMap[a.questionDate]) {
        const q = questionsMap[a.questionDate];
        answersMap[a.questionDate] = {
          questionId: q ? q.id : `q-${a.questionDate}`,
          date: a.questionDate,
        };
      }
      if (a.partnerId === 'partner1' || a.partnerId === 'partner2') {
        answersMap[a.questionDate][a.partnerId] = {
          text: a.answerText,
          answeredAt: a.answeredAt,
        };
      }
    });

    const recentPokesList: Poke[] = pokeRows.map((p) => ({
      id: p.id,
      from: p.fromPartner as PartnerId,
      emoji: p.emoji,
      message: p.message,
      timestamp: p.timestamp,
    }));

    // Assemble unified state
    return {
      anniversaryDate: currentSettings?.anniversaryDate || DEFAULT_STATE.anniversaryDate,
      partner1: {
        id: 'partner1',
        name: currentSettings?.partner1Name || DEFAULT_STATE.partner1.name,
        nickname: currentSettings?.partner1Nickname || DEFAULT_STATE.partner1.nickname,
        avatarEmoji: currentSettings?.partner1AvatarEmoji || DEFAULT_STATE.partner1.avatarEmoji,
        pet: (currentSettings?.partner1Pet as PetType) || DEFAULT_STATE.partner1.pet,
        customPet:
          (currentSettings?.partner1CustomPet as PetCustomization) ||
          DEFAULT_STATE.partner1.customPet,
        mood: currentSettings?.partner1Mood || DEFAULT_STATE.partner1.mood,
        moodEmoji: currentSettings?.partner1MoodEmoji || DEFAULT_STATE.partner1.moodEmoji,
        lastActive: currentSettings?.partner1LastActive || DEFAULT_STATE.partner1.lastActive,
      },
      partner2: {
        id: 'partner2',
        name: currentSettings?.partner2Name || DEFAULT_STATE.partner2.name,
        nickname: currentSettings?.partner2Nickname || DEFAULT_STATE.partner2.nickname,
        avatarEmoji: currentSettings?.partner2AvatarEmoji || DEFAULT_STATE.partner2.avatarEmoji,
        pet: (currentSettings?.partner2Pet as PetType) || DEFAULT_STATE.partner2.pet,
        customPet:
          (currentSettings?.partner2CustomPet as PetCustomization) ||
          DEFAULT_STATE.partner2.customPet,
        mood: currentSettings?.partner2Mood || DEFAULT_STATE.partner2.mood,
        moodEmoji: currentSettings?.partner2MoodEmoji || DEFAULT_STATE.partner2.moodEmoji,
        lastActive: currentSettings?.partner2LastActive || DEFAULT_STATE.partner2.lastActive,
      },
      todayKey,
      dailyQuestions: questionsMap,
      answers: answersMap,
      recentPokes: recentPokesList,
    };
  }

  // Fallback to local file / memory
  const localState = getLocalFallbackState();
  if (!localState.dailyQuestions[todayKey]) {
    localState.dailyQuestions[todayKey] = getDeterministicQuestion(todayKey);
    saveLocalFallbackState(localState);
  }
  return { ...localState, todayKey };
}

export async function submitAnswer(
  partnerId: PartnerId,
  date: string,
  answerText: string
): Promise<CoupleData> {
  const now = new Date().toISOString();

  if (db) {
    const generated = getDeterministicQuestion(date);
    const activeField =
      partnerId === 'partner1' ? { partner1LastActive: now } : { partner2LastActive: now };

    // One atomic round trip: make sure the question exists, save the answer
    // (unique per partner per day, so a double-tap just overwrites), bump last active.
    await db.batch([
      db
        .insert(questions)
        .values({
          id: generated.id,
          date,
          text: generated.text,
          category: generated.category,
          source: 'bank',
          createdAt: now,
        })
        .onConflictDoNothing(),
      db
        .insert(answers)
        .values({ questionDate: date, partnerId, answerText: answerText.trim(), answeredAt: now })
        .onConflictDoUpdate({
          target: [answers.questionDate, answers.partnerId],
          set: { answerText: answerText.trim(), answeredAt: now },
        }),
      db
        .update(coupleSettings)
        .set({ ...activeField, updatedAt: now })
        .where(eq(coupleSettings.id, 'main')),
    ]);

    return await getCoupleState();
  }

  // Local fallback
  const state = getLocalFallbackState();
  if (!state.answers[date]) {
    const question = state.dailyQuestions[date] || getDeterministicQuestion(date);
    state.answers[date] = {
      questionId: question.id,
      date,
    };
  }
  state.answers[date][partnerId] = {
    text: answerText.trim(),
    answeredAt: now,
  };
  state[partnerId].lastActive = now;
  saveLocalFallbackState(state);
  return getCoupleState();
}

export async function updateMood(
  partnerId: PartnerId,
  mood: string,
  moodEmoji: string
): Promise<CoupleData> {
  const now = new Date().toISOString();

  if (db) {
    const moodFields =
      partnerId === 'partner1'
        ? {
            partner1Mood: mood.trim(),
            partner1MoodEmoji: moodEmoji,
            partner1LastActive: now,
          }
        : {
            partner2Mood: mood.trim(),
            partner2MoodEmoji: moodEmoji,
            partner2LastActive: now,
          };

    await db
      .update(coupleSettings)
      .set({ ...moodFields, updatedAt: now })
      .where(eq(coupleSettings.id, 'main'));

    return await getCoupleState();
  }

  // Local fallback
  const state = getLocalFallbackState();
  state[partnerId].mood = mood.trim();
  state[partnerId].moodEmoji = moodEmoji;
  state[partnerId].lastActive = now;
  saveLocalFallbackState(state);
  return getCoupleState();
}

export async function sendPoke(
  fromPartnerId: PartnerId,
  emoji: string,
  message: string
): Promise<CoupleData> {
  const now = new Date().toISOString();
  const pokeId = `poke-${crypto.randomUUID()}`;

  if (db) {
    const activeField =
      fromPartnerId === 'partner1' ? { partner1LastActive: now } : { partner2LastActive: now };
    await db.batch([
      db.insert(pokes).values({
        id: pokeId,
        fromPartner: fromPartnerId,
        emoji: emoji || '💖',
        message: message || 'Sent you love!',
        timestamp: now,
      }),
      db
        .update(coupleSettings)
        .set({ ...activeField, updatedAt: now })
        .where(eq(coupleSettings.id, 'main')),
    ]);

    return await getCoupleState();
  }

  // Local fallback
  const state = getLocalFallbackState();
  const newPoke: Poke = {
    id: pokeId,
    from: fromPartnerId,
    message: message || 'Sent you love!',
    emoji: emoji || '💖',
    timestamp: now,
  };
  state.recentPokes = [newPoke, ...(state.recentPokes || [])].slice(0, 10);
  state[fromPartnerId].lastActive = now;
  saveLocalFallbackState(state);
  return getCoupleState();
}

export async function updateSettings(
  partner1Name?: string,
  partner2Name?: string,
  anniversaryDate?: string,
  partner1Pet?: PetType,
  partner2Pet?: PetType,
  partner1CustomPet?: PetCustomization,
  partner2CustomPet?: PetCustomization
): Promise<CoupleData> {
  const now = new Date().toISOString();

  if (db) {
    const updates: any = { updatedAt: now };
    if (partner1Name) updates.partner1Name = partner1Name.trim();
    if (partner2Name) updates.partner2Name = partner2Name.trim();
    if (anniversaryDate) updates.anniversaryDate = anniversaryDate.trim();

    if (partner1CustomPet) {
      updates.partner1CustomPet = partner1CustomPet;
      updates.partner1Pet = partner1CustomPet.species;
      if (PET_EMOJIS[partner1CustomPet.species]) {
        updates.partner1AvatarEmoji = PET_EMOJIS[partner1CustomPet.species];
      }
    } else if (partner1Pet && PET_EMOJIS[partner1Pet]) {
      updates.partner1Pet = partner1Pet;
      updates.partner1AvatarEmoji = PET_EMOJIS[partner1Pet];
    }

    if (partner2CustomPet) {
      updates.partner2CustomPet = partner2CustomPet;
      updates.partner2Pet = partner2CustomPet.species;
      if (PET_EMOJIS[partner2CustomPet.species]) {
        updates.partner2AvatarEmoji = PET_EMOJIS[partner2CustomPet.species];
      }
    } else if (partner2Pet && PET_EMOJIS[partner2Pet]) {
      updates.partner2Pet = partner2Pet;
      updates.partner2AvatarEmoji = PET_EMOJIS[partner2Pet];
    }

    await db
      .update(coupleSettings)
      .set(updates)
      .where(eq(coupleSettings.id, 'main'));

    return await getCoupleState();
  }

  // Local fallback
  const state = getLocalFallbackState();
  if (partner1Name) state.partner1.name = partner1Name.trim();
  if (partner2Name) state.partner2.name = partner2Name.trim();
  if (anniversaryDate) state.anniversaryDate = anniversaryDate.trim();

  if (partner1CustomPet) {
    state.partner1.customPet = partner1CustomPet;
    state.partner1.pet = partner1CustomPet.species;
    if (PET_EMOJIS[partner1CustomPet.species]) {
      state.partner1.avatarEmoji = PET_EMOJIS[partner1CustomPet.species];
    }
  } else if (partner1Pet && PET_EMOJIS[partner1Pet]) {
    state.partner1.pet = partner1Pet;
    state.partner1.avatarEmoji = PET_EMOJIS[partner1Pet];
    if (state.partner1.customPet) {
      state.partner1.customPet.species = partner1Pet;
    }
  }

  if (partner2CustomPet) {
    state.partner2.customPet = partner2CustomPet;
    state.partner2.pet = partner2CustomPet.species;
    if (PET_EMOJIS[partner2CustomPet.species]) {
      state.partner2.avatarEmoji = PET_EMOJIS[partner2CustomPet.species];
    }
  } else if (partner2Pet && PET_EMOJIS[partner2Pet]) {
    state.partner2.pet = partner2Pet;
    state.partner2.avatarEmoji = PET_EMOJIS[partner2Pet];
    if (state.partner2.customPet) {
      state.partner2.customPet.species = partner2Pet;
    }
  }

  saveLocalFallbackState(state);
  return getCoupleState();
}
