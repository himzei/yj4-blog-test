export default function Input({ name, errors = [], ...rest }) {
  return (
    <div>
      <input
        className="bg-transparent rounded-md w-full h-10 focus:outline-none ring-1 focus:ring-2 ring-neutral-200 focus:ring-orange-500 border-none placeholder:text-neutral-400 px-4"
        name={name}
        {...rest}
      />
      <div className="flex flex-col">
        {errors.map((error, index) => (
          <span className="text-red-500 font-medium" key={index}>
            {error}
          </span>
        ))}
      </div>
    </div>
  );
}
