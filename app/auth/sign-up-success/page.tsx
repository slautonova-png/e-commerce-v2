import Link from "next/link";
import { Mail } from "lucide-react";

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md text-center space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Mail className="h-8 w-8 text-primary" />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Check your email
          </h1>
          <p className="mt-2 text-muted-foreground">
            We&apos;ve sent you a confirmation link. Please check your email and
            click the link to activate your account.
          </p>
        </div>

        <div className="pt-4">
          <Link
            href="/auth/login"
            className="text-sm font-medium text-primary hover:text-primary/80"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
