import { Link } from 'react-router-dom';
import Logo from '../components/common/Logo';

/** Shown for any URL that does not match a route. */
export default function NotFoundPage() {
  return (
    <main className="grid min-h-screen place-items-center px-6">
      <div className="text-center animate-fade-in">
        <Logo />
        <p className="mt-8 text-sm font-semibold uppercase tracking-wide text-sage-600">404</p>
        <h1 className="mt-2 text-3xl font-bold text-ink">Page not found</h1>
        <p className="mt-3 text-ink-muted">The page you are looking for does not exist or has moved.</p>
        <Link
          to="/"
          className="mt-6 inline-flex h-10 items-center rounded-lg bg-sage-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-sage-700"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
