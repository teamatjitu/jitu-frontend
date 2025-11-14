import { TryoutAttemptView } from "./components/TryoutAttemptView";
import { TryoutReviewView } from "./components/TryoutReviewView";

export const TryOutModule = ({ subtestAttempt }: { subtestAttempt: SubtestAttempt }) => {
  return (
    <TryoutReviewView subtestAttempt={subtestAttempt} />
  );
};
