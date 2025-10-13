"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  TabsContents,
} from "@/components/ui/shadcn-io/tabs";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import {
  useRegisterUserMutation,
  useLoginUserMutation,
} from "@/features/api/authApi";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const [signupInput, setSignupInput] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loginInput, setLoginInput] = useState({ email: "", password: "" });

  const [
    registerUser,
    {
      data: registerData,
      error: registerError,
      isLoading: registerIsLoading,
      isSuccess: registerIsSuccess,
    },
  ] = useRegisterUserMutation();
  const [
    loginUser,
    {
      data: loginData,
      error: loginError,
      isLoading: loginIsLoading,
      isSuccess: loginIsSuccess,
    },
  ] = useLoginUserMutation();
  const navigate = useNavigate()
  const changeInputHandler = (e, type) => {
    const { name, value } = e.target;
    if (type === "signup") {
      setSignupInput({ ...signupInput, [name]: value });
    } else {
      setLoginInput({ ...loginInput, [name]: value });
    }
  };
  const handleRegistration = async (type) => {
    const inputData = type === "signup" ? signupInput : loginInput;
    console.log("Sending data:", inputData);
    const action = type === "signup"? registerUser : loginUser
    await action(inputData)
  };
  useEffect(() => {
    if(registerIsSuccess && registerData) {
      toast.success(registerData.message ||"Signup successful")
    }
    if(registerError) {
      toast.error(registerError.message || "Signup failed")
    }
  },[registerIsLoading,registerData,registerError])
  useEffect(() => {
    if(loginIsSuccess && loginData) {
      toast.success(loginData.message ||"Login successful")
      navigate("/")
    }
    if (loginError) {
      toast.error(loginError.message || "Login failed");
    }
  },[loginIsLoading,loginData,loginError])
  return (
    <div className="flex min-h-screen items-center justify-center w-full  align-center">
      <Tabs defaultValue="signup" className="w-[400px] bg-muted rounded-lg">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
          <TabsTrigger value="login">Login</TabsTrigger>
        </TabsList>
        <TabsContents className="mx-1 mb-1 -mt-2 rounded-sm h-full bg-background">
          <TabsContent value="signup" className="space-y-6 p-6">
            <p className="text-sm text-muted-foreground">
              Create a new account and click signup when you&apos;re done.
            </p>
            <div className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="name">Name</Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={signupInput.name}
                  placeholder="Enter your name"
                  required={true}
                  onChange={(e) => changeInputHandler(e, "signup")}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="username">Email</Label>
                <Input
                  type="email"
                  name="email"
                  value={signupInput.email}
                  placeholder="Enter your email"
                  onChange={(e) => changeInputHandler(e, "signup")}
                  required={true}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="username">Password</Label>
                <Input
                  type="password"
                  name="password"
                  value={signupInput.password}
                  placeholder="Enter password"
                  onChange={(e) => changeInputHandler(e, "signup")}
                  required={true}
                />
              </div>
            </div>
            <Button disabled={registerIsLoading} onClick={() => handleRegistration("signup")}>
              {
                registerIsLoading? (
                  <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                  </>
                ): "Signup"
              }
            </Button>
          </TabsContent>
          <TabsContent value="login" className="space-y-6 p-6">
            <p className="text-sm text-muted-foreground">
              Login your password here. After signup, you&apos;ll be logged in.
            </p>
            <div className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="current">Email</Label>
                <Input
                  type="email"
                  onChange={(e) => changeInputHandler(e, "login")}
                  name="email"
                  value={loginInput.email}
                  placeholder="Enter your email"
                  required={true}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="new">Password</Label>
                <Input
                  type="password"
                  onChange={(e) => changeInputHandler(e, "login")}
                  name="password"
                  value={loginInput.password}
                  placeholder="Enter your passwrod"
                  required={true}
                />
              </div>
            </div>
            <Button
              disabled={loginIsLoading}
              onClick={() => handleRegistration("login")}
            >
              {loginIsLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) :    "Login"
              }
            </Button>
          </TabsContent>
        </TabsContents>
      </Tabs>
    </div>
  );
};
export default Login;
