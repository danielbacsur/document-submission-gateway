import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

export default function EmailStep() {
  const form = useFormContext();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue("email.email", e.target.value);
    form.setValue("email.verified", false);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Step 1: Email</h2>
      <FormField
        control={form.control}
        name="email.email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter your email"
                type="email"
                {...field}
                onChange={handleEmailChange}
                value={field.value || ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
