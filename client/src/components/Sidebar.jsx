export default function Sidebar({ mode, setMode }) {
  const modes = ["Auto", "Explain", "Debug", "Refactor"];

  return (
    <div className="w-64 bg-gray-800 p-4">
      <h1 className="text-xl font-bold mb-6">NeuraCode</h1>

      <ul>
        {modes.map((item) => (
          <li
            key={item}
            onClick={() => setMode(item)}
            className={`p-2 rounded cursor-pointer ${
              mode === item ? "bg-blue-600" : "hover:bg-gray-700"
            }`}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
