"use client";

import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import {LogOut, HelpCircle ,Home, BookOpen, LayoutDashboardIcon} from "lucide-react";
import Link from "next/link";
import {authClient} from "@/lib/auth-client";
import {useRouter} from "next/navigation";

interface iAppProps {
    name : string;
    email: string;
    image : string;
}

export function UserDropdown({name , email , image}: iAppProps ) {
    const router = useRouter();

    async function SignOut() {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/"); // redirect to login page
                },
            },
        })
    }


    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full"
                >
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={image} alt={'/user.jpeg'}/>
                        <AvatarFallback>{name[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                className="w-56"
                align="end"
                sideOffset={8}
            >
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                            {name}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {email}
                        </p>
                    </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator/>

                <DropdownMenuItem asChild>
                    <Link href={'/'}>
                        <Home className="mr-2 h-4 w-4"/>
                        <span>Home</span>
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                    <Link href={'/courses'}>

                    <BookOpen className="mr-2 h-4 w-4"/>
                    <span>Courses</span>
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                    <Link href={'/dashboard'}>
                    <LayoutDashboardIcon className="mr-2 h-4 w-4"/>
                    <span>Dashboard</span>
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem>
                    <HelpCircle className="mr-2 h-4 w-4"/>
                    <span>Help & Feedback</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator/>

                <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={SignOut}>
                    <LogOut className="mr-2 h-4 w-4"/>
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
