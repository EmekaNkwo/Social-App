import loginImage from "@/assets/login-image.jpg";
import { Metadata } from "next";
import Link from "next/link";
import GoogleSignInButton from "./google/GoogleSignInButton";
import LoginForm from "./LoginForm";
import {
  Container,
  GradientBackground,
} from "@/components/Gradient-Background";

export const metadata: Metadata = { title: "Login" };

export default function Page() {
  return (
    <GradientBackground>
      <Container
        className="mx-auto flex h-screen items-center justify-center p-5"
        withImage={loginImage.src}
      >
        <div className="w-full space-y-10">
          <h1 className="text-center text-3xl font-bold">
            Login to social app
          </h1>
          <div className="space-y-5">
            <GoogleSignInButton />
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-muted" />
              <span>OR</span>
              <div className="h-px flex-1 bg-muted" />
            </div>
            <LoginForm />
            <Link href="/signup" className="block text-center hover:underline">
              Don&apos;t have an account? Sign up
            </Link>
          </div>
        </div>
      </Container>
    </GradientBackground>
  );
}
