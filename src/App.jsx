import MyCalendar from "./components/Calendar";
import { CalendarProvider } from "./contexts/CalendarContext";

function App() {
  return (
    <div>
      <CalendarProvider>
        <MyCalendar />
      </CalendarProvider>
    </div>
  );
}

export default App;
