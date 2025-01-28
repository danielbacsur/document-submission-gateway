import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

export default function PhoneStep() {
  const form = useFormContext();

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue("phone.phone", e.target.value);
    form.setValue("phone.verified", false);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Step 3: Phone</h2>
      <FormField
        control={form.control}
        name="phone.phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phone Number</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter your phone number"
                type="tel"
                {...field}
                onChange={handlePhoneChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
