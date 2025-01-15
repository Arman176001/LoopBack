import { Saira_Stencil_One } from "next/font/google";
import { handleAuth } from "@kinde-oss/kinde-auth-nextjs/server";
import {
  RegisterLink,
  LoginLink,
  LogoutLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
const { getUser } = getKindeServerSession();

const { isAuthenticated } = getKindeServerSession();
export const GET = handleAuth();

const saira = Saira_Stencil_One({ weight: "400", subsets: ["latin"] });

const Navbar = async () => {
  return (
    <div>
      <nav className="w-full flex items-center px-8 py-4 text-black relative">
        <div className="absolute left-8 text-2xl font-bold cursor-pointer">
          <span>
            <span className={saira.className}>L</span>oop
            <span className={saira.className}>B</span>ack
          </span>
        </div>
        <div className="flex justify-center w-full">
          <ul className="flex gap-9 text-lg">
            <li className="cursor-pointer text-black hover:scale-125 font-bold transition-all duration-200">
              Home
            </li>
            <li className="cursor-pointer text-black hover:scale-125 font-bold transition-all duration-200">
              About
            </li>
            <li className="cursor-pointer text-black hover:scale-125 font-bold transition-all duration-200">
              Services
            </li>
            <li className="cursor-pointer text-black hover:scale-125 font-bold transition-all duration-200">
              Contact
            </li>
          </ul>
        </div>
        <div className="absolute right-8">
          {(await isAuthenticated()) ? (
            <div className="flex gap-4">
              <img
                src={(await getUser()).picture ?? ""}
                alt="profile"
                className="h-10 w-10 rounded-full"
              />
              <LogoutLink>
                <button className="bg-transparent font-bold border border-white px-4 py-1 rounded hover:bg-white hover:scale-125 transition-all duration-200">
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
      <div className="h-2 w-screen bg-[#8c86ff]" />
    </div>
  );
};

export default Navbar;
