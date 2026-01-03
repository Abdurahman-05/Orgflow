/**
 * Dashboard layout component.
 * Provides the shared UI for all dashboard routes (sidebar, topbar).
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <nav>{/* Sidebar/Navbar component will go here */}</nav>
      <main>{children}</main>
    </section>
  );
}
