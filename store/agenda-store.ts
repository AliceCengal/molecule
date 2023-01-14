import { synthesize } from "../lib/molecule";

export type Task = { title: string; done: boolean };

export type Agenda = Task[];

export type AgendaAction =
  | { type: "add_task"; title: string }
  | { type: "edit_task"; ix: number; title: string }
  | { type: "remove_task"; ix: number }
  | { type: "task_done"; ix: number }
  | { type: "task_undone"; ix: number }
  | { type: "clear" };

export const {
  useMolecule: useAgendaMolecule,
  useDispatch: useAgendaDispatch,
} = synthesize<Agenda, AgendaAction>([], (s, a) => {
  switch (a.type) {
    case "add_task":
      return s.some((t) => t.title === a.title)
        ? s.concat({ title: a.title + " " + Date.now(), done: false })
        : s.concat({ title: a.title, done: false });
    case "edit_task":
      return s.map((t, ix) =>
        ix === a.ix ? { title: a.title, done: t.done } : t
      );
    case "remove_task":
      return s.filter((t, ix) => ix !== a.ix);
    case "task_done":
      return s.map((t, ix) =>
        ix === a.ix ? { title: t.title, done: true } : t
      );
    case "task_undone":
      return s.map((t, ix) =>
        ix === a.ix ? { title: t.title, done: false } : t
      );
    case "clear":
      return [];
  }
});
