import { useSession } from '@/context/SessionContext';
import SessionSetup from '@/components/interview/SessionSetup';

export default function Home() {
  const { startSession } = useSession();
  return <SessionSetup onStart={startSession} />;
}
