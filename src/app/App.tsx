import { ErrorBoundary } from '../components/ErrorBoundary';
import { lazy, Suspense } from 'react';
import { useGameStore } from '../store/gameStore';
import type { Screen } from '../store/gameTypes';
import { audioManager } from '../audio/AudioManager';
import { GameHud } from '../components/hud/GameHud';
import { STORY } from '../content/story';
import { HubScreen } from '../screens/HubScreen';
import { IntroScreen } from '../screens/IntroScreen';
import { AptitudeScreen } from '../screens/AptitudeScreen';
import { CodingScreen } from '../screens/CodingScreen';
import { InterviewScreen } from '../screens/InterviewScreen';
import { FinalGateScreen } from '../screens/FinalGateScreen';
import { EndingScreen } from '../screens/EndingScreen';
import { ReportScreen } from '../screens/ReportScreen';

const TitleDoor = lazy(async () => {
  const module = await import('../components/title/TitleDoor');
  return { default: module.TitleDoor };
});

function TitleScreen(): React.ReactNode {
  return (
    <main className="title-screen">
      <Suspense fallback={<div className="door-fallback" aria-hidden="true" />}>
        <TitleDoor />
      </Suspense>
      <p className="eyebrow">NEXUS TECHNOLOGIES // CAMPUS DRIVE</p>
      <h1>{STORY.title.name}</h1>
      <p className="tagline">{STORY.title.tagline}</p>
      <TitleActions />
    </main>
  );
}

function TitleActions() {
  const begin = useGameStore((s) => s.beginGame);
  const settings = useGameStore((s) => s.settings);
  const saved = useGameStore((s) => s.startedAt !== null);
  const reset = useGameStore((s) => s.reset);

  const enter = () => {
    audioManager.unlock(settings);
    audioManager.play('uiClick');
    begin();
  };

  const fresh = () => {
    audioManager.play('uiBack');
    if (window.confirm('Start a new game? Current progress will be replaced.')) {
      reset();
    }
  };

  return (
    <div className="actions">
      {saved && <button type="button" onClick={enter}>Continue</button>}
      <button type="button" onClick={enter}>Enter the building</button>
      {saved && (
        <button type="button" className="secondary" onClick={fresh}>
          New game
        </button>
      )}
    </div>
  );
}

function ActiveScreen({ screen }: { screen: Screen }): React.ReactNode {
  if (screen === 'TITLE') return <TitleScreen />;
  return (
    <>
      <GameHud />
      {screen === 'INTRO' ? (
        <IntroScreen />
      ) : screen === 'HUB' ? (
        <HubScreen />
      ) : screen === 'APTITUDE' ? (
        <AptitudeScreen />
      ) : screen === 'CODING' ? (
        <CodingScreen />
      ) : screen === 'INTERVIEW' ? (
        <InterviewScreen />
      ) : screen === 'FINAL' ? (
        <FinalGateScreen />
      ) : screen === 'ENDING' ? (
        <EndingScreen />
      ) : screen === 'REPORT' ? (
        <ReportScreen />
      ) : null}
    </>
  );
}

export default function App() {
  const screen = useGameStore((s) => s.screen);
  return (
    <ErrorBoundary>
      <div className={screen === 'TITLE' ? 'game-shell title-shell' : 'game-shell'}>
        <ActiveScreen screen={screen} />
      </div>
    </ErrorBoundary>
  );
}
