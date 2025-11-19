'use client';

import Link from 'next/link';
import { Menu, X, Search, User } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/clubs', label: '동아리 탐색' },
  { href: '/recruitments', label: '모집공고' },
  { href: '/about', label: '소개' },
];

export default function NavbarNew() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group" aria-label="UNICLUB 홈">
            <div className="relative w-10 h-10 bg-gradient-to-br from-coral to-coral-dark rounded-xl flex items-center justify-center shadow-md transform group-hover:rotate-6 group-hover:scale-110 transition-all duration-300">
              <span className="text-white font-display font-bold text-xl">U</span>
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-xl md:text-2xl text-foreground">
                UNI<span className="bg-gradient-to-r from-coral to-coral-dark bg-clip-text text-transparent">CLUB</span>
              </span>
              <span className="text-xs text-muted-foreground hidden md:block">대학 동아리 플랫폼</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center">
            <NavigationMenu>
              <NavigationMenuList>
                {navItems.map((item) => (
                  <NavigationMenuItem key={item.href}>
                    <Link href={item.href} legacyBehavior passHref>
                      <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "text-base")}>
                        {item.label}
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" size="icon" aria-label="검색">
              <Search className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" aria-label="프로필">
              <User className="w-5 h-5" />
            </Button>
            <div className="w-px h-6 bg-border mx-2" />
            <Button variant="outline" asChild>
              <Link href="/auth/login">로그인</Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-coral to-coral-dark hover:shadow-lg transition-all">
              <Link href="/auth/signup">시작하기</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" aria-label="메뉴 열기">
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-80">
              <SheetHeader>
                <SheetTitle className="text-left font-display">
                  UNI<span className="text-coral">CLUB</span>
                </SheetTitle>
                <SheetDescription className="text-left">
                  대학 동아리 플랫폼
                </SheetDescription>
              </SheetHeader>

              <div className="flex flex-col gap-4 mt-8">
                {/* Search */}
                <Button variant="outline" className="w-full justify-start" size="lg">
                  <Search className="w-5 h-5 mr-2" />
                  검색
                </Button>

                {/* Navigation links */}
                <div className="space-y-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center px-4 py-3 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors font-medium"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>

                {/* Auth buttons */}
                <div className="mt-6 space-y-3 pt-6 border-t border-border">
                  <Button variant="outline" className="w-full" size="lg" asChild>
                    <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                      로그인
                    </Link>
                  </Button>
                  <Button
                    className="w-full bg-gradient-to-r from-coral to-coral-dark"
                    size="lg"
                    asChild
                  >
                    <Link href="/auth/signup" onClick={() => setIsOpen(false)}>
                      시작하기
                    </Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
