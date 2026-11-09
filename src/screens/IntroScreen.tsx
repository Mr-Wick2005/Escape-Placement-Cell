import { useEffect, useState } from 'react';
import { STORY } from '../content/story';
import { useGameStore } from '../store/gameStore';

export function IntroScreen(): React.ReactNode { const [line, setLine] = useState(0); const [skipped, setSkipped] = useState(false); const transition = useGameStore((s) => s.transition); const text = STORY.intro[line]; useEffect(() => { if (skipped || line === STORY.intro.length - 1) return; const timeout = window.setTimeout(() => setLine((current) => current + 1), 2400); return () => window.clearTimeout(timeout); }, [line, skipped]); return <main className="intro-screen"><div className="intro-copy" aria-live="polite"><p className="eyebrow">INCOMING TRANSMISSION</p><p className="story-line">{skipped ? STORY.intro.at(-1) : text}</p></div><div className="intro-actions"><button className="secondary" onClick={() => setSkipped(true)}>Skip transmission</button><button onClick={() => transition('HUB')}>Proceed to lobby</button></div></main>; }
