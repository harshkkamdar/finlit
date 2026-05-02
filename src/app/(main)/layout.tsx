import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Chapter from "@/models/Chapter";
import AppShell from "@/components/layout/AppShell";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  await dbConnect();

  const [dbUser, chapters] = await Promise.all([
    User.findById(session.user.id)
      .select("name email xp currentStreak avatarSeed league chaptersCompleted")
      .lean(),
    Chapter.find().sort({ order: 1 }).select("number title colorAccent").lean(),
  ]);

  if (!dbUser) {
    redirect("/login");
  }

  const completedIds = new Set(
    (dbUser.chaptersCompleted || []).map((id: { toString(): string }) =>
      id.toString()
    )
  );

  const sidebarChapters = chapters.map((ch, index) => {
    const id = (ch._id as { toString(): string }).toString();
    let status: "completed" | "active" | "locked" = "locked";

    if (completedIds.has(id)) {
      status = "completed";
    } else if (
      index === 0 ||
      completedIds.has(
        (chapters[index - 1]._id as { toString(): string }).toString()
      )
    ) {
      status = "active";
    }

    return {
      _id: id,
      number: ch.number,
      title: ch.title,
      colorAccent: ch.colorAccent,
      status,
    };
  });

  const shellUser = {
    name: dbUser.name,
    email: dbUser.email,
    xp: dbUser.xp,
    currentStreak: dbUser.currentStreak,
    avatarSeed: dbUser.avatarSeed,
    league: dbUser.league,
  };

  return (
    <AppShell user={shellUser} chapters={sidebarChapters}>
      {children}
    </AppShell>
  );
}
