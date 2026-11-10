import { useEffect, useState } from 'react';
import { useGameStore } from '../../store/gameStore';

interface Props {
  letter: 'A' | 'B' | 'C';
  code: string;
  onComplete?: () => void;
}

export function FragmentFlyer({ letter, code, onComplete }: Props): React.ReactNode {
  const reducedMotion = useGameStore((s) => s.settings.reducedMotion);
  const [visible, setVisible] = useState(!reducedMotion);

  useEffect(() => {
    if (reducedMotion) {
      onComplete?.();
      return;
    }

    const timer = setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, 900);

    return () => clearTimeout(timer);
  }, [reducedMotion, onComplete]);

  if (!visible || reducedMotion) return null;

  return (
    <div className="fragment-flying" aria-hidden="true">
      <span className="fragment-badge">{letter}: {code}</span>
    </div>
  );
}
