import { synthesize } from "../lib/molecule";

export type CounterStore = {
  alpha: number;
  beta: number;
};

type CounterAction =
  | { type: "increment"; which: keyof CounterStore }
  | { type: "decrement"; which: keyof CounterStore };

export const {
  useMolecule: useCounterMolecule,
  useDispatch: useCounterDispatch,
} = synthesize<CounterStore, CounterAction>(
  {
    alpha: 0,
    beta: 0,
  },
  (s, a) => {
    switch (a.type) {
      case "increment": {
        return {
          ...s,
          [a.which]: s[a.which] + 1,
        };
      }
      case "decrement": {
        return {
          ...s,
          [a.which]: s[a.which] - 1,
        };
      }
    }
  },
  (a) => {
    console.log(a);
    return a;
  }
);
