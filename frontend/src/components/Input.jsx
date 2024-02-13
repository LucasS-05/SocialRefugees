export default function Input({ type, id, name, placeholder, required = true, onChange }) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm sm:text-base font-semibold leading-6 text-gray-900"
      >
        {name}
      </label>
      <div className="relative mt-2 sm:mt-4 rounded-md shadow-sm">
        <input
          type={type}
          name={name}
          id={id}
          onChange={onChange}
          className="block shadow-sm w-full rounded-xl px-4 sm:px-4 border-0 py-2 sm:py-2.5 pr-10 ring-1 text-gray-900 ring-inset ring-gray-300 text-sm sm:text-base sm:leading-6"
          placeholder={placeholder}
          required={required ? true : false}
        />
      </div>
    </div>
  );
}
