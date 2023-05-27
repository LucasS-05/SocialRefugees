export default function Input({ type, id, name, placeholder, required=true }) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-md sm:text-lg font-semibold leading-6 text-gray-900"
      >
        {name}
      </label>
      <div className="relative mt-2 sm:mt-4 rounded-md shadow-sm">
        <input
          type={type}
          name={name}
          id={id}
          className="block shadow-sm w-full rounded-xl px-4 sm:px-6 border-0 py-2 sm:py-4 pr-10 ring-1 text-gray-900 ring-inset ring-gray-300 text-sm sm:text-lg sm:leading-6"
          placeholder={placeholder}
          autocomplete="email"
          required={required? true : false}
          aria-invalid="true"
          aria-describedby="email-error"
        />
      </div>
    </div>
  );
}
