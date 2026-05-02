import React, { createContext, useContext, useMemo, useState } from 'react';

import {
  createResultFeedbackStore,
  findResultFeedbackBySession,
  type ResultFeedback,
  type ResultFeedbackChoice,
} from './result-feedback';

type ResultFeedbackContextValue = {
  saveFeedback: (input: { sessionId: string; choice: ResultFeedbackChoice }) => ResultFeedback;
  getFeedbackForSession: (sessionId: string) => ResultFeedback | null;
};

const ResultFeedbackContext = createContext<ResultFeedbackContextValue | null>(null);

export type ResultFeedbackRepository = {
  saveFeedback: (input: { sessionId: string; choice: ResultFeedbackChoice; recordedAt?: number }) => ResultFeedback;
  getFeedbackForSession: (sessionId: string) => ResultFeedback | null;
  getSnapshot: () => { feedback: ResultFeedback[] };
};

export function createResultFeedbackRepository(initialFeedback: ResultFeedback[] = []): ResultFeedbackRepository {
  const store = createResultFeedbackStore(initialFeedback);

  return {
    saveFeedback(input) {
      return store.save({
        id: `feedback-${input.sessionId}`,
        sessionId: input.sessionId,
        choice: input.choice,
        recordedAt: input.recordedAt ?? Date.now(),
      });
    },
    getFeedbackForSession(sessionId) {
      return findResultFeedbackBySession({
        sessionId,
        feedback: store.getSnapshot().feedback,
      });
    },
    getSnapshot: store.getSnapshot,
  };
}

export function ResultFeedbackProvider(props: { children: React.ReactNode }) {
  const repository = useMemo(() => createResultFeedbackRepository(), []);
  const [feedback, setFeedback] = useState<ResultFeedback[]>(repository.getSnapshot().feedback);

  const value: ResultFeedbackContextValue = {
    saveFeedback(input) {
      const next = repository.saveFeedback(input);
      setFeedback(repository.getSnapshot().feedback);
      return next;
    },
    getFeedbackForSession(sessionId) {
      return findResultFeedbackBySession({
        sessionId,
        feedback,
      });
    },
  };

  return <ResultFeedbackContext.Provider value={value}>{props.children}</ResultFeedbackContext.Provider>;
}

export function useResultFeedback(): ResultFeedbackContextValue {
  const ctx = useContext(ResultFeedbackContext);
  if (!ctx) {
    throw new Error('useResultFeedback must be used within ResultFeedbackProvider');
  }
  return ctx;
}
