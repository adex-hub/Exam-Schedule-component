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
    setSelectedEvent,
    setFormActive,
  } = useCalendar();

  useEffect(() => {
    getEvents();
  }, []);

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setFormActive(true);
  };

  return (
    <div className="myCustomHeight text-xs sm:text-sm md:text-base">
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
