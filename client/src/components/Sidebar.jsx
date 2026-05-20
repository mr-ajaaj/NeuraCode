export default function Sidebar() {
  const modes = ["Auto", "Explain", "Debug", "Refactor"];

  return (
    <div className="w-64 bg-gray-800 p-4">
      <h1 className="text-xl font-bold mb-6">NeuraCode</h1>

      <ul>
        {modes.map((mode) => (
          <li
            key={mode}
            className="p-2 rounded hover:bg-gray-700 cursor-pointer"
          >
            {mode}
          </li>
        ))}
      </ul>
    </div>
  );
}
