import type { Story } from "@/content/story/types";

export const josephBrothersStory: Story = {
  slug: "joseph-brothers",
  title: "Joseph and His Brothers",
  testament: "OT",
  summary:
    "Betrayal, dreams, jealousy, and redemption as Joseph rises from slavery to become a ruler in Egypt.",
  heroMedia: {
    type: "image",
    src: "/story-media/joseph-brothers/hero.png",
    alt: "Joseph in Egypt after years of hardship",
    caption: "What others intended for harm, God used for rescue.",
  },
  sources: [{ label: "Genesis 37-50", href: "/books/genesis/37" }],
  blocks: [
    {
      type: "text",
      heading: "From Pit to Palace",
      body: "Joseph is sold by his brothers and taken to Egypt. Through slavery, false accusation, and imprisonment, God remains with him and opens a path to leadership.",
    },
    {
      type: "image",
      src: "/story-media/joseph-brothers/hero.png",
      alt: "Joseph in Egypt after years of hardship",
      caption: "What others intended for harm, God used for rescue.",
    },
    {
      type: "quote",
      text: "You intended to harm me, but God intended it for good to accomplish what is now being done, the saving of many lives.",
      attribution: "Genesis 50:20",
    },
    {
      type: "text",
      heading: "Reconciliation and Rescue",
      body: "When famine strikes, Joseph's brothers come to Egypt for grain. Joseph reveals himself, forgives them, and preserves his family during crisis.",
    },
    {
      type: "scripture",
      label: "Read Genesis 37",
      href: "/books/genesis/37",
      excerpt:
        "Start with Joseph's dreams, family conflict, and the turning point that sends him to Egypt.",
    },
  ],
};
