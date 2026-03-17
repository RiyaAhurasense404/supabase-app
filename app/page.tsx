import Link from "next/link";

export default function Home() {
  return (
    <div>
      <nav>
        <span>Supabase App</span>
        <Link href="/login">Login</Link>
      </nav>

      <div>
        <h1>Welcome to the Supabase Auth Example</h1>
        <p>
          This is a simple Next.js application demonstrating how to use Supabase
          for authentication. You can register, log in, and access a protected
          dashboard.
        </p>

        <Link href="/login">
          <button>Get Started →</button>
        </Link>
      </div>
    </div>
  );
}