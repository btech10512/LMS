import { School, Menu } from "lucide-react";
import React, { useEffect } from "react";
import { DropdownMenuShortcut } from "./ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSubContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import DarkMode from "./Darkmode";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import { useLogoutUserMutation } from "@/features/api/authApi";
import { toast } from "sonner";
import { useSelector } from "react-redux";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const [logoutUser, { data, isSuccess }] = useLogoutUserMutation();
  const navigate = useNavigate();
  const logoutHandler = async () => {
    await logoutUser();
  };

  // console.log(user);

  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message || "Logged out succesfully");
      navigate("/login");
    }
  }, [isSuccess]);

  return (
    // for desktop
    <div className="h-16 dark:bg-[#0a0a0a] bg-white border-b dark:border-b-gray-800 border-b-gray-200 fixed top-0 left-0 right-0 duration-300 z-10">
      <div className="max-w-7xl mx-auto hidden md:flex justify-between items-center gap-10 h-full">
        <div className="flex items-center gap-2">
          <School size={"30"} />
          <Link to="/"> 
            <h1 className="hidden md:block font-extrabold text-2xl">
              E-learning
            </h1>
          </Link>
        </div>
        <div className="flex justify-center gap-4 sm:gap-8">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar>
                  <AvatarImage
                    src={user?.photoUrl || "https://github.com/shadcn.png"}
                    alt="@shadcn"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Link to="my-learning">My Learning</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="profile">Edit Profile</Link>
                  </DropdownMenuItem>
                  {user.role === "instructor" && (
                    <DropdownMenuItem><Link to="/admin/dashboard">Dashboard</Link> </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logoutHandler}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div>
              <Button variant="outline" onClick={() => navigate("/login")}>
                Login
              </Button>
              <Button onClick={() => navigate("/login")}>Signup</Button>
            </div>
          )}
          <DarkMode />
        </div>
      </div>
      {/* for mobile screen */}
      <div className="flex md:hidden items-center justify-between px-4 h-full">
        <h1 className="font-extrabold text-2xl">E-learning</h1>

        <MobileNavbar />
      </div>
    </div>
  );
};

export default Navbar;

const MobileNavbar = () => {
  const role = "instructor";
  return (
    <div className="flex justify-end self-start pt-6 w-full gap-3">
      <Sheet>
        <DarkMode />
        <SheetTrigger asChild>
          <Button
            size="icon"
            className="rounded-full bg-gray-200 hover:bg-gray-300"
            variant="outline"
          >
            <Menu />
          </Button>
        </SheetTrigger>

        <SheetContent className="flex flex-col h-full ">
          <SheetHeader className="flex flex-row items-center  mt-2">
            {/* <SheetTitle>My Profile</SheetTitle> */}
          </SheetHeader>
          <Separator />

          <nav className="flex flex-col space-y-4">
            <span className="ml-3">My Learning</span>
            <span className="ml-3">Edit Profile</span>
            <span className="ml-3">Logout</span>
            {role === "instructor" && (
              <SheetFooter>
                <SheetClose asChild>
                  <Button type="submit">Dash Board</Button>
                </SheetClose>
              </SheetFooter>
            )}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
};
