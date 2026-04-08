import { API_TIMEOUT_MS } from '../constants';

export const fetchApiData = async (url: string): Promise<string> => {
  const urlStr = url.trim();
  if (!urlStr) throw new Error('Invalid URL');

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(urlStr);
  } catch {
    throw new Error('Invalid URL');
  }

  const ac = new AbortController();
  const timeout = setTimeout(() => ac.abort(), API_TIMEOUT_MS);

  try {
    const response = await fetch(parsedUrl.toString(), {
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
      signal: ac.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`Error ${response.status}`);
    }

    const data = await response.json();
    try {
      return JSON.stringify(data, null, 2);
    } catch {
      return String(data);
    }
  } catch (error) {
    clearTimeout(timeout);
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Request failed: ${message}`);
  }
};
