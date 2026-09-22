export function calculateDaysTogether(anniversaryDate: string): number {
  try {
    const start = new Date(anniversaryDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - start.getTime());
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  } catch {
    return 1;
  }
}
