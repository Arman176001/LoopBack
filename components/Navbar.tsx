'use client'
import { Saira_Stencil_One } from 'next/font/google'
import Link from 'next/link'

const saira = Saira_Stencil_One({ weight: "400", subsets: ["latin"] })

const Navbar = () => {

  return (
    <div>
      <nav className="w-full flex items-center px-8 py-4 text-black relative">
        <div className="absolute left-8 text-2xl font-bold cursor-pointer">
          <Link href="/">
            <span>
              <span className={saira.className}>L</span>oop
              <span className={saira.className}>B</span>ack
            </span>
          </Link>
        </div>
        <div className="flex justify-center w-full">
          <ul className="flex gap-9 text-lg">
            <li className="cursor-pointer text-black hover:scale-125 font-bold transition-all duration-200">
              <Link href="/">Home</Link>
            </li>
            <li className="cursor-pointer text-black hover:scale-125 font-bold transition-all duration-200">
              <Link href="/about">About</Link>
            </li>
            <li className="cursor-pointer text-black hover:scale-125 font-bold transition-all duration-200">
              <Link href="/contact">Contact</Link>
            </li>
          </ul>
        </div>
      </nav>
      <div className="h-1 w-screen bg-[#8c86ff]" />
    </div>
  )
}

export default Navbar

