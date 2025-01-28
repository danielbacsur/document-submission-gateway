import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

export default function AgreementStep() {
  const form = useFormContext();

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Step 7: Agreement</h2>
      <FormField
        control={form.control}
        name="agreement.envelopeId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Envelope ID</FormLabel>
            <FormControl>
              <Input placeholder="Enter envelope ID" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="agreement.signed"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>I have signed the agreement</FormLabel>
            </div>
          </FormItem>
        )}
      />
    </div>
  );
}
