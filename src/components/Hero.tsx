"use client";

export default function Hero({ onVote }: { onVote: () => void }) {
  return (
    <header className="flex flex-col items-center w-full">
      <img src="/img/slide.png" className="w-full h-auto" alt="Banner" />
      <div className="py-6 flex justify-center w-full">
        <button onClick={onVote} className="vote2-button">
          Click Here To Vote
        </button>
      </div>
    </header>
  );
}
