import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { EditProfileModule } from "~/modules/EditProfileModule";
import { EditProfileAction } from "~/modules/EditProfileModule/action";
import { EditProfileLoader } from "~/modules/EditProfileModule/loader";

export async function loader(args: LoaderFunctionArgs) {
  return EditProfileLoader(args);
}

export async function action(args: ActionFunctionArgs) {
  return EditProfileAction(args);
}

export default function EditProfilePage() {
  return <EditProfileModule />;
}
