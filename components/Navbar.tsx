'use client'

import { useState, useEffect } from 'react'
import { Saira_Stencil_One } from 'next/font/google'
import {
  RegisterLink,
  LoginLink,
  LogoutLink,
} from "@kinde-oss/kinde-auth-nextjs/components"
import Link from 'next/link'

const saira = Saira_Stencil_One({ weight: "400", subsets: ["latin"] })

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<{ picture?: string } | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/check')
        if (res.ok) {
          const data = await res.json()
          setIsAuthenticated(data.isAuthenticated)
          setUser(data.user)
        }
      } catch (error) {
        console.error('Error checking authentication:', error)
      }
    }

    checkAuth()
  }, [])

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
              <Link href="/services">Services</Link>
            </li>
            <li className="cursor-pointer text-black hover:scale-125 font-bold transition-all duration-200">
              <Link href="/contact">Contact</Link>
            </li>
          </ul>
        </div>
        <div className="absolute right-8">
          {isAuthenticated ? (
            <div className="flex gap-4">
              <img
                src={user?.picture ?? ""}
                alt="profile"
                className="h-10 w-10 rounded-full"
              />
              <LogoutLink>
                <button className="bg-transparent font-bold border border-white px-4 py-2 rounded hover:bg-white hover:scale-125 transition-all duration-200">
                  Logout
                </button>
              </LogoutLink>
            </div>
          ) : (
            <div className="flex gap-4">
              <LoginLink>
                <button className="bg-transparent font-bold border border-white px-4 py-2 rounded hover:bg-white hover:scale-125 transition-all duration-200">
                  Login
                </button>
              </LoginLink>
              <RegisterLink>
                <button className="p-[3px] relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg transition-transform duration-500 hover:transform hover:rotate-6" />
                  <div className="px-8 py-2 rounded-[6px] relative group font-bold text-white">
                    SignUp
                  </div>
                </button>
              </RegisterLink>
            </div>
          )}
        </div>
      </nav>
      <div className="h-1 w-screen bg-[#8c86ff]" />
    </div>
  )
}

export default Navbar

