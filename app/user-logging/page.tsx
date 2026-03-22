"use client"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { AlertMessage } from "@/components/alertPost"

import { API_BASE_URL } from "@/lib/config";


export default function LoginScreen() {
  const router = useRouter() 

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  type AlertVariant = "success" | "warning" | "error"

  const [alert, setAlert] = useState<{
    show: boolean
    title: string
    variant: AlertVariant
  } | null>(null)

  useEffect(() => {
    const role = localStorage.getItem("role")
    const storedEmail = localStorage.getItem("email")
    if (!role || !storedEmail) return
    if (role === "P") router.replace("/dashboard")
    else if (role === "A") router.replace("/analytics")
    else router.replace("/dashboard")
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {

    e.preventDefault();
  
    setLoading(true);
  
    try {
      const res = await fetch(`${API_BASE_URL}/users/login`, {
        method: "POST",
        headers: {"Content-Type": "application/json",},
        body: JSON.stringify({ email, password }),
      });
  
      const data = await res.json();
  
      if (data.code === "0000" && data.userRole) {

        setAlert({
          show: true,
          title: "Successfully logged in",
          variant: "success",
        });
  
        localStorage.setItem("email", data.email ?? "");
        localStorage.setItem("role", data.userRole);
        const displayName =
          (typeof data.name === "string" && data.name) ||
          (typeof data.userName === "string" && data.userName) ||
          (typeof data.fullName === "string" && data.fullName) ||
          ""
        localStorage.setItem("userName", displayName)
  
        setTimeout(() => {
          if (data.userRole === "P") router.push("/dashboard");
          else if (data.userRole === "A") router.push("/analytics");
        }, 1000);
  
      } else {
        setAlert({
          show: true,
          title: data.message || "Login failed",
          variant: "error",
        });
      }
    } catch (error) {
      console.error(error);
      setAlert({
        show: true,
        title: "Server error. Please try again.",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex">

      <div className="relative hidden min-h-screen w-1/2 overflow-hidden bg-muted lg:flex">
        <Image
          src="/images/logoTest.jpg"
          alt=""
          fill
          className="object-cover"
          priority
          sizes="50vw"
        />
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
      
        <Card className="w-full max-w-sm">
      <form onSubmit={handleLogin}>

          <CardHeader>
            <CardTitle>Login to GreenMint</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
            <CardAction>
              <Link href="/user-creation">
                <Button variant="link">
                  Sign Up
                </Button>
              </Link>
            </CardAction>
          </CardHeader>
          <CardContent>
              <div className="flex flex-col gap-6 mt-5">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="greenMint@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a
                      href="#"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <Input 
                    id="password" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                  />
                </div>
              </div>
          </CardContent>
          {/* <CardFooter className="flex-col gap-2">
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
              onClick={handleLogin}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
            <Button variant="outline" className="w-full">
              Clear Form
            </Button>
          </CardFooter> */}
          <CardFooter className="flex-col gap-2 mt-5">
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>

            <Button
              variant="outline"
              className="w-full"
              type="button"
              onClick={() => {
                setEmail("");
                setPassword("");
                setAlert(null);
              }}
            >
              Clear Form
            </Button>
            {alert?.show && (
              <AlertMessage
                title={alert.title}
                date={new Date()}
                variant={alert.variant}
              />
            )}

          </CardFooter>
        </form>

        </Card>

      </div>

    </div>
  )
}