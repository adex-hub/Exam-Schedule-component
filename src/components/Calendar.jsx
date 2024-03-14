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
    // setFormActive,
    moveEvent,
    resizeEvent,
    // doubleClickedEvent,
    // setDoubleClickedEvent,
  } = useCalendar();

  useEffect(() => {
    getEvents();
  }, []);

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
        // onDoubleClickEvent={(event) => {
        //   setDoubleClickedEvent(event);
        //   doubleClickedEvent ? setFormActive(true) : setFormActive(false);
        // }}
        views={["week"]}
      />
    </div>
  );
}

// Finding a way to put each event value as a default initial value.
