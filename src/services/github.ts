const OWNER = "SherlockianAsh";
const REPO = "Resume-Portfolio";
const FILE_PATH = "public/data/resume.json";
const API_BASE = "https://api.github.com";

const JSONBIN_BIN_ID = import.meta.env.VITE_JSONBIN_BIN_ID;
const JSONBIN_URL = `https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`;

interface GitHubFileResponse {
  content: string;
  sha: string;
}

function utf8ToBase64(str: string): string {
  return btoa(unescape(encodeURIComponent(str)));
}

function base64ToUtf8(base64: string): string {
  return decodeURIComponent(escape(atob(base64)));
}

export async function fetchResumeFromGitHub(pat: string): Promise<{ data: unknown; sha: string }> {
  const res = await fetch(`${API_BASE}/repos/${OWNER}/${REPO}/contents/${FILE_PATH}`, {
    headers: {
      Authorization: `Bearer ${pat}`,
      Accept: "application/vnd.github.v3+json",
    },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GitHub API ${res.status}: ${body}`);
  }

  const file: GitHubFileResponse = await res.json();
  const decoded = base64ToUtf8(file.content.replace(/\n/g, ""));
  return { data: JSON.parse(decoded), sha: file.sha };
}

export async function updateJsonBin(
  masterKey: string,
  data: unknown
): Promise<void> {
  const res = await fetch(JSONBIN_URL, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Master-Key": masterKey,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`JSONBin API ${res.status}: ${body}`);
  }
}

export async function commitResumeToGitHub(
  pat: string,
  data: unknown,
  sha: string,
  message = "Update resume data via admin panel"
): Promise<void> {
  const content = utf8ToBase64(JSON.stringify(data, null, 2) + "\n");

  const res = await fetch(`${API_BASE}/repos/${OWNER}/${REPO}/contents/${FILE_PATH}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${pat}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message, content, sha }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GitHub API ${res.status}: ${body}`);
  }
}
