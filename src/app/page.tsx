"use client";
import { useState } from "react";
import Hero from "@/components/Hero";
import FeaturedModels from "@/components/FeaturedModels";
import VotingModal from "@/components/VotingModal";

export default function Home() {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <div className="block m-0 p-0 overflow-x-hidden">
      <Hero onVote={() => setModalOpen(true)} />

      <div className="legacy-blue-bar">
        <h2>Arab Fashion Council</h2>
      </div>

      <div className="news-paragraph">
        <p>
          Are you ready to immerse yourself in a world of style, culture, and
          innovation? The Arab Fashion Council is your gateway to the
          captivating realm of Arab fashion. We invite you to join us on a
          journey where tradition meets modernity, and where fashion becomes a
          powerful expression of identity.
        </p>
      </div>

      <div className="news-paragraph text-center">
        <p className="inline-block w-full text-center">
          Vote for Excellence. Vote for Diversity. Vote for Arab Fashion
          Council!
        </p>
      </div>

      <div className="legacy-blue-bar">
        <h2>📢 How to Vote:</h2>
      </div>

      <div className="news-paragraph space-y-2 !text-left">
        <p>#1 Each influencer has a unique hashtag on our social media page.</p>
        <p>#2 Click the vote button</p>
        <p>
          #3 Voting Deadline: Voting is open until December. Don't miss the
          chance to support your favorite influencer!
        </p>
      </div>

      <div className="legacy-blue-bar !justify-center">
        <h2 className="!m-0">Meet Our Contestants</h2>
      </div>

      <div className="py-4">
        <FeaturedModels onVote={() => setModalOpen(true)} />
      </div>

      {isModalOpen && (
        <VotingModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
      )}
    </div>
  );
}
