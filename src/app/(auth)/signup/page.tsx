import signupImage from "@/assets/signup-image.jpg";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SignUpForm from "./SignUpForm";
import {
  Container,
  GradientBackground,
} from "@/components/Gradient-Background";

export const metadata: Metadata = { title: "Sign Up" };

export default function Page() {
  return (
    <GradientBackground>
      <Container
        withImage={signupImage.src}
        className="mx-auto flex min-h-screen items-center justify-center p-4"
      >
        <div className="w-full space-y-8">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Sign up to social app</h1>
            <p className="text-muted-foreground">
              A place where even <span className="italic">you</span> can find a
              friend.
            </p>
          </div>
          <div className="space-y-5">
            <SignUpForm />
            <Link
              href="/login"
              className="block text-center text-sm text-muted-foreground hover:underline"
            >
              Already have an account? Log in
            </Link>
          </div>
        </div>
      </Container>
    </GradientBackground>
  );
}
