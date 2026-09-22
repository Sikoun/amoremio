export type PartnerId = 'partner1' | 'partner2';

export interface Partner {
  id: PartnerId;
  name: string;
  nickname: string;
  avatarEmoji: string;
  mood: string;
  moodEmoji: string;
  lastActive: string;
}

export interface Question {
  id: string;
  text: string;
  category: 'romantic' | 'deep' | 'fun' | 'memories' | 'spicy';
  date: string; // YYYY-MM-DD
}

export interface QuestionAnswer {
  text: string;
  answeredAt: string;
}

export interface DailyAnswers {
  questionId: string;
  date: string;
  partner1?: QuestionAnswer;
  partner2?: QuestionAnswer;
}

export interface Poke {
  id: string;
  from: PartnerId;
  message: string;
  emoji: string;
  timestamp: string;
}

export interface CoupleData {
  anniversaryDate: string; // YYYY-MM-DD
  partner1: Partner;
  partner2: Partner;
  dailyQuestions: Record<string, Question>;
  answers: Record<string, DailyAnswers>; // keyed by date YYYY-MM-DD
  recentPokes: Poke[];
}

export interface WidgyResponse {
  app_name: string;
  headline: string;
  question_text: string;
  question_category: string;
  days_together: string;
  days_together_num: number;
  partner_name: string;
  partner_mood: string;
  partner_mood_emoji: string;
  partner_status_badge: string;
  unlock_status: 'locked' | 'unlocked' | 'waiting_partner' | 'needs_my_answer';
  status_message: string;
  last_poke_text: string;
  last_poke_time: string;
  deep_link_url: string;
  updated_at: string;
}
