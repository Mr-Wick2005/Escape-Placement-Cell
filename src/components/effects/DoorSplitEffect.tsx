import { useGameStore } from '../../store/gameStore';

interface Props {
  isOpen: boolean;
  children: React.ReactNode;
}

export function DoorSplitEffect({ isOpen, children }: Props): React.ReactNode {
  const reducedMotion = useGameStore((s) => s.settings.reducedMotion);

  if (!isOpen || reducedMotion) {
    return <>{children}</>;
  }

  return (
    <div className="door-split-container">
      <div className="door-split-panel door-split-panel-left" />
      <div className="door-split-panel door-split-panel-right" />
      <div className="door-light-bleed" />
      <div className="door-split-content">{children}</div>
    </div>
  );
}
