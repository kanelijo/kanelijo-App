// Secure Email Trigger Utility for Mobile App
// This utility fires a POST request to our own web app's /api/notify endpoint.
// The web app then uses its server-side RESEND_API_KEY to dispatch the email.
// NEVER put the RESEND_API_KEY directly into this mobile app — it's a security risk.

const WEB_API_BASE = process.env.EXPO_PUBLIC_WEB_API_URL || 'https://team.kanelijo.com';
const NOTIFY_SECRET = process.env.EXPO_PUBLIC_NOTIFY_SECRET || '';

interface NotifyWelcomeParams {
  type: 'welcome';
  email: string;
  name: string;
}

interface NotifyListingParams {
  type: 'listing';
  email: string;
  name: string;
  listingTitle: string;
  listingType: 'room' | 'shop' | 'library' | 'job';
  listingUrl: string;
}

type NotifyParams = NotifyWelcomeParams | NotifyListingParams;

/**
 * Fires a notification email via the secure web API bridge.
 * Errors are silently swallowed to avoid breaking the user flow.
 */
export async function notifyServer(params: NotifyParams): Promise<void> {
  try {
    await fetch(`${WEB_API_BASE}/api/notify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...params, secret: NOTIFY_SECRET }),
    });
  } catch (err) {
    // Non-fatal: email failure should never block a listing publish
    console.warn('[notifyServer] Email bridge call failed silently:', err);
  }
}
