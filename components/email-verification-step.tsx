import { useFormContext } from "react-hook-form"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { sendMagicLink } from "@/lib/actions"
import { useSession } from "next-auth/react"

export default function EmailVerificationStep() {
  const form = useFormContext()
  const email = form.watch("email.email")
  const verified = form.watch("email.verified")
  const goToPreviousStep = (form as any).goToPreviousStep
  const hasRunEffect = useRef(false)
  const [isResending, setIsResending] = useState(false)
  const session = useSession()

  useEffect(() => {
    if (!hasRunEffect.current && session.data?.user?.email === email) {
      form.setValue("email.verified", true, { shouldValidate: true })
      hasRunEffect.current = true
    }
  }, [session, email, form])

  const handleResend = async () => {
    setIsResending(true)
    try {
      await sendMagicLink(email)
      setIsResending(false)
    } catch (error) {
      console.error("Failed to resend magic link:", error)
      setIsResending(false)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Step 2: Email Verification</h2>
      <p className="text-sm text-gray-600">We've sent a verification code to {email}</p>
      {verified ? (
        <p className="text-green-500">Email verification was successful</p>
      ) : (
        <p className="text-sm text-gray-600">Please check your email for the verification link.</p>
      )}
      <Button variant="link" onClick={() => goToPreviousStep()} className="p-0">
        This isn't your email? Go back to change
      </Button>
      {!verified && (
        <Button variant="link" onClick={handleResend} disabled={isResending} className="p-0 mt-2">
          {isResending ? "Resending..." : "Resend verification email"}
        </Button>
      )}
    </div>
  )
}

