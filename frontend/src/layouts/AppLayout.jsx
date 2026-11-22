import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from '../components/common/Sidebar';
import Logo from '../components/common/Logo';
import heroBanner from '../assets/hero-banner.jpg';

/**
 * Shell for every signed-in page: green sidebar, mobile top bar and the
 * page content. The reference artwork sits behind the content at low opacity.
 */
export default function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="relative min-h-screen lg:flex">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 bg-cover bg-bottom opacity-[0.1]"
        style={{ backgroundImage: `url(${heroBanner})` }}
      />

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-line bg-cream/90 px-4 py-3 backdrop-blur lg:hidden">
          <button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open menu"
            aria-controls="app-sidebar"
            aria-expanded={isSidebarOpen}
            className="rounded-lg p-2 text-ink hover:bg-sage-100"
          >
            <Menu aria-hidden="true" className="size-5" />
          </button>
          <Logo />
        </header>

        <main id="main-content" className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
