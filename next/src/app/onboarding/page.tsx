import type { Metadata } from 'next';
import OnboardingView from './OnboardingView';

export const metadata: Metadata = {
  title: 'Angsflow - Onboarding',
  description: 'Mulai pengalaman Angsflow dengan memilih mode penggunaan yang sesuai.'
};

export default function Page() {
  return <OnboardingView />;
}
