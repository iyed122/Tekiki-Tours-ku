"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "./icons"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="text-2xl font-bold text-primary">Tekiki Tours</div>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a href="#home" className="text-foreground hover:text-primary transition-colors">
                Home
              </a>
              <a href="#discover" className="text-foreground hover:text-primary transition-colors">
                Discover
              </a>
              <a href="#about" className="text-foreground hover:text-primary transition-colors">
                About
              </a>
              <a href="#contact" className="text-foreground hover:text-primary transition-colors">
                Contact
              </a>
            </div>
          </div>

          <div className="hidden md:block">
            <Button variant="outline" className="mr-4 bg-transparent">
              Sign In
            </Button>
            <Button>Get Started</Button>
          </div>

          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-background border-b border-border">
            <a href="#home" className="block px-3 py-2 text-foreground hover:text-primary">
              Home
            </a>
            <a href="#discover" className="block px-3 py-2 text-foreground hover:text-primary">
              Discover
            </a>
            <a href="#about" className="block px-3 py-2 text-foreground hover:text-primary">
              About
            </a>
            <a href="#contact" className="block px-3 py-2 text-foreground hover:text-primary">
              Contact
            </a>
            <div className="px-3 py-2 space-y-2">
              <Button variant="outline" className="w-full bg-transparent">
                Sign In
              </Button>
              <Button className="w-full">Get Started</Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
