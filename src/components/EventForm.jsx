import { Form, Formik } from "formik";
import * as Yup from "yup";
import TextInput from "./TextInput";
import { useCalendar } from "../contexts/CalendarContext";

function EventForm() {
  const {
    getEvents,
    formValueFormatter,
    addSubject,
    formActive,
    setFormActive,
  } = useCalendar();

  function handleSubmit(values, { resetForm }) {
    addSubject(formValueFormatter(values));
    setTimeout(() => {
      getEvents();
    }, 800);
    setFormActive(!formActive);
    resetForm();
  }

  return (
    // Some more validation needed
    <Formik
      initialValues={{
        courseCode: "",
        date: "",
        startTime: "",
        endingTime: "",
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
          Add
        </button>
      </Form>
    </Formik>
  );
}

export default EventForm;
