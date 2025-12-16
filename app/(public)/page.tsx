
import { buttonVariants} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import Link from "next/link";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";

interface Featureprops {
    title: string;
    description: string;
    icon: string;
}

const features: Featureprops[] = [
    {
        title: "Interactive Courses",
        description: "Engage with multimedia content, quizzes, and assignments designed to enhance your learning experience.",
        icon: "📚",
    },
    {
        title: "Interactive Courses",
        description: "Engage with multimedia content, quizzes, and assignments designed to enhance your learning experience.",
        icon: "🎓",
    },
    {
        title: "Progress Tracking",
        description: "Monitor your learning journey with detailed progress reports and performance analytics.",
        icon: "📊",
    },
    {
        title: "Community Support",
        description: "Join discussion forums and study groups to collaborate with peers and get help from instructors.",
        icon: "🤝",
    }
]

export default function Home() {

    return (
        <>
            <section className={'relative py-20'}>
                <div className={'flex flex-col items-center text-center space-y-8'}>

                    <Badge variant={'outline'}>
                        The future of online education
                    </Badge>
                    <h1 className={'text-4xl md:text-6xl font-bold tracking-tight'}>Elevate Your Learning
                        Experience</h1>
                    <p className={'text-muted-foreground max-w-[700px] md:text-xl'}> Discover a new way to learn with
                        our modern, interactive learning management sys̵tem. Access
                        high-quality courses anytime, anywhere.</p>
                    <div className={'flex flex-col sm:flex-row gap-4 mt-8'}>
                        <Link href={"/courses"} className={buttonVariants({size: "lg"})}>Explore Courses</Link>
                        <Link href={"/login"} className={buttonVariants({size: "lg", variant: "outline"})}>Sign
                            in</Link>

                    </div>
                </div>

            </section>

            <section className={'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-32'}>
                {features.map((feature, index) => (
                    <Card key={index} className={'hover:shadow-lg transition-shadow'}>
                        <CardHeader>
                            <div className={'text-4xl mb-4'}>{feature.icon}</div>
                            <CardTitle>{feature.title}</CardTitle>
                        </CardHeader>
                        <CardContent><p className={'text-muted-foreground'}>{feature.description}</p></CardContent>
                    </Card>
                ))}
            </section>
        </>
    );
}
