"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signupSchema, type SignupSchema } from "@/lib/validations/auth"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { ThemeToggle } from "@/components/theme-toggle"
import { useRouter } from "next/navigation"

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const form = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  async function onSubmit(data: SignupSchema) {
    setIsLoading(true)
    try {
      // TODO: Implement actual signup logic here
      console.log("Signup attempt with:", data)
      // For now, simulate a successful signup
      await new Promise(resolve => setTimeout(resolve, 1000))
      router.push("/dashboard")
    } catch (error) {
      console.error("Signup failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="relative flex items-start p-8">
        <Link
          href="/"
          className="absolute top-8 left-8 flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to home
        </Link>
        <div className="absolute top-8 right-8">
          <ThemeToggle />
        </div>
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px] mt-16">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
              Create an account
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Get started with your free account
            </p>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <Button
                variant="outline"
                className="dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-700 flex items-center justify-center h-11"
                onClick={() => {}}
              >
                <Image
                  src="/google.svg"
                  alt="Google"
                  width={20}
                  height={20}
                  className="mr-2"
                  priority
                />
                Google
              </Button>
              <Button
                variant="outline"
                className="dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-700 flex items-center justify-center h-11"
                onClick={() => {}}
              >
                <Image
                  src="/linkedin.svg"
                  alt="LinkedIn"
                  width={20}
                  height={20}
                  className="mr-2"
                  priority
                />
                LinkedIn
              </Button>
            </div>
          </div>
          <div className="grid gap-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300 dark:border-gray-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-gray-900 px-2 text-gray-500 dark:text-gray-400">
                  Or continue with email
                </span>
              </div>
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John Doe"
                          {...field}
                          className="dark:bg-gray-800 h-11"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="name@example.com"
                          {...field}
                          className="dark:bg-gray-800 h-11"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Create a password"
                          {...field}
                          className="dark:bg-gray-800 h-11"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 h-11"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Create account"}
                </Button>
              </form>
            </Form>
            <div className="mt-2">
              <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="font-medium text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden lg:block relative bg-gray-900">
        <Image
          src="/auth-bg.jpg"
          alt="Authentication background"
          className="absolute inset-0 object-cover opacity-30"
          fill
          priority
        />
        <div className="relative h-full flex items-center justify-center text-center">
          <blockquote className="space-y-2 max-w-lg p-8">
            <p className="text-lg text-white">
              &ldquo;TechPerks has completely transformed how we manage our employee benefits. The platform is intuitive, and the support team is exceptional.&rdquo;
            </p>
            <footer className="text-sm text-gray-300">
              <p>Sarah Johnson</p>
              <p>HR Director at TechCorp</p>
            </footer>
          </blockquote>
        </div>
      </div>
    </div>
  )
}