import { Museum } from "@/components/museum/Museum";
import { exhibits } from "@/content/exhibits";
import { articles } from "@/content/articles";
import { artworks } from "@/content/art";
import { publicBooks } from "@/content/books";
import { timeline } from "@/content/timeline";

export default function Home() {
  return (
    <Museum
      ventures={exhibits}
      writing={articles}
      art={artworks}
      books={publicBooks}
      timeline={timeline}
    />
  );
}
