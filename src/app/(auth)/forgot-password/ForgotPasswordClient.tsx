import Link from "next/link";

export default function ForgotPasswordClient() {
  return (
    <div className="w-full max-w-md">
      <div className="bg-surface rounded-xl p-8 shadow-lg shadow-black/5">
        <div className="text-center mb-6">
          <h1 className="font-display text-3xl font-bold text-primary tracking-tight">
            Fino<span className="text-accent">Lingo</span>
          </h1>
          <p className="font-body text-muted text-sm mt-2">
            Password reset
          </p>
        </div>

        <div className="space-y-4 font-body text-sm text-ink">
          <p>
            Self-serve password reset is temporarily unavailable while we wire
            up secure email delivery.
          </p>
          <p>
            If you&rsquo;ve forgotten your password, email{" "}
            <a
              href="mailto:eng@oximy.com"
              className="text-primary font-medium hover:underline"
            >
              eng@oximy.com
            </a>{" "}
            from the address you signed up with and we&rsquo;ll help you get
            back in.
          </p>
        </div>

        <p className="text-center mt-6 text-sm font-body text-muted">
          <Link
            href="/login"
            className="text-primary font-medium hover:underline"
          >
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
