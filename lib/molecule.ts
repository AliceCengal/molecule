import { useSyncExternalStore } from "react";

type Enzyme<State, Action> = (s: State, a: Action) => State;
type Dispatch<Action> = (a: Action) => void;
type Cofactor<Action> = (a: Action) => Action;

export function synthesize<State, Action>(
  initialState: State,
  reducer: Enzyme<State, Action>,
  ...middlewares: Cofactor<Action>[]
) {
  const m = new Molecule(initialState, reducer, middlewares);

  return {
    useMolecule<T>(selector: (s: State) => T): [T, Dispatch<Action>] {
      return [
        useSyncExternalStore(
          m.subscribe.bind(m),
          () => selector(m.getState()),
          () => selector(m.getState())
        ),
        m.dispatch.bind(m),
      ];
    },
    useDispatch(): Dispatch<Action> {
      return m.dispatch.bind(m);
    },
    useMacromolecule(): [State, Dispatch<Action>] {
      return [
        useSyncExternalStore(
          m.subscribe.bind(m),
          m.getState.bind(m),
          m.getState.bind(m)
        ),
        m.dispatch.bind(m),
      ];
    },
  };
}

class Molecule<State, Action> {
  atom: State;
  enzyme: Enzyme<State, Action>;
  cofactors: Cofactor<Action>[];
  listeners = new Set<() => void>();

  constructor(s: State, e: Enzyme<State, Action>, co?: Cofactor<Action>[]) {
    this.atom = s;
    this.enzyme = e;
    this.cofactors = co || [];
  }

  getState(): State {
    return this.atom;
  }

  dispatch(a: Action): void {
    this.atom = this.enzyme(
      this.atom,
      this.cofactors.reduce((aa, bb) => bb(aa), a)
    );
    for (const l of this.listeners) {
      l();
    }
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}
