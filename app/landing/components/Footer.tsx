"use client"

import { Facebook, Twitter, Linkedin, Instagram, Mail } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import Image from "next/image"

const navigation = {
  product: [
    { name: "Features", href: "#" },
    { name: "Pricing", href: "#" },
    { name: "How it Works", href: "#how-it-works" },
    { name: "FAQ", href: "#" },
  ],
  company: [
    { name: "About", href: "#" },
    { name: "Blog", href: "#" },
    { name: "Careers", href: "#" },
    { name: "Contact", href: "#" },
  ],
  legal: [
    { name: "Privacy", href: "#" },
    { name: "Terms", href: "#" },
    { name: "Cookie Policy", href: "#" },
  ],
  social: [
    {
      name: "Facebook",
      href: "#",
      icon: Facebook,
    },
    {
      name: "Twitter",
      href: "#",
      icon: Twitter,
    },
    {
      name: "LinkedIn",
      href: "#",
      icon: Linkedin,
    },
    {
      name: "Instagram",
      href: "#",
      icon: Instagram,
    },
  ],
}

export function Footer() {
  const [email, setEmail] = useState("")

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement newsletter subscription
    setEmail("")
  }

  return (
    <footer className="bg-gray-900 dark:bg-gray-950" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8">
            <Link href="/" className="inline-flex">
              <Image
                src="/logo.png"
                alt="TechPerks Logo"
                width={160}
                height={48}
                priority
                className="object-contain brightness-0 invert"
              />
            </Link>
            <p className="text-sm leading-6 text-gray-300 dark:text-gray-400 max-w-md">
              Elevate your LinkedIn presence with AI-powered content creation and strategic networking.
              Join thousands of professionals growing their network effectively.
            </p>
            <form onSubmit={handleSubscribe} className="mt-6 sm:flex sm:max-w-md">
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <Input
                type="email"
                name="email-address"
                id="email-address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full min-w-0 bg-white/5 dark:bg-white/10 px-4 py-2 text-base text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                placeholder="Enter your email"
              />
              <div className="mt-4 sm:ml-4 sm:mt-0 sm:flex-shrink-0">
                <Button 
                  type="submit"
                  className="w-full bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Subscribe
                </Button>
              </div>
            </form>
            <div className="flex space-x-6">
              {navigation.social.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-400 hover:text-gray-300 dark:hover:text-gray-200 transition-colors"
                  aria-label={`Follow us on ${item.name}`}
                >
                  <item.icon className="h-6 w-6" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-white">Product</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.product.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm leading-6 text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-200 transition-colors"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-white">Company</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.company.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm leading-6 text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-200 transition-colors"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-white">Legal</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.legal.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm leading-6 text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-200 transition-colors"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-white">Support</h3>
                <ul role="list" className="mt-6 space-y-4">
                  <li>
                    <Link
                      href="#"
                      className="text-sm leading-6 text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-200 transition-colors"
                    >
                      Help Center
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-sm leading-6 text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-200 transition-colors"
                    >
                      Documentation
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-sm leading-6 text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-200 transition-colors"
                    >
                      Status
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16 border-t border-gray-700 dark:border-gray-800 pt-8 sm:mt-20 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-xs leading-5 text-gray-400">
            &copy; {new Date().getFullYear()} Techperks. All rights reserved.
          </p>
          <div className="mt-4 sm:mt-0 flex space-x-6">
            <Link
              href="#"
              className="text-xs leading-5 text-gray-400 hover:text-gray-300 dark:hover:text-gray-200 transition-colors"
            >
              Privacy Notice
            </Link>
            <Link
              href="#"
              className="text-xs leading-5 text-gray-400 hover:text-gray-300 dark:hover:text-gray-200 transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="#"
              className="text-xs leading-5 text-gray-400 hover:text-gray-300 dark:hover:text-gray-200 transition-colors"
            >
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}