import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { X } from 'lucide-react';
import Logo from './Logo';
import { NAV_ITEMS } from './navItems';

const baseItem = 'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150';

/** Green sidebar with the logo and main navigation. Slides in on mobile. */
export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close menu overlay"
          onClick={onClose}
          className="fixed inset-0 z-30 bg-ink/30 backdrop-blur-[1px] lg:hidden"
        />
      )}
      <aside
        id="app-sidebar"
        aria-label="Main navigation"
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-sage-700 px-4 py-6 text-white transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="mb-8 flex items-center justify-between px-2">
          <Logo tone="light" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-md p-1.5 text-white/80 hover:bg-white/10 hover:text-white lg:hidden"
          >
            <X aria-hidden="true" className="size-5" />
          </button>
        </div>

        <nav>
          <ul className="flex flex-col gap-1">
            {NAV_ITEMS.map(({ label, to, icon: Icon, available, week }) => (
              <li key={label}>
                {available ? (
                  <NavLink
                    to={to}
                    end
                    onClick={onClose}
                    className={({ isActive }) =>
                      `${baseItem} ${isActive ? 'bg-white/15 text-white shadow-inner' : 'text-white/80 hover:bg-white/10 hover:text-white'}`
                    }
                  >
                    <Icon aria-hidden="true" className="size-[18px]" />
                    {label}
                  </NavLink>
                ) : (
                  <span
                    aria-disabled="true"
                    title={`Available in Week ${week}`}
                    className={`${baseItem} cursor-not-allowed text-white/45`}
                  >
                    <Icon aria-hidden="true" className="size-[18px]" />
                    {label}
                    <span className="ml-auto rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white/60">
                      Week {week}
                    </span>
                  </span>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <p className="mt-auto px-3 text-xs leading-relaxed text-white/60">A cleaner mind starts with a note.</p>
      </aside>
    </>
  );
}

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
