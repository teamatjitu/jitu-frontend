import { TryoutAttemptView } from "./components/TryoutAttemptView";
import { TryoutReviewView } from "./components/TryoutReviewView";

export const TryOutModule = ({ tryout, tryoutAttempt }: { tryout: Tryout, tryoutAttempt: TryoutAttempt }) => {
  
  return (
    <TryoutReviewView tryoutAttempt={tryoutAttempt} />
  );
};
