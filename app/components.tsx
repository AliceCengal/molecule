"use client";

import {
  CounterStore,
  useCounterDispatch,
  useCounterMolecule,
} from "../store/counter-store";
import { useAgendaDispatch, useAgendaMolecule } from "../store/agenda-store";

import style from "./Home.module.css";
import { useState } from "react";

export type Itemed = {
  item: keyof CounterStore;
};

export function DisplayValue({ item }: Itemed) {
  const [counter] = useCounterMolecule((cs) => cs[item]);
  return (
    <div>
      {item}: {counter}
    </div>
  );
}

export function IncrementValue({ item }: Itemed) {
  const dispatch = useCounterDispatch();
  return (
    <button
      onClick={(e) => {
        dispatch({ type: "increment", which: item });
      }}
    >
      Increment {item}
    </button>
  );
}

export function DecrementValue({ item }: Itemed) {
  const dispatch = useCounterDispatch();
  return (
    <button
      onClick={(e) => {
        dispatch({ type: "decrement", which: item });
      }}
    >
      Decrement {item}
    </button>
  );
}

export function AgendaControl() {
  const dispatch = useAgendaDispatch();
  const [text, setText] = useState("");
  return (
    <div className={style.beam}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={(e) => dispatch({ type: "add_task", title: text })}>
        Add
      </button>
    </div>
  );
}

export function AgendaList() {
  const [agendaLength] = useAgendaMolecule((s) => s.length);
  return (
    <div>
      {Array(agendaLength)
        .fill(1)
        .map((t, ix) => (
          <AgendaRow ix={ix} key={ix} />
        ))}
    </div>
  );
}

function AgendaRow({ ix }: { ix: number }) {
  const [task, dispatch] = useAgendaMolecule((s) => s[ix]);

  function toggleDone() {
    if (task.done)
      dispatch({
        type: "task_undone",
        ix,
      });
    else
      dispatch({
        type: "task_done",
        ix,
      });
  }

  function deleteTask() {
    dispatch({ type: "remove_task", ix });
  }

  return (
    <div className={style.task_row}>
      <span className={task.done ? style.task_done : ""}>{task.title}</span>
      <button onClick={toggleDone}>/</button>
      <button onClick={deleteTask}>X</button>
    </div>
  );
}
