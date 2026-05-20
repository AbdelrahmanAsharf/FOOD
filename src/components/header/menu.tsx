import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle
} from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import Link from "next/link"

export default function SheetDemo() {
  return (
    <Sheet>
      <SheetTrigger asChild className="md:hidden">
        <Button variant="outline">
          <Menu className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetTitle className="sr-only">Main Menu</SheetTitle> 
        <nav className="p-5 m-auto">
          <ul className="flex flex-col gap-3">
              <Link href="/" className="text-gray-500 text-xl  transition font-semibold hover:text-primary" >Home</Link>
              <Link href="/about" className="text-gray-500 text-xl  transition font-semibold hover:text-primary">About</Link>
              <Link href="/contact" className="text-gray-500 text-xl  transition font-semibold hover:text-primary">Contact</Link>
              <Link href="/menu" className="text-gray-500 text-xl  transition font-semibold hover:text-primary">Menu</Link>
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  )
}

