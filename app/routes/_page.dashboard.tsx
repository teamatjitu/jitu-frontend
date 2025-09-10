import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { DashboardModule } from "~/modules/DashboardModule";
import { DashboardAction } from "~/modules/DashboardModule/action";
import { DashboardLoader } from "~/modules/DashboardModule/loader";

export async function loader(args: LoaderFunctionArgs) {
  return DashboardLoader(args);
}

export async function action(args: ActionFunctionArgs) {
  return DashboardAction(args);
}

export default function DashboardPage() {
  return <DashboardModule />;
}
