"use server";

import { signIn } from "@/auth";
import { formSchema } from "@/schemas/form";
import twilio from "twilio";
import { z } from "zod";

type FormData = z.infer<typeof formSchema>;

export async function sendMagicLink(email: string) {
  console.log(`Sending magic link to ${email}`);

  await signIn("resend", {
    email,
    redirect: false,
  });

  console.log(`Magic link sent to ${email}`);
  return true;
}

export async function sendPhoneVerificationCode(phone: string) {
  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID as string,
    process.env.TWILIO_AUTH_TOKEN as string
  );

  const code = Math.floor(100000 + Math.random() * 900000);

  console.log(`Sending phone verification code to ${phone}`);

  const message = await client.messages.create({
    body: "Your verification code is " + code,
    from: process.env.TWILIO_PHONE_NUMBER as string,
    to: phone,
  });

  console.log(`Phone verification code sent to ${phone}`);

  return code;
}


export async function submitResults(data: FormData) {
  console.log("Submitting results", data);
  return true;
}