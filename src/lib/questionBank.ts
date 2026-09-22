import { Question } from './types';

export const QUESTION_BANK: Omit<Question, 'id' | 'date'>[] = [
  { text: "What is your favorite little habit or quirk of mine?", category: "romantic" },
  { text: "If we could teleport anywhere in the world for dinner tonight, where are we going?", category: "fun" },
  { text: "What was the exact moment you realized you had real feelings for me?", category: "memories" },
  { text: "What song instantly makes you think of us whenever you hear it?", category: "romantic" },
  { text: "If we had an entire Sunday with zero obligations and infinite energy, what would our ideal day look like?", category: "fun" },
  { text: "What is one thing I do that always manages to calm you down when you're stressed?", category: "deep" },
  { text: "What's the funniest or most chaotic memory we've shared together so far?", category: "memories" },
  { text: "What is something new you'd love for us to try or experience together this year?", category: "deep" },
  { text: "What outfit or look of mine lives in your head rent-free?", category: "spicy" },
  { text: "If you could freeze one 10-minute moment from our relationship in time, which one would it be?", category: "memories" },
  { text: "What is a small gesture of love that always means the world to you?", category: "romantic" },
  { text: "What's your favorite inside joke or silly voice we do together?", category: "fun" },
  { text: "What made you smile or laugh hardest today?", category: "fun" },
  { text: "If we wrote a book about our relationship, what would the title be?", category: "romantic" },
  { text: "What's one thing you deeply appreciate about how we handle challenges together?", category: "deep" },
  { text: "What is your favorite physical touch from me (forehead kiss, back scratch, tight hug, holding hands)?", category: "romantic" },
  { text: "Where do you see us 5 years from now on this exact date?", category: "deep" },
  { text: "What's the best meal we've ever shared together?", category: "memories" },
  { text: "What is something I did recently that made you feel really loved or cherished?", category: "romantic" },
  { text: "Describe our dynamic in three emojis and explain why!", category: "fun" },
];
