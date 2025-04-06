import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/clerk-react";
import { Globe, User } from "lucide-react";
import { Link } from "react-router";

function Navigation() {
  const { user } = useUser();
  console.warn(user);
  return (
    <nav className="z-10 bg-purple-800 flex  items-center justify-between px-8 text-white py-4">
      <div className="flex items-center space-x-8">
        <Link to="/" className="text-2xl font-bold ">
          Horizone
        </Link>
        <div className="hidden md:flex space-x-6">
          <Link to={`/`} className="transition-colors">
            Home
          </Link>

          {user?.publicMetadata?.role === "admin" && (
            <Link to={`/hotels/create`} className="transition-colors">
              Create Hotel
            </Link>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Button variant="ghost" className="">
          <Globe className="h-5 w-5 mr-2" />
          EN
        </Button>
        <SignedOut>
          <Button variant="ghost" asChild>
            <Link to="/sign-in">Log In</Link>
          </Button>
          <Button asChild>
            <Link to="/sign-up">Sign Up</Link>
          </Button>
        </SignedOut>
        <SignedIn>
          <UserButton />
          <Button
            asChild
            className="bg-white text-purple-900 hover:bg-purple-100 flex items-center"
          >
            <Link to="/account" className="flex items-center">
              <span className="hidden sm:inline">My Account</span>
              <User className="sm:hidden h-5 w-5" />
            </Link>
          </Button>
        </SignedIn>
      </div>
    </nav>
  );
}

export default Navigation;
