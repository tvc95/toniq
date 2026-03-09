import { useState, useCallback } from "react";
import type { Session, SaveSessionData } from "../types/db";

export function useProgress() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);

  const saveSession = useCallback(async (data: SaveSessionData) => {
    await window.api.saveSession(data);
  }, []);

  const loadHistory = useCallback(async () => {
    setLoading(true);
    const data = await window.api.getHistory();
    setSessions(data);
    setLoading(false);
    return data;
  }, []);

  return {
    sessions,
    loading,
    saveSession,
    loadHistory,
  };
}
