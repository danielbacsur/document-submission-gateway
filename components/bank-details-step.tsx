import { useFormContext } from "react-hook-form"
import { UserIcon, UsersIcon } from "@heroicons/react/24/outline"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"

export default function BankDetailsStep() {
  const form = useFormContext()

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Step 6: Bank Details</h2>

      <FormField
        control={form.control}
        name="bankDetails.isOwnAccount"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Account Type</FormLabel>
            <FormControl>
              <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="true" />
                  </FormControl>
                  <FormLabel className="font-normal">
                    <div className="flex items-center">
                      <UserIcon className="w-5 h-5 mr-2" />
                      Own Account
                    </div>
                  </FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="false" />
                  </FormControl>
                  <FormLabel className="font-normal">
                    <div className="flex items-center">
                      <UsersIcon className="w-5 h-5 mr-2" />
                      Other Account
                    </div>
                  </FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="bankDetails.iban"
        render={({ field }) => (
          <FormItem>
            <FormLabel>IBAN</FormLabel>
            <FormControl>
              <Input placeholder="Enter IBAN" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {form.watch("bankDetails.isOwnAccount") === "false" && (
        <FormField
          control={form.control}
          name="bankDetails.accountHolder"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Holder</FormLabel>
              <FormControl>
                <Input placeholder="Enter account holder name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      <FormField
        control={form.control}
        name="bankDetails.taxCode"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tax Code</FormLabel>
            <FormControl>
              <Input placeholder="Enter tax code" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

