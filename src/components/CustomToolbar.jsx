import { useState } from "react";
// import styles from "./CustomToolbar.module.css";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import EventForm from "./EventForm";
import { useCalendar } from "../contexts/CalendarContext";

export default function CustomToolbar({ label, onNavigate }) {
  const { formActive, setFormActive, formOutput } = useCalendar();

  return (
    <div className="flex justify-between p-4 ">
      <div className="flex border border-gray-500 bg-white rounded-md">
        <button
          className="border-r border-gray-500"
          onClick={() => onNavigate("PREV")}
        >
          <IoChevronBack />
        </button>
        <button
          className="px-2 hover:bg-gray-100 duration-200"
          onClick={() => onNavigate("TODAY")}
        >
          Today
        </button>
        <button
          className="border-l border-gray-500"
          onClick={() => onNavigate("NEXT")}
        >
          <IoChevronForward />
        </button>
      </div>
      <div onClick={() => console.log(formOutput)}>{label}</div>
      <button
        onClick={() => setFormActive(!formActive)}
        className={
          formActive
            ? "text-md text-red-600 font-semibold min-w-[108px] border-red-700 pl-[64px]"
            : "text-md text-blue-600 font-semibold min-w-[108px] border-red-700"
        }
      >
        {formActive ? "Close" : "Add Schedule"}
      </button>
      {formActive ? <EventForm /> : null}
    </div>
  );
}
