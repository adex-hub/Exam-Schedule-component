import { useField } from "formik";

function TextInput({ label, ...props }) {
  // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
  // which we can spread on <input>. We can use field meta to show an error
  // message if the field is invalid and it has been touched (i.e. visited)
  const [field, meta] = useField(props);
  return (
    <>
      <label
        className="text-[12px] font-medium leading-7"
        htmlFor={props.id || props.name}
      >
        {label}
      </label>
      <input
        className="rounded-sm mb-[4px] focus:outline-none"
        {...field}
        {...props}
      />
      {meta.touched && meta.error ? (
        <div className="text-red-600 text-[11px]">{meta.error}</div>
      ) : null}
    </>
  );
}

export default TextInput;
