import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "../cal-style.scss";
import { useCalendar } from "../contexts/CalendarContext";
import CustomToolbar from "./CustomToolbar";
import { useEffect } from "react";

export default function MyCalendar() {
  const {
    DnDCalendar,
    localizer,
    events,
    getEvents,
    moveEvent,
    resizeEvent,
    selectedEvent,
    setSelectedEvent,
    setFormActive,
  } = useCalendar();

  useEffect(() => {
    getEvents();
  }, []);

  //THINGS I WANNA DO WHEN SELECT AN EVENT.
  // 1) GET EACH INFO INTO THE FORM (GOT A GOOD IDEA OF HOW TO DO THIS)
  // 2) RENDER A DELETE BUTTON AND ENSURE THAT IT WORKS
  // LET'S GET INTO IT.

  const handleSelectEvent = (event) => {
    // Conversion to regular event...
    setSelectedEvent(event); // I'd later convert it to a regular event, I just wanna confirm that DELETE works first.
    // I may make the form visible in anther component. I wanna try something really quick
    setFormActive(true);
  };

  return (
    <div className="myCustomHeight">
      <DnDCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        components={{
          toolbar: CustomToolbar,
        }}
        formats={{ timeGutterFormat: "HH:mm" }}
        defaultView="week"
        draggableAccessor={"isDraggable"}
        onEventDrop={moveEvent}
        onEventResize={resizeEvent}
        onSelectEvent={handleSelectEvent}
        views={["week"]}
      />
    </div>
  );
}

// Finding a way to put each event value as a default initial value.
