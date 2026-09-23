import fs from 'fs';
import path from 'path';
import { eq, desc, asc } from 'drizzle-orm';
import { db, isTursoConfigured, ensureDbTables } from '@/db';
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

let memoryState: CoupleData = { ...DEFAULT_STATE };

// --- Local File / Memory Fallback Helpers ---
function getLocalFallbackState(): CoupleData {
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

export function getTodayDateKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getDeterministicQuestion(dateKey: string): Question {
  const dayOfYear = Math.floor(
    (new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  const bankIndex = Math.abs(dayOfYear) % QUESTION_BANK.length;
  const template = QUESTION_BANK[bankIndex];

  return {
    id: `q-${dateKey}`,
    text: template.text,
    category: template.category,
    date: dateKey,
  };
}

// --- Main State Operations (Turso with fallback) ---

export async function getCoupleState(): Promise<CoupleData> {
  const todayKey = getTodayDateKey();

  if (isTursoConfigured && db) {
    try {
      await ensureDbTables();

      // 1. Fetch or create couple_settings
      const settingsRows = await db
        .select()
        .from(coupleSettings)
        .where(eq(coupleSettings.id, 'main'))
        .limit(1);

      let currentSettings = settingsRows[0];
      if (!currentSettings) {
        await db.insert(coupleSettings).values({
          id: 'main',
          anniversaryDate: DEFAULT_STATE.anniversaryDate,
          partner1Name: DEFAULT_STATE.partner1.name,
          partner1Nickname: DEFAULT_STATE.partner1.nickname,
          partner1AvatarEmoji: DEFAULT_STATE.partner1.avatarEmoji,
          partner1Pet: DEFAULT_STATE.partner1.pet || 'sealion',
          partner1CustomPet: DEFAULT_STATE.partner1.customPet,
          partner1Mood: DEFAULT_STATE.partner1.mood,
          partner1MoodEmoji: DEFAULT_STATE.partner1.moodEmoji,
          partner1LastActive: DEFAULT_STATE.partner1.lastActive,
          partner2Name: DEFAULT_STATE.partner2.name,
          partner2Nickname: DEFAULT_STATE.partner2.nickname,
          partner2AvatarEmoji: DEFAULT_STATE.partner2.avatarEmoji,
          partner2Pet: DEFAULT_STATE.partner2.pet || 'lion',
          partner2CustomPet: DEFAULT_STATE.partner2.customPet,
          partner2Mood: DEFAULT_STATE.partner2.mood,
          partner2MoodEmoji: DEFAULT_STATE.partner2.moodEmoji,
          partner2LastActive: DEFAULT_STATE.partner2.lastActive,
          updatedAt: new Date().toISOString(),
        });
        const refetched = await db
          .select()
          .from(coupleSettings)
          .where(eq(coupleSettings.id, 'main'))
          .limit(1);
        currentSettings = refetched[0];
      }

      // 2. Fetch or create today's question
      const questionRows = await db.select().from(questions);
      const questionsMap: Record<string, Question> = {};
      questionRows.forEach((q) => {
        questionsMap[q.date] = {
          id: q.id,
          text: q.text,
          category: q.category as any,
          date: q.date,
        };
      });

      if (!questionsMap[todayKey]) {
        const todayQ = getDeterministicQuestion(todayKey);
        await db.insert(questions).values({
          id: todayQ.id,
          date: todayQ.date,
          text: todayQ.text,
          category: todayQ.category,
          source: 'bank',
          createdAt: new Date().toISOString(),
        });
        questionsMap[todayKey] = todayQ;
      }

      // 3. Fetch answers
      const answerRows = await db.select().from(answers).orderBy(asc(answers.answeredAt));
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

      // 4. Fetch recent pokes
      const pokeRows = await db
        .select()
        .from(pokes)
        .orderBy(desc(pokes.timestamp))
        .limit(10);

      const recentPokesList: Poke[] = pokeRows.length
        ? pokeRows.map((p) => ({
            id: p.id,
            from: p.fromPartner as PartnerId,
            emoji: p.emoji,
            message: p.message,
            timestamp: p.timestamp,
          }))
        : DEFAULT_STATE.recentPokes;

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
        dailyQuestions: questionsMap,
        answers: answersMap,
        recentPokes: recentPokesList,
      };
    } catch (err) {
      console.error('Turso query error, falling back to local storage:', err);
    }
  }

  // Fallback to local file / memory
  const localState = getLocalFallbackState();
  if (!localState.dailyQuestions[todayKey]) {
    localState.dailyQuestions[todayKey] = getDeterministicQuestion(todayKey);
    saveLocalFallbackState(localState);
  }
  return localState;
}

export async function submitAnswer(
  partnerId: PartnerId,
  date: string,
  answerText: string
): Promise<CoupleData> {
  const now = new Date().toISOString();

  if (isTursoConfigured && db) {
    try {
      await ensureDbTables();

      // Ensure question exists in db
      const existingQ = await db
        .select()
        .from(questions)
        .where(eq(questions.date, date))
        .limit(1);

      if (!existingQ.length) {
        const generated = getDeterministicQuestion(date);
        await db.insert(questions).values({
          id: generated.id,
          date,
          text: generated.text,
          category: generated.category,
          source: 'bank',
          createdAt: now,
        });
      }

      // Check if this partner already answered
      const existingAnswer = await db
        .select()
        .from(answers)
        .where(eq(answers.questionDate, date));

      const partnerAnswer = existingAnswer.find((a) => a.partnerId === partnerId);
      if (partnerAnswer) {
        await db
          .update(answers)
          .set({ answerText: answerText.trim(), answeredAt: now })
          .where(eq(answers.id, partnerAnswer.id));
      } else {
        await db.insert(answers).values({
          questionDate: date,
          partnerId,
          answerText: answerText.trim(),
          answeredAt: now,
        });
      }

      // Update last active
      const activeField =
        partnerId === 'partner1'
          ? { partner1LastActive: now }
          : { partner2LastActive: now };
      await db
        .update(coupleSettings)
        .set({ ...activeField, updatedAt: now })
        .where(eq(coupleSettings.id, 'main'));

      return await getCoupleState();
    } catch (err) {
      console.error('Turso submitAnswer error, using fallback:', err);
    }
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
  return state;
}

export async function updateMood(
  partnerId: PartnerId,
  mood: string,
  moodEmoji: string
): Promise<CoupleData> {
  const now = new Date().toISOString();

  if (isTursoConfigured && db) {
    try {
      await ensureDbTables();
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
    } catch (err) {
      console.error('Turso updateMood error, using fallback:', err);
    }
  }

  // Local fallback
  const state = getLocalFallbackState();
  state[partnerId].mood = mood.trim();
  state[partnerId].moodEmoji = moodEmoji;
  state[partnerId].lastActive = now;
  saveLocalFallbackState(state);
  return state;
}

export async function sendPoke(
  fromPartnerId: PartnerId,
  emoji: string,
  message: string
): Promise<CoupleData> {
  const now = new Date().toISOString();
  const pokeId = `poke-${Date.now()}`;

  if (isTursoConfigured && db) {
    try {
      await ensureDbTables();
      await db.insert(pokes).values({
        id: pokeId,
        fromPartner: fromPartnerId,
        emoji: emoji || '💖',
        message: message || 'Sent you love!',
        timestamp: now,
      });

      const activeField =
        fromPartnerId === 'partner1'
          ? { partner1LastActive: now }
          : { partner2LastActive: now };
      await db
        .update(coupleSettings)
        .set({ ...activeField, updatedAt: now })
        .where(eq(coupleSettings.id, 'main'));

      return await getCoupleState();
    } catch (err) {
      console.error('Turso sendPoke error, using fallback:', err);
    }
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
  return state;
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

  if (isTursoConfigured && db) {
    try {
      await ensureDbTables();
      const current = await getCoupleState();

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
    } catch (err) {
      console.error('Turso updateSettings error, using fallback:', err);
    }
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
  return state;
}
