"use client";
import Link from "next/link";
import Image from "next/image";
import {ModeToggle} from "@/components/ui/theme-toggle";
import {authClient} from "@/lib/auth-client";
import {buttonVariants} from "@/components/ui/button";
import {UserDropdown} from "@/app/(public)/_components/UserDropdown";


const NavLink = [
    {name: "Home", href: "/"},
    {name: "Courses", href: "/courses"},
    {name: "Dashboard", href: "/dashboard"},
]

export function Navbar() {
    const {data: session, isPending} = authClient.useSession();

    return (
        <header
            className={'sticky top-0 border-b bg-background/95 z-50 w-full backdrop-blur-[backdrop-filter]:bg-background/60'}>
            <div className={'container mx-auto flex min-h-16 items-center px-4 md:px-6 lg:px-8'}>
                <Link href={'/'} className={'flex items-center space-x-2 mr-4'}>
                    <Image src={'/logo.png'} alt={"logo"} width={80} height={80}/>
                    <span className={'font-bold text-xl'}>ClearLMS</span>
                </Link>
                <nav className={'hidden md:flex md:flex-1 md:items-center md:justify-between'}>
                    <div className={'flex space-x-4'}>

                        {NavLink.map((link) => (
                            <Link href={link.href} key={link.name}
                                  className={'text-sm font-semibold transition-colors hover:text-primary'}>{link.name}</Link>
                        ))}
                    </div>
                    <div className={'flex items-center space-x-4'}>


                        <ModeToggle/>
                        {isPending ? null : session ? (
                            <UserDropdown name={session.user.name} email={session.user.email} image={session.user.image || ""}/>
                        ) : (
                            <>
                                <Link href={"/login"} className={buttonVariants({variant: "secondary"})}>LogIn</Link>
                                <Link href={"/register"} className={buttonVariants()}>SignIn</Link>
                            </>
                        )}
                    </div>
                </nav>
            </div>
        </header>
    )
}