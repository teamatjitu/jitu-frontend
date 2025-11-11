import {
  useLoaderData,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "react-router";
import { AddSoalModule } from "~/modules/AddSoalModule";
import { AddSoalAction } from "~/modules/AddSoalModule/action";
import { AddSoalLoader } from "~/modules/AddSoalModule/loader";

import type { Soal } from "~/modules/AddSoalModule/type";
export async function loader(args: LoaderFunctionArgs) {
  return AddSoalLoader(args);
}

export async function action(args: ActionFunctionArgs) {
  return AddSoalAction(args);
}

export default function AddSoalModulePage() {
  const { soalList } = useLoaderData<typeof loader>() as { soalList: Soal[] };
  return <AddSoalModule soalList={soalList} />;
}
