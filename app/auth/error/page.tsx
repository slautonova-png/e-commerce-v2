import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md text-center space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Authentication Error
          </h1>
          <p className="mt-2 text-muted-foreground">
            Something went wrong during authentication. Please try again.
          </p>
        </div>

        <div className="flex flex-col gap-4 pt-4">
          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Back to sign in
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Go to homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
