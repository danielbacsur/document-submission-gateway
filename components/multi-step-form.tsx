"use client";

import { useState, useCallback } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import {
  emailSchema,
  emailVerificationSchema,
  phoneSchema,
  phoneVerificationSchema,
  accountDetailsSchema,
  bankDetailsSchema,
  agreementSchema,
  uploadSchema,
  type formSchema,
} from "@/schemas/form";
import EmailStep from "@/components/email-step";
import EmailVerificationStep from "@/components/email-verification-step";
import PhoneStep from "@/components/phone-step";
import PhoneVerificationStep from "@/components/phone-verification-step";
import AccountDetailsStep from "@/components/account-details-step";
import BankDetailsStep from "@/components/bank-details-step";
import AgreementStep from "@/components/agreement-step";
import UploadStep from "@/components/upload-step";
import { sendMagicLink, submitResults } from "@/lib/actions";
import { signOut } from "next-auth/react";
import { Session } from "next-auth";

type FormData = z.infer<typeof formSchema>;

const steps = [
  { name: "Email", component: EmailStep, schema: emailSchema },
  {
    name: "Email Verification",
    component: EmailVerificationStep,
    schema: emailVerificationSchema,
  },
  { name: "Phone", component: PhoneStep, schema: phoneSchema },
  {
    name: "Phone Verification",
    component: PhoneVerificationStep,
    schema: phoneVerificationSchema,
  },
  {
    name: "Account Details",
    component: AccountDetailsStep,
    schema: accountDetailsSchema,
  },
  {
    name: "Bank Details",
    component: BankDetailsStep,
    schema: bankDetailsSchema,
  },
  { name: "Agreement", component: AgreementStep, schema: agreementSchema },
  { name: "Upload", component: UploadStep, schema: uploadSchema },
];

export function MultiStepForm({ session }: { session: Session | null }) {
  const [currentStep, setCurrentStep] = useState(() => {
    if (session?.user?.email) return 1;
    return 0;
  });
  const methods = useForm<FormData>({
    resolver: zodResolver(steps[currentStep].schema),
    mode: "onChange",
    defaultValues: {
      email: { email: session?.user?.email || "", verified: false },
      phone: { phone: "", verified: false },
      accountDetails: {
        type: "personal",
        firstName: "",
        lastName: "",
        businessName: "",
        businessType: "",
      },
      bankDetails: {
        isOwnAccount: "true",
        iban: "",
        accountHolder: "",
        taxCode: "",
      },
      agreement: {
        envelopeId: "",
        signed: false,
      },
      upload: { file: "" },
    },
  });

  const { watch } = methods;

  const formData = watch();

  const canNavigateToStep = useCallback(
    (step: number) => {
      if (step === 0) return true;
      const prevStepSchema = steps[step - 1].schema;
      try {
        prevStepSchema.parse(formData);
        return true;
      } catch (error) {
        return false;
      }
    },
    [formData]
  );

  const isStepValid = useCallback(
    (step: number) => {
      if (step < 0) return true;
      const stepSchema = steps[step].schema;
      try {
        stepSchema.parse(formData);
        return true;
      } catch (error) {
        return false;
      }
    },
    [formData]
  );

  const onSubmit = async (data: FormData) => {
    if (currentStep === 0 && data.email.email !== session?.user?.email) {
      await sendMagicLink(data.email.email);
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 2 && !data.phone?.verified) {
      console.log("Sending phone verification code:", data.phone.phone);
      setCurrentStep(currentStep + 1);
    } else if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      console.log("Submitting form data:", data);
      submitResults(data);
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  const goToPreviousStep = useCallback(() => {
    if (currentStep > 0) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);

      if (newStep === 0) {
        signOut();
        methods.setValue("email.verified", false);
      } else if (newStep === 2) {
        methods.setValue("phone.verified", false);
      }
    }
  }, [currentStep, methods]);

  // Calculate the width of a single section
  const sectionWidth = 100 / steps.length;

  // Calculate the start position and width of the progress line
  const lineStart = sectionWidth / 2;
  const lineWidth = 100 - sectionWidth;

  return (
    <FormProvider
      {...methods}
      // @ts-expect-error
      goToPreviousStep={goToPreviousStep}
    >
      <div className="max-w-4xl mx-auto mt-8 p-4 bg-white shadow-md rounded-lg">
        <div className="relative flex justify-between mb-16">
          <div
            className="absolute top-4 h-1 bg-gray-200"
            style={{
              left: `${lineStart}%`,
              width: `${lineWidth}%`,
            }}
          ></div>
          <div
            className="absolute top-4 h-1 bg-blue-500 transition-all duration-300 ease-in-out"
            style={{
              left: `${lineStart}%`,
              width: `${(currentStep / (steps.length - 1)) * lineWidth}%`,
            }}
          ></div>
          {steps.map((step, index) => (
            <div
              key={step.name}
              className="flex flex-col items-center"
              style={{ width: `${sectionWidth}%` }}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  canNavigateToStep(index)
                    ? index <= currentStep
                      ? "bg-blue-500 text-white cursor-pointer"
                      : "bg-gray-200 text-gray-600 cursor-pointer"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                } relative z-10`}
                onClick={() =>
                  canNavigateToStep(index) &&
                  isStepValid(index - 1) &&
                  setCurrentStep(index)
                }
              >
                {index + 1}
              </div>
              <span
                className={`text-xs mt-2 text-center ${
                  canNavigateToStep(index)
                    ? "cursor-pointer"
                    : "cursor-not-allowed text-gray-500"
                }`}
                onClick={() =>
                  canNavigateToStep(index) &&
                  isStepValid(index - 1) &&
                  setCurrentStep(index)
                }
              >
                {step.name}
              </span>
            </div>
          ))}
        </div>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="mt-8">
          <CurrentStepComponent />
          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {currentStep === steps.length - 1 ? "Submit" : "Next"}
            </button>
          </div>
        </form>
      </div>
      <pre className="mt-8 p-4 bg-gray-100 rounded-lg overflow-auto max-h-64">
        {JSON.stringify(methods.watch(), null, 2)}
      </pre>
      <pre className="mt-8 p-4 bg-gray-100 rounded-lg overflow-auto max-h-64">
        {JSON.stringify(session, null, 2)}
      </pre>
    </FormProvider>
  );
}
