import { useFormContext } from "react-hook-form";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { upload } from "@vercel/blob/client";

export default function UploadStep() {
  const form = useFormContext();
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const newBlob = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
      });
      form.setValue("upload.file", newBlob.url, { shouldValidate: true });
      setFileName(file.name);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Step 8: File Upload</h2>
      <FormField
        control={form.control}
        name="upload.file"
        render={({ field: { value, onChange, ...field } }) => (
          <FormItem>
            <FormLabel>Upload File</FormLabel>
            <FormControl>
              <Input type="file" onChange={handleFileChange} {...field} />
            </FormControl>
            <FormMessage />
            {fileName && (
              <p className="text-sm text-gray-600">Selected file: {fileName}</p>
            )}
          </FormItem>
        )}
      />
    </div>
  );
}
