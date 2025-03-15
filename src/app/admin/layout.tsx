import { Button } from "@/components/ui/button";
import Link from "next/link";

interface AdminLayoutProps {
  children: Readonly<React.ReactNode>;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex h-screen">
      
      <aside className="flex flex-col p-4 border-gray-100 border-r-[1px] w-3xs">
        <header>
          <h3 className="font-bold text-2xl text-center">Unibiblioteca</h3>
        </header>

        <nav className="flex flex-col gap-4 mt-20">
          <Link href="/posts">Posts</Link>
          <Link href="/subjects">Matérias</Link>
        </nav>

        <Button variant="ghost" className="mt-auto">
          Sair
        </Button>
      </aside>
      {children}
    </div>
  );
}
