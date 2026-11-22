import WelcomeBanner from '../components/dashboard/WelcomeBanner';
import SystemStatusCard from '../components/dashboard/SystemStatusCard';
import DesignSystemPreview from '../components/dashboard/DesignSystemPreview';
import useHealthStatus from '../hooks/useHealthStatus';

/**
 * Week 1 home page: banner, live system status and the design-system preview.
 * Week 3 turns it into the personal dashboard (greeting, stats, recent notes).
 */
export default function HomePage() {
  const { health, isLoading, error, refresh } = useHealthStatus();

  return (
    <div className="flex flex-col gap-6">
      <WelcomeBanner />
      <SystemStatusCard health={health} isLoading={isLoading} error={error} onRefresh={refresh} />
      <DesignSystemPreview />
    </div>
  );
}
