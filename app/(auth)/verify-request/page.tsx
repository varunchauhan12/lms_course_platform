import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";

export default function VerifyRequestPage() {
    return (
        <Card className={'w-full mx-auto'}>
            <CardHeader className={'text-center'}>
                <CardTitle>Please check your email</CardTitle>
                <CardDescription>
                    We have sent a verification code to your provided email address
                    please check your Inbox
                </CardDescription>
            </CardHeader>
            <CardContent>

            </CardContent>

        </Card>
    )
}