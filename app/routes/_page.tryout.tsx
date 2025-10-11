import { useLoaderData, type ActionFunctionArgs, type LoaderFunctionArgs } from "react-router";
import { TryOutModule } from "~/modules/TryOutModule";
import { TryOutAction } from "~/modules/TryOutModule/action";
import { TryOutLoader } from "~/modules/TryOutModule/loader";

export async function loader(args: LoaderFunctionArgs) {
  return TryOutLoader(args);
}

export async function action(args: ActionFunctionArgs) {
  return TryOutAction(args);
}

export default function TryOutPage() {
  const { tryout } = useLoaderData<{ tryout: Tryout }>();
  return <TryOutModule tryout={tryout} />;
}
