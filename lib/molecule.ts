import { useSyncExternalStore } from "react";

type Enzyme<State, Action> = (s: State, a: Action) => State;

export function synthesize<State, Action>(
  initialState: State,
  reducer: Enzyme<State, Action>
) {
  const m = new Molecule(initialState, reducer);

  function useMolecule(): [State, (a: Action) => void];
  function useMolecule<T>(selector?: (s: State) => T): [T, (a: Action) => void];

  function useMolecule<T>(selector?: (s: State) => T): unknown {
    return [
      useSyncExternalStore(
        m.subscribe.bind(m),
        () => (selector ? selector(m.getState()) : m.getState()),
        () => (selector ? selector(m.getState()) : m.getState())
      ),
      m.dispatch.bind(m),
    ];
  }

  return {
    useMolecule,
    useDispatch() {
      return m.dispatch.bind(m);
    },
  };
}

class Molecule<State, Action> {
  atom: State;
  enzyme: Enzyme<State, Action>;
  listeners = new Set<() => void>();

  constructor(s: State, e: Enzyme<State, Action>) {
    this.atom = s;
    this.enzyme = e;
  }

  getState(): State {
    return this.atom;
  }

  dispatch(a: Action): void {
    this.atom = this.enzyme(this.atom, a);
    for (const l of this.listeners) {
      l();
    }
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}
