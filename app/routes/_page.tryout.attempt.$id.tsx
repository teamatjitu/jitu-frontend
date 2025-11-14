import { useLoaderData, type ActionFunctionArgs, type LoaderFunctionArgs } from "react-router";
import { TryOutModule } from "~/modules/AttemptTryOutModule";
import { TryOutAction } from "~/modules/AttemptTryOutModule/action";
import { TryOutLoader } from "~/modules/AttemptTryOutModule/loader";

export async function loader(args: LoaderFunctionArgs) {
  return TryOutLoader(args);
}

export async function action(args: ActionFunctionArgs) {
  return TryOutAction(args);
}

export default function TryOutPage() {
  const { subtestAttempt } = useLoaderData<typeof loader>();
  return <TryOutModule subtestAttempt={subtestAttempt} />;
}
