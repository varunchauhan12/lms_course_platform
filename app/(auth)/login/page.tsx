
import { headers } from "next/headers";
import LoginForm from "./_components/LoginForm";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";


export default async function LoginPage() {
  const session = await auth.api.getSession({
      headers: await headers(), // you need to pass the headers object.
    });

    if(session){
      return redirect('/');
    }
  return (
   <LoginForm/>
  );
}
