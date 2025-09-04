import { SidebarLeft } from "@/components/ui/sidebar-left";
import { SidebarRight } from "@/components/ui/sidebar-right";
import { FeedList } from "@/components/ui/feed-list";
import { CreatePostDialog } from "@/components/ui/create-post-dialog";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/modetoggle";

export default function HomePage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-6">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-balance text-2xl font-semibold">Main Feed</h1>
          <p className="text-sm text-muted-foreground">
            Discover projects, collaborators, and ideas.
          </p>
        </div>
        <ModeToggle />
      </header>
      <div className="flex gap-6">
        {/* Left nav - hidden on smaller screens */}
        <div className="hidden lg:block">
          <SidebarLeft />
        </div>

        {/* Center feed */}
        <section className="min-w-0 flex-1">
          {/* Mobile create-post button */}
          <div className="mb-4 lg:hidden">
            <CreatePostDialog>
              <Button className="w-full">Create New Post</Button>
            </CreatePostDialog>
          </div>
          <FeedList />
        </section>

        {/* Right sidebar - hidden until xl for comfortable space */}
        <div className="hidden xl:block">
          <SidebarRight />
        </div>
      </div>
    </main>
  );
}
