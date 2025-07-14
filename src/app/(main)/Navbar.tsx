import SearchField from "@/components/SearchField";
import UserButton from "@/components/UserButton";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-lg backdrop-saturate-150">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5 px-5 py-3">
        <Link
          href="/"
          className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-2xl font-bold text-transparent"
        >
          Social App
        </Link>
        <div className="max-w-2xl flex-1 px-4">
          <SearchField />
        </div>
        <div className="flex items-center gap-3">
          <UserButton />
        </div>
      </div>
    </header>
  );
}
