import { createContext } from "react";
import moment from "moment";
import { Calendar, momentLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import { useCallback, useEffect, useState, useContext } from "react";

const CalendarContext = createContext();

const BASE_URL = "http://localhost:8000";

function CalendarProvider({ children }) {
  const [events, setEvents] = useState([]);
  const [formData, setFromData] = useState(null);
  const [formOutput, setFromOutput] = useState(null);
  const [formActive, setFormActive] = useState(false);
  const [doubleClickedEvent, setDoubleClickedEvent] = useState({});
  const DnDCalendar = withDragAndDrop(Calendar);
  const localizer = momentLocalizer(moment); // or globalizeLocalizer

  useEffect(() => {
    if (formData) {
      setFromOutput({
        start: `${formData.date}T${formData.startTime}`,
        end: `${formData.date}T${formData.endingTime}`,
        isDraggable: true,
        title: `${formData.courseCode}`, // I am honestly considering changing title to courseCode.
        id: crypto.randomUUID(),
      });
    }
  }, [formData]);

  const getEvents = useCallback(async function () {
    const res = await fetch(`${BASE_URL}/subjects`);
    const data = await res.json();

    const formattedData = data.map((event) => ({
      ...event,
      start: moment(event.start).toDate(),
      end: moment(event.end).toDate(),
    }));

    setEvents(formattedData);
  }, []);

  async function serverUpdate({
    event,
    start,
    end,
    allDay,
    isDraggable,
    title,
  }) {
    try {
      const res = await fetch(`${BASE_URL}/subjects/${event.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ start, end, allDay, isDraggable, title }),
      });
      const data = res.json();
      return data;
    } catch (err) {
      console.error(`Error in updating event movement ${err}`);
    }
  }

  async function addSubject(formOutput) {
    try {
      const res = await fetch(`${BASE_URL}/subjects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formOutput),
      });
      const data = res.json();
      return data;
    } catch (error) {
      console.error(`There was an error adding a subject`);
    }
  }

  // Would do a slight fix to EventForm later
  async function updateSubject(events, doubleClicked = doubleClickedEvent) {
    const eventForUpdate = events.find(
      (event) => event.id === doubleClicked.id
    );
    console.log(eventForUpdate);

    try {
      const res = await fetch(`${BASE_URL}/subjects/${eventForUpdate.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...eventForUpdate,
          start: formOutput.start,
          end: formOutput.end,
          title: formOutput.title,
        }),
      });
      const data = res.json();
      return data;
    } catch (err) {
      console.error(`Cannot update just yet ${err}`);
    }
  }

  const moveEvent = useCallback(
    ({ event, start, end, isAllDay: droppedOnAllDaySlot = false }) => {
      const { allDay, isDraggable, title } = event;
      if (!allDay && droppedOnAllDaySlot) {
        event.allDay = true;
      }

      serverUpdate({
        event,
        start,
        end,
        allDay,
        isDraggable,
        title,
      });

      // Update the UI with the event movement
      setEvents((prev) => {
        const existingIndex = prev.findIndex((ev) => ev.id === event.id);

        if (existingIndex === -1) return prev;

        const updatedEvents = [...prev];
        updatedEvents[existingIndex] = { ...event, start, end, allDay };
        return updatedEvents;
      });
    },
    [setEvents]
  );

  const resizeEvent = useCallback(({ event, start, end }) => {
    const { allDay, title, isDraggable } = event;

    serverUpdate({
      event,
      start,
      end,
      allDay,
      isDraggable,
      title,
    });

    // Updating the UI on resize.
    setEvents((prev) => {
      const existing = prev.find((ev) => ev.id === event.id) ?? {};
      const filtered = prev.filter((ev) => ev.id !== event.id);
      return [...filtered, { ...existing, start, end }];
    });
  }, []);

  return (
    <CalendarContext.Provider
      value={{
        DnDCalendar,
        localizer,
        events,
        formOutput,
        formActive,
        doubleClickedEvent,
        setDoubleClickedEvent,
        setFormActive,
        getEvents,
        moveEvent,
        resizeEvent,
        addSubject,
        updateSubject,
        onFormData: setFromData,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
}

function useCalendar() {
  const context = useContext(CalendarContext);
  if (context === undefined)
    throw new Error("CalendarContext was used outside of CalendarProvider");
  return context;
}

export { CalendarProvider, useCalendar };
