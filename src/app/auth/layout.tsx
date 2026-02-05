// Next
import Link from "next/link";

// Phosphor
import { DevToLogoIcon } from "@phosphor-icons/react/ssr";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="w-full h-screen flex flex-col items-center justify-center gap-8">
      <Link
        href="/"
        className="flex justify-center items-center gap-2 text-2xl font-bold"
      >
        <DevToLogoIcon className="size-10" />
        Laboratorio Virtual
      </Link>

      {children}
    </main>
  );
}
