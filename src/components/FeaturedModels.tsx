"use client";

const contestants = [
  { id: "001", tag: "#ArabFashionCouncil", votes: 238 },
  { id: "002", tag: "#DubaiFashionWeek", votes: 120 },
  { id: "003", tag: "#ArabFashionInnovation", votes: 200 },
  { id: "004", tag: "#Creativity", votes: 42 },
  { id: "005", tag: "#ArabFashionHeritage", votes: 62 },
  { id: "006", tag: "#CulturalCouture", votes: 96 },
  { id: "007", tag: "#ArabFashionTrends", votes: 176 },
  { id: "008", tag: "#ArabFashionista", votes: 63 },
];

export default function FeaturedModels({ onVote }: { onVote: () => void }) {
  return (
    <section className="flex flex-wrap justify-center gap-5 p-4">
      {contestants.map((c) => (
        <div
          key={c.id}
          className="border border-[#ccc] rounded-[10px] shadow-sm w-[250px] p-5 text-center transition-transform hover:scale-105 bg-white">
          <img
            src={`/img/contestant${c.id}.jpg`}
            alt="Profile"
            className="rounded-full w-[150px] h-[150px] object-cover mx-auto mb-2"
          />
          <div className="my-2">
            <span className="bg-[#952370] text-white py-1 px-3 rounded-full text-[12px]">
              {c.tag}
            </span>
          </div>
          <div className="text-[14px] font-bold text-[#444] my-2 bg-[#f1f1f1] py-1 px-3 rounded-lg inline-block">
            Votes: {c.votes}
          </div>
          <button
            onClick={onVote}
            className="bg-[#007bff] text-white rounded-[5px] py-2 px-5 w-full hover:bg-[#0056b3] transition-colors cursor-pointer">
            Vote
          </button>
        </div>
      ))}
    </section>
  );
}
