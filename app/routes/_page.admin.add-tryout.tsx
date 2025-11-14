import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { AddTryoutModule } from "~/modules/AddTryoutModule";
import { AddTryoutAction } from "~/modules/AddTryoutModule/action";
import { AddTryoutLoader } from "~/modules/AddTryoutModule/loader";

export async function loader(args: LoaderFunctionArgs) {
  return AddTryoutLoader(args);
}

export async function action(args: ActionFunctionArgs) {
  return AddTryoutAction(args);
}

export default function EditTryoutPage() {
  return <AddTryoutModule />;
}
