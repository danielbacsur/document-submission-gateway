import { auth } from "@/auth";
import { MultiStepForm } from "@/components/multi-step-form";

export default async function Page() {
  const session = await auth();

  return <MultiStepForm session={session} />;
}
