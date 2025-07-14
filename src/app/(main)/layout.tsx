import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import MenuBar from "./MenuBar";
import Navbar from "./Navbar";
import SessionProvider from "./SessionProvider";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await validateRequest();

  if (!session.user) redirect("/home");

  return (
    <SessionProvider value={session}>
      <div className="flex min-h-screen flex-col border-x border-border/50 bg-background">
        <Navbar />
        <div className="mx-auto flex w-full max-w-7xl grow gap-5 border-x border-border/30 p-5">
          <MenuBar className="sticky top-[5.25rem] hidden h-fit flex-none space-y-3 rounded-2xl border border-border/20 bg-card p-5 shadow-sm sm:block xl:w-80" />
          <div className="flex-1 border border-l border-border/20 pl-5">
            {children}
          </div>
        </div>
        <MenuBar className="sticky bottom-0 flex w-full justify-center gap-5 border-t border-border/50 bg-card p-3 sm:hidden" />
      </div>
    </SessionProvider>
  );
}
