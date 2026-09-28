import { CoupleData } from './types';

// Client-side events so any component can surface failures without prop drilling.
export const UNPAIRED_EVENT = 'amoremio:unpaired';
export const ERROR_EVENT = 'amoremio:error';

export function notifyError(message: string): void {
  window.dispatchEvent(new CustomEvent(ERROR_EVENT, { detail: message }));
}

// POST to one of the state-returning API routes. Throws on failure after
// showing an error toast, so callers only handle the success path.
export async function postState(url: string, body: unknown): Promise<CoupleData> {
  let res: Response;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch (err) {
    notifyError("Couldn't reach the server. Check your connection and try again.");
    throw err;
  }

  if (res.status === 401) {
    window.dispatchEvent(new Event(UNPAIRED_EVENT));
    throw new Error('Not paired');
  }
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    const message = data?.error || 'Something went wrong. Please try again.';
    notifyError(message);
    throw new Error(message);
  }
  return res.json();
}
