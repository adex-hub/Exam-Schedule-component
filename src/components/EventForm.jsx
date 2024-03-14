import { Form, Formik } from "formik";
import * as Yup from "yup";
import TextInput from "./TextInput";
import { useCalendar } from "../contexts/CalendarContext";

function EventForm() {
  const {
    events,
    getEvents,
    formOutput,
    onFormData,
    addSubject,
    formActive,
    setFormActive,
    doubleClickedEvent,
    setDoubleClickedEvent,
    updateSubject,
  } = useCalendar();

  // if (!formActive) setDoubleClickedEvent({});

  function increaseTimeByGMTOffset(timeString) {
    const [hoursStr, minutesStr] = timeString.split(":");
    let hours = parseInt(hoursStr, 10);
    let minutes = parseInt(minutesStr, 10);
    const gmtTimeOffset = Math.abs(new Date().getTimezoneOffset() / 60);

    // Add an hour
    hours = (hours + gmtTimeOffset) % 24;

    // Format the new time
    const newTimeString = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;

    return newTimeString;
  }

  function handleSubmit(values, { resetForm }) {
    onFormData(values);
    doubleClickedEvent ? updateSubject(events) : addSubject(formOutput);
    setTimeout(() => {
      getEvents();
    }, 800);
    setFormActive(!formActive);
    resetForm();
    // setDoubleClickedEvent({});
  }

  return (
    // Some more validation needed
    <Formik
      initialValues={{
        courseCode: doubleClickedEvent ? doubleClickedEvent.title : "",
        date: doubleClickedEvent
          ? doubleClickedEvent.start.toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        startTime: doubleClickedEvent
          ? increaseTimeByGMTOffset(
              doubleClickedEvent.start.toISOString().split("T")[1].slice(0, 5)
            )
          : "",
        endingTime: doubleClickedEvent
          ? increaseTimeByGMTOffset(
              doubleClickedEvent.end.toISOString().split("T")[1].slice(0, 5)
            )
          : "",
      }}
      validationSchema={Yup.object({
        courseCode: Yup.string()
          .matches(/^[a-z]{3}\s?\d{3}$/i, "Invalid course code!")
          .required("Your course code is required."),
        date: Yup.string().required("Set a date!"),
        startTime: Yup.string().required("Required"),
        endingTime: Yup.string()
          .test("is-ahead", "Adjust start time", function (value) {
            const { startTime } = this.parent;
            return (
              !startTime ||
              !value ||
              new Date(`1970-01-01 ${value}`) >
                new Date(`1970-01-01 ${startTime}`)
            );
          })
          .required("Required"),
      })}
      onSubmit={handleSubmit}
    >
      <Form className="flex flex-col absolute bg-slate-200 rounded-md p-4 justify-left z-10 right-2 top-[4rem]">
        <TextInput
          label="COURSE CODE"
          name="courseCode"
          type="text"
          placeholder="BEE 101"
        />
        <TextInput label="DATE" name="date" type="date" />
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <TextInput label="START" name="startTime" type="time" />
          </div>

          <div className="flex flex-col">
            <TextInput label="END" name="endingTime" type="time" />
          </div>
        </div>
        <button
          type="submit"
          className="text-[12px] font-medium uppercase bg-black text-white p-2 w-100 rounded-[4px] mt-3"
        >
          {doubleClickedEvent ? "Update" : "Add"}
        </button>
      </Form>
    </Formik>
  );
}

export default EventForm;
