import {
  AgendaControl,
  AgendaList,
  DecrementValue,
  DisplayValue,
  IncrementValue,
} from "./components";
import styles from "./Home.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.beam}>
        <IncrementValue item="alpha" />
        <DecrementValue item="alpha" />
        <DisplayValue item="alpha" />
      </div>
      <div className={styles.beam}>
        <IncrementValue item="beta" />
        <DecrementValue item="beta" />
        <DisplayValue item="beta" />
      </div>
      <div>&emsp;</div>
      <AgendaControl />
      <AgendaList />
    </main>
  );
}
