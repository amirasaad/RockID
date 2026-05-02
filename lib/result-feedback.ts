export type ResultFeedbackChoice = 'useful' | 'not_useful';

export type ResultFeedback = {
  id: string;
  sessionId: string;
  choice: ResultFeedbackChoice;
  recordedAt: number;
};

export type ResultFeedbackSnapshot = {
  feedback: ResultFeedback[];
};

export type ResultFeedbackStore = {
  save: (feedback: ResultFeedback) => ResultFeedback;
  getSnapshot: () => ResultFeedbackSnapshot;
};

export type SaveResultFeedbackFn = (feedback: ResultFeedback) => ResultFeedback;

export function recordResultFeedback(input: {
  sessionId: string;
  choice: ResultFeedbackChoice;
  saveFeedback: SaveResultFeedbackFn;
  recordedAt?: number;
}): ResultFeedback {
  return input.saveFeedback({
    id: `feedback-${input.sessionId}`,
    sessionId: input.sessionId,
    choice: input.choice,
    recordedAt: input.recordedAt ?? Date.now(),
  });
}

export function createResultFeedbackStore(initialFeedback: ResultFeedback[] = []): ResultFeedbackStore {
  let feedback = [...initialFeedback];

  return {
    save(nextFeedback) {
      feedback = [
        nextFeedback,
        ...feedback.filter((existingFeedback) => existingFeedback.sessionId !== nextFeedback.sessionId),
      ];
      return nextFeedback;
    },
    getSnapshot() {
      return { feedback: [...feedback] };
    },
  };
}

export function findResultFeedbackBySession(input: {
  sessionId: string;
  feedback: ResultFeedback[];
}): ResultFeedback | null {
  return input.feedback.find((item) => item.sessionId === input.sessionId) ?? null;
}
