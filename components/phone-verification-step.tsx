import { useFormContext } from "react-hook-form";
import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { validateBody } from "twilio/lib/webhooks/webhooks";

export default function PhoneVerificationStep() {
  const form = useFormContext();
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  const phone = form.watch("phone.phone");
  const verified = form.watch("phone.verified");
  const goToPreviousStep = (form as any).goToPreviousStep;
  const verificationAttempts = useRef(0);
  const lastVerifiedOtp = useRef("");

  useEffect(() => {
    if (
      otp.length === 6 &&
      !verified &&
      !isVerifying &&
      otp !== lastVerifiedOtp.current
    ) {
      setIsVerifying(true);
      lastVerifiedOtp.current = otp;
      setTimeout(() => {
        if (otp === "123456") {
          form.setValue("phone.verified", true, { shouldValidate: true });
          setError("");
        } else {
          verificationAttempts.current += 1;
          setError(
            `Invalid OTP. Please try again. Attempts: ${verificationAttempts.current}`
          );
          form.setValue("phone.verified", false, { shouldValidate: true });
        }
        setIsVerifying(false);
      }, 1000);
    }
  }, [otp, verified, isVerifying, form]);

  const handleOtpChange = (value: string) => {
    setOtp(value);
    if (error) {
      setError("");
    }
    if (verified) {
      form.setValue("phone.verified", false, { shouldValidate: true });
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Step 4: Phone Verification</h2>
      <p className="text-sm text-gray-600">
        We've sent a verification code to {phone}
      </p>
      <FormField
        control={form.control}
        name="phone.verified"
        render={() => (
          <FormItem>
            <FormLabel>Enter 6-digit code</FormLabel>
            <FormControl>
              <InputOTP
                value={otp}
                onChange={(value) => handleOtpChange(value)}
                maxLength={6}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {isVerifying && <p className="text-blue-500">Verifying...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {verified && (
        <p className="text-green-500">Phone number verified successfully!</p>
      )}
      <Button variant="link" onClick={() => goToPreviousStep()} className="p-0">
        This isn't your phone number? Go back to change
      </Button>
    </div>
  );
}
