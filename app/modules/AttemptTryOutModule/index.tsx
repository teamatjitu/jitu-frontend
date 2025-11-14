import { TryoutAttemptView } from "./components/TryoutAttemptView";

export const TryOutModule = ({ subtestAttempt }: { subtestAttempt: SubtestAttempt }) => {
  return (
    <TryoutAttemptView subtestAttempt={subtestAttempt} />
  );
};
