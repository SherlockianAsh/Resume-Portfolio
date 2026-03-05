import { useState } from "react";

const PAT_KEY = "github_pat";

export function useGitHubPat() {
  const [pat, setPat] = useState<string>(() => sessionStorage.getItem(PAT_KEY) ?? "");

  const savePat = (value: string) => {
    sessionStorage.setItem(PAT_KEY, value);
    setPat(value);
  };

  const clearPat = () => {
    sessionStorage.removeItem(PAT_KEY);
    setPat("");
  };

  return { pat, savePat, clearPat };
}
