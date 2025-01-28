import { z, ZodIssueCode } from "zod";

// Step One - Email
export const emailSchema = z.object({
  email: z.object({
    email: z.string().email(),
  }),
});

// Step Two - Email Verification
export const emailVerificationSchema = emailSchema.extend({
  email: emailSchema.shape.email
    .extend({
      verified: z.boolean().default(false),
    })
    .refine((data) => data.verified === true, {
      message: "Email must be verified",
      path: ["verified"],
    }),
});

// Step Three - Phone
export const phoneSchema = emailVerificationSchema.extend({
  phone: z.object({
    phone: z.string(),
    verified: z.boolean().default(false),
  }),
});

// Step Four - Phone Verification
export const phoneVerificationSchema = phoneSchema.extend({
  phone: phoneSchema.shape.phone
    .extend({
      verified: z.boolean().default(false),
    })
    .refine((data) => data.verified === true, {
      message: "Phone must be verified",
      path: ["verified"],
    }),
});

// Step Five - Account Details
export const accountDetailsSchema = phoneVerificationSchema.extend({
  accountDetails: z
    .object({
      type: z.enum(["personal", "private business", "public business"]),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      businessName: z.string().optional(),
      businessType: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      if (data.type === "personal") {
        if (!data.firstName) {
          ctx.addIssue({
            code: ZodIssueCode.custom,
            message: "First name is required for personal type.",
            path: ["firstName"],
          });
        }
        if (!data.lastName) {
          ctx.addIssue({
            code: ZodIssueCode.custom,
            message: "Last name is required for personal type.",
            path: ["lastName"],
          });
        }
      } else if (data.type === "private business") {
        if (!data.businessName) {
          ctx.addIssue({
            code: ZodIssueCode.custom,
            message: "Business name is required for business types.",
            path: ["businessName"],
          });
        }
        if (!data.businessType) {
          ctx.addIssue({
            code: ZodIssueCode.custom,
            message: "Business type is required for business types.",
            path: ["businessType"],
          });
        }
      } else if (data.type === "public business") {
        if (!data.businessName) {
          ctx.addIssue({
            code: ZodIssueCode.custom,
            message: "Business name is required for business types.",
            path: ["businessName"],
          });
        }
        if (!data.businessType) {
          ctx.addIssue({
            code: ZodIssueCode.custom,
            message: "Business type is required for business types.",
            path: ["businessType"],
          });
        }
      }
    }),
});

// Step Six - Bank Details
export const bankDetailsSchema = accountDetailsSchema.extend({
  bankDetails: z
    .object({
      iban: z.string().nonempty("IBAN is required."),
      isOwnAccount: z.enum(["true", "false"]),
      accountHolder: z.string().optional(),
      taxCode: z.string().nonempty("Tax code is required."),
    })
    .superRefine((data, ctx) => {
      if (data.isOwnAccount === "false" && !data.accountHolder) {
        ctx.addIssue({
          code: ZodIssueCode.custom,
          message: "Account holder is required when it's not your own account.",
          path: ["accountHolder"],
        });
      }
    }),
});

// Step Seven - Agreement
export const agreementSchema = bankDetailsSchema.extend({
  agreement: z.object({
    envelopeId: z.string().nonempty("Envelope ID is required."),
    signed: z.boolean().default(false).refine((data) => data, {
      message: "Agreement must be signed",
    }),
  }),
});

// Step Eight - File Upload
export const uploadSchema = agreementSchema.extend({
  upload: z.object({
    file: z.string().nonempty("File is required."),
  }),
});

export const formSchema = uploadSchema;
