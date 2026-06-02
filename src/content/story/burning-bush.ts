import type { Story } from "@/content/story/types";

export const burningBushStory: Story = {
  slug: "burning-bush",
  title: "The Burning Bush",
  testament: "OT",
  summary:
    "Moses encounters a bush that burns but is not consumed, receiving his divine mission to lead Israel out of slavery.",
  heroMedia: {
    type: "image",
    src: "/story-media/burning-bush/hero.png",
    alt: "Moses before the burning bush",
    caption: "God calls Moses and reveals His name.",
  },
  sources: [{ label: "Exodus 3", href: "/books/exodus/3" }],
  blocks: [
    {
      type: "text",
      heading: "A Holy Encounter",
      body: "While tending sheep near Horeb, Moses sees a bush on fire that is not consumed. God calls him by name and commands him to remove his sandals, for the place is holy ground.",
    },
    {
      type: "image",
      src: "/story-media/burning-bush/hero.png",
      alt: "Moses before the burning bush",
      caption: "God calls Moses and reveals His name.",
    },
    {
      type: "quote",
      text: "I have indeed seen the misery of my people in Egypt. I have heard them crying out because of their slave drivers.",
      attribution: "Exodus 3:7",
    },
    {
      type: "text",
      heading: "Called to Deliver",
      body: "God sends Moses to Pharaoh and reveals His covenant name. What begins as fear and hesitation becomes a mission to confront oppression and lead Israel toward freedom.",
    },
    {
      type: "scripture",
      label: "Read Exodus 3",
      href: "/books/exodus/3",
      excerpt: "Read the call of Moses and God's promise to be with him.",
    },
  ],
};
