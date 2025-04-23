import MultiSelect from "./components/multiSelect/MultiSelect";
import styles from "./App.module.scss";

const App = () => {
  return (
    <div className={styles.mainPage}>
      <MultiSelect options={[{ label: 'Education', value: '1' }, { label: 'Art', value: '2' }, { label: 'Sport', value: '3' }]} />
    </div>
  );
};

export default App;
