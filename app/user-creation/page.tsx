"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { SpinnerEmpty } from "@/components/loading"
import { API_BASE_URL } from "@/lib/config";
import { useRouter } from "next/navigation"

export default function SignupPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)

  const [statusMessage, setStatusMessage] = useState("Processing your request")
  const [isError, setIsError] = useState(false)

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    nic: "",
    dob: "",
    address1: "",
    address2: "",
    address3: "",
    district: "",
    height: "",
  })

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleNext = () => {
    if (step === 1) {
      if (
        !formData.firstName ||
        !formData.lastName ||
        !formData.address1 ||
        !formData.address2 ||
        !formData.address3 ||
        !formData.district
      ) {
        alert("Please fill all fields in Step 1")
        return
      }

      setStep(2)
    } else if (step === 2) {
      if (
        !formData.nic ||
        !formData.dob ||
        !formData.email ||
        !formData.mobile ||
        !formData.password ||
        !formData.confirmPassword
      ) {
        alert("Please fill all fields in Step 2")
        return
      }

      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match")
        return
      }

      setStep(3)
    }
  }

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault()
  
  //   try {
  //     setLoading(true)
  
  //     const payload = {
  //       firstName: formData.firstName,
  //       lastName: formData.lastName,
  //       email: formData.email,
  //       mobile: formData.mobile,
  //       password : formData.password,
  //       nic : formData.nic,
  //       dob: formData.dob,
  //       address1: formData.address1, 
  //       address2: formData.address2, 
  //       address3: formData.address3,
  //       district: formData.district,
  //       height: formData.height
  //     };
  
  //     const response = await fetch(`${API_BASE_URL}/users/signup`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(payload),
  //     });
  
  //     const data = await response.json();
  
  //     if (data.code === "0000") {
  //       // setAlert({
  //       //   show: true,
  //       //   title: "Order placed successfully",
  //       //   variant: "success",
  //       // })
  //       console.log("User success:", data.order);
  //     } else {
  //       // setAlert({
  //       //   show: true,
  //       //   title: data.message || "Failed to place order",
  //       //   variant: "error",
  //       // })
  //     }
  
  //   } catch (error) {
  //     console.error(error)
  //     alert("Signup failed")
  
  //   } finally {
  //     // setLoading(false)
  //   }
  // }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
  
    try {
      setLoading(true)
      setIsError(false)
      setStatusMessage("Processing your request")
  
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        mobile: formData.mobile,
        password: formData.password,
        nic: formData.nic,
        dob: formData.dob,
        address1: formData.address1,
        address2: formData.address2,
        address3: formData.address3,
        district: formData.district,
        height: formData.height
      }
  
      const response = await fetch(`${API_BASE_URL}/users/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      })
  
      const data = await response.json()
  
      if (data.code === "0000") {
  
        setStatusMessage("Signup successful! Redirecting to login...")
  
        setTimeout(() => {
          router.push("/user-logging")
        }, 5000)
  
      } else {
  
        setIsError(true)
        setStatusMessage(data.message || "Signup failed")
  
      }
  
    } catch (error) {
  
      setIsError(true)
      setStatusMessage("Signup failed. Please try again.")
  
    }
  }

  if (loading) {
    return <SpinnerEmpty message={statusMessage} isError={isError} />
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-6">
      <Card className="w-full max-w-md shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl text-center font-semibold">
            Create Account
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col h-[550px]"
          >
            <div className="flex-1 overflow-hidden space-y-6">
              {/* STEP 1 */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>First Name</Label>
                    <Input
                      value={formData.firstName}
                      onChange={(e) =>
                        handleChange("firstName", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Last Name</Label>
                    <Input
                      value={formData.lastName}
                      onChange={(e) =>
                        handleChange("lastName", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Address Line 1</Label>
                    <Input
                      value={formData.address1}
                      onChange={(e) =>
                        handleChange("address1", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Address Line 2</Label>
                    <Input
                      value={formData.address2}
                      onChange={(e) =>
                        handleChange("address2", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Address Line 3</Label>
                    <Input
                      value={formData.address3}
                      onChange={(e) =>
                        handleChange("address3", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>District</Label>
                    <Select
                      onValueChange={(value) =>
                        handleChange("district", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select district" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="colombo">Colombo</SelectItem>
                        <SelectItem value="gampaha">Gampaha</SelectItem>
                        <SelectItem value="kandy">Kandy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>NIC</Label>
                    <Input
                      value={formData.nic}
                      onChange={(e) =>
                        handleChange("nic", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Date of Birth</Label>
                    <Input
                      type="date"
                      value={formData.dob}
                      onChange={(e) =>
                        handleChange("dob", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleChange("email", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Mobile Number</Label>
                    <Input
                      value={formData.mobile}
                      onChange={(e) =>
                        handleChange("mobile", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Password</Label>
                    <Input
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        handleChange("password", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Confirm Password</Label>
                    <Input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        handleChange("confirmPassword", e.target.value)
                      }
                    />
                  </div>
                </div>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <div className="space-y-6 text-center">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">
                      Help Us Measure Your Trees
                    </h3>

                    <p className="text-sm text-muted-foreground">
                      We use your height as a natural reference object to estimate
                      tree heights in your garden using image analysis.
                    </p>
                  </div>

                  <div className="flex justify-center py-2">
                    <img
                      src="/images/signUpTreeHeight.jpg.webp"
                      alt="Tree measurement guide"
                      className="w-[60%] rounded-lg"
                    />
                  </div>

                  <div className="space-y-2 text-left">
                    <Label>Your Height (cm)</Label>
                    <Input
                      type="number"
                      min="100"
                      max="250"
                      step="0.1"
                      placeholder="e.g. 172.5"
                      value={formData.height}
                      onChange={(e) =>
                        handleChange("height", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="mt-auto pt-4">
              {step === 1 && (
                <Button
                  type="button"
                  className="w-full"
                  onClick={handleNext}
                >
                  Next
                </Button>
              )}

              {step === 2 && (
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1"
                  >
                    Back
                  </Button>

                  <Button
                    type="button"
                    onClick={handleNext}
                    className="flex-1"
                  >
                    Next
                  </Button>
                </div>
              )}

              {step === 3 && (
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(2)}
                  >
                    Back
                  </Button>

                  <Button type="submit">Sign Up</Button>
                </div>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}