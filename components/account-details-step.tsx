import { useFormContext } from "react-hook-form";
import {
  UserIcon,
  BuildingOffice2Icon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

export default function AccountDetailsStep() {
  const form = useFormContext();

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Step 5: Account Details</h2>

      <FormField
        control={form.control}
        name="accountDetails.type"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Account Type</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
                className="flex flex-col space-y-1"
              >
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="personal" />
                  </FormControl>
                  <FormLabel className="font-normal">
                    <div className="flex items-center">
                      <UserIcon className="w-5 h-5 mr-2" />
                      Personal
                    </div>
                  </FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="private business" />
                  </FormControl>
                  <FormLabel className="font-normal">
                    <div className="flex items-center">
                      <BuildingOffice2Icon className="w-5 h-5 mr-2" />
                      Private Business
                    </div>
                  </FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="public business" />
                  </FormControl>
                  <FormLabel className="font-normal">
                    <div className="flex items-center">
                      <GlobeAltIcon className="w-5 h-5 mr-2" />
                      Public Business
                    </div>
                  </FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {form.watch("accountDetails.type") === "personal" && (
        <>
          <FormField
            control={form.control}
            name="accountDetails.firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your first name"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="accountDetails.lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your last name"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )}

      {(form.watch("accountDetails.type") === "private business" ||
        form.watch("accountDetails.type") === "public business") && (
        <>
          <FormField
            control={form.control}
            name="accountDetails.businessName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your business name"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="accountDetails.businessType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Type</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your business type"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )}
    </div>
  );
}
