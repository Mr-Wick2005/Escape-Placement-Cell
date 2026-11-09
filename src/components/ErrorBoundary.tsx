import { Component, type ErrorInfo, type ReactNode } from 'react';
import { useGameStore } from '../store/gameStore';

interface Props { children: ReactNode }
interface State { failed: boolean }
export class ErrorBoundary extends Component<Props, State> {
  state: State = { failed: false };
  static getDerivedStateFromError(): State { return { failed: true }; }
  componentDidCatch(error: Error, info: ErrorInfo): void { console.error('Screen failed safely', error, info); }
  render(): ReactNode { return this.state.failed ? <SignalLost /> : this.props.children; }
}
function SignalLost(): ReactNode { const reset = useGameStore((s) => s.reset); return <main className="signal-lost"><p>Signal lost. Your last valid save is safe.</p><button onClick={reset}>Return to title</button></main>; }
