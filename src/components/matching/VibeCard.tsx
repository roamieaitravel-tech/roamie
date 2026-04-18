"use client";

interface VibeCardProps {
  name: string;
  vibeTags: string[];
  score: number;
  tripsCount: number;
  onEdit: () => void;
}

const getAvatarLabel = (name: string) => {
  return name
    .split(" ")
    .slice(0, 2)
    .map((segment) => segment.charAt(0).toUpperCase())
    .join("");
};

export default function VibeCard({ name, vibeTags, score, tripsCount, onEdit }: VibeCardProps): React.JSX.Element {
  const visibleTags = vibeTags.slice(0, 4);

  return (
    <div className="rounded-[2rem] bg-gradient-to-r from-[#004E89] to-[#003A6B] p-6 text-white shadow-xl">
      <div className="grid gap-6 lg:grid-cols-[280px_1fr_220px] lg:items-center">
        <div className="flex items-center gap-4">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-700 text-3xl font-bold">
            {getAvatarLabel(name)}
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-orange-200">Your Travel Vibe</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight">{name}</h2>
          </div>
        </div>

        <div>
          <div className="flex flex-wrap gap-3">
            {visibleTags.map((tag) => (
              <span key={tag} className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-white/10 bg-white/10 p-5 text-center">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-200">Vibe Score</p>
          <p className="mt-3 text-5xl font-semibold text-orange-300">{score}/100</p>
          <p className="mt-2 text-sm text-slate-200">Based on {tripsCount} trips</p>
          <button
            type="button"
            onClick={onEdit}
            className="mt-4 inline-flex rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/15"
          >
            Edit Vibe
          </button>
        </div>
      </div>
    </div>
  );
}
