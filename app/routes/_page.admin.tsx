import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { AdminModule } from "~/modules/AdminModule";
import { AdminAction } from "~/modules/AdminModule/action";
import { AdminLoader } from "~/modules/AdminModule/loader";

export async function loader(args: LoaderFunctionArgs) {
  return AdminLoader(args);
}

export async function action(args: ActionFunctionArgs) {
  return AdminAction(args);
}

export default function AdminPage() {
  return <AdminModule />;
}
