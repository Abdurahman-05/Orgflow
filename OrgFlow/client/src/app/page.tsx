import Link from 'next/link';

/**
 * Root page component.
 * Redirects or shows links to auth/dashboard.
 */
export default function RootPage() {
  return (
    <main>
      <h1>OrgFlow</h1>
      <nav>
        <Link href="/login">Login</Link> | <Link href="/dashboard/tasks">Dashboard</Link>
      </nav>
    </main>
  );
}
