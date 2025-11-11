import {
  useLoaderData,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "react-router";
import { AddSoalModule } from "~/modules/AddSoalModule";
import { AddSoalAction } from "~/modules/AddSoalModule/action";
import { AddSoalLoader } from "~/modules/AddSoalModule/loader";

export async function loader(args: LoaderFunctionArgs) {
  return AddSoalLoader(args);
}

export async function action(args: ActionFunctionArgs) {
  return AddSoalAction(args);
}

export default function TryOutPage() {
  const { tryout, tryoutAttempt } = useLoaderData<{
    tryout: Tryout;
    tryoutAttempt: TryoutAttempt;
  }>();
  return <AddSoalModule tryout={tryout} tryoutAttempt={tryoutAttempt} />;
}
