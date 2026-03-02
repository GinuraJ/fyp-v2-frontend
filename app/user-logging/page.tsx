"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

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

export default function LoginScreen() {
  const router = useRouter() 

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
  
    setLoading(true)
  
    try {
      router.push("/dashboard")
  
    } catch (error) {
      alert("Login failed")
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="min-h-screen flex">

      <div className="hidden lg:flex w-1/2 bg-muted items-center justify-center p-10">
        <div className="text-center space-y-6">

        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
      
        <Card className="w-full max-w-sm">
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
            <form>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
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
                  <Input id="password" type="password" required />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            {/* <Button type="submit" className="w-full"> */}
            <Button
              type="button"
              className="w-full"
              disabled={loading}
              onClick={handleLogin}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
            <Button variant="outline" className="w-full">
              Clear Form
            </Button>
          </CardFooter>
        </Card>

      </div>

    </div>
  )
}