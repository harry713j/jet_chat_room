const randColors = ["blue", "orange", "red", "yellow"];
const randIndex = Math.floor(Math.random() * randColors.length);

export function ProfilePicture({ name }: { name: string }) {
  return (
    <div
      className={`bg-${randColors[randIndex]}-700 rounded-full w-[7rem] h-[7rem] `}
    >
      <p className="text-slate-200 text-4xl">{name?.charAt(0).toUpperCase()}</p>
    </div>
  );
}
