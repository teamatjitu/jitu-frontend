import {
  useLoaderData,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "react-router";
import { EditTryoutModule } from "~/modules/EditTryoutModule";
import { EditTryoutAction } from "~/modules/EditTryoutModule/action";
import { EditTryoutLoader } from "~/modules/EditTryoutModule/loader";

export async function loader(args: LoaderFunctionArgs) {
  return EditTryoutLoader(args);
}

export async function action(args: ActionFunctionArgs) {
  return EditTryoutAction(args);
}

export default function EditTryoutPage() {
  const tryout = useLoaderData<Tryout>();
  return <EditTryoutModule tryout={tryout} />;
}
