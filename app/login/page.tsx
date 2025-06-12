'use client';

import Image from "next/image";
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from "@/utils/firebase.browser";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { DeviconGoogle } from "../icons/google";
import { Loader2, Eye, EyeOff } from "lucide-react";

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
})

function ProfileForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  // 2. Define a submit handler for email/password login.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );

      // userCredential.


      console.log('User signed in:', userCredential.user);


      toast.success('You have been signed in successfully.');

      // Redirect to dashboard
      router.push('/dashboard');

    } catch (error: any) {
      console.error('Error signing in:', error);

      // Handle different error types
      let errorMessage = 'An error occurred during sign in.';

      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email address.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address.';
          break;
        case 'auth/user-disabled':
          errorMessage = 'This account has been disabled.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed attempts. Please try again later.';
          break;
        case 'auth/invalid-credential':
          errorMessage = 'Invalid email or password.';
          break;
        default:
          errorMessage = error.message || 'An error occurred during sign in.';
      }


      toast.error(errorMessage);

      // Set form error
      form.setError('root', {
        type: 'manual',
        message: errorMessage,
      });

    } finally {
      setIsLoading(false);
    }
  }

  // Handle Google Sign-In
  async function handleGoogleSignIn() {
    setIsGoogleLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      // Force account selection prompt
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      
      const result = await signInWithPopup(auth, provider);

      console.log('User signed in with Google:', result.user);

      toast.success('You have been signed in with Google successfully.');

      // Redirect to dashboard
      router.push('/dashboard');

    } catch (error: any) {
      console.error('Error signing in with Google:', error);

      let errorMessage = 'An error occurred during Google sign in.';

      switch (error.code) {
        case 'auth/popup-closed-by-user':
          errorMessage = 'Sign in was cancelled.';
          break;
        case 'auth/popup-blocked':
          errorMessage = 'Popup was blocked. Please allow popups and try again.';
          break;
        case 'auth/account-exists-with-different-credential':
          errorMessage = 'An account already exists with this email using a different sign-in method.';
          break;
        default:
          errorMessage = error.message || 'An error occurred during Google sign in.';
      }

      toast.error(errorMessage);

    } finally {
      setIsGoogleLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {form.formState.errors.root && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
            {form.formState.errors.root.message}
          </div>
        )}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your email"
                  type="email"
                  disabled={isLoading || isGoogleLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    placeholder="Enter your password"
                    type={showPassword ? "text" : "password"}
                    disabled={isLoading || isGoogleLoading}
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading || isGoogleLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormDescription>
                <Link href="/forgot-password" className="text-blue-400 font-medium hover:underline">
                  Forgot password?
                </Link>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          size={'lg'}
          className="w-full rounded-none bg-[#FF9600] hover:bg-[#158F83]"
          type="submit"
          disabled={isLoading || isGoogleLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing In...
            </>
          ) : (
            'Login'
          )}
        </Button>

        <Button
          onClick={handleGoogleSignIn}
          size={'lg'}
          variant={'outline'}
          className="w-full"
          type="button"
          disabled={isLoading || isGoogleLoading}
        >
          {isGoogleLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing In...
            </>
          ) : (
            <>
              <DeviconGoogle />
              Continue with Google
            </>
          )}
        </Button>

        <p className="text-gray-400 text-center">
          Don't have an account?
          <Link href="/register" className="text-blue-400 hover:underline ml-1">
            Create an account
          </Link>
        </p>
      </form>
    </Form>
  )
}

export default function Login() {
  return (
    <div className="min-h-screen flex">
      <div className="w-1/2 inline-flex items-center justify-center">
        <div className="w-4/6">
          <h1 className="text-2xl font-medium mb-3">Login</h1>
          <ProfileForm />
        </div>
      </div>
      <div className="w-1/2 bg-[#158F83] inline-flex items-center justify-center flex-col gap-16">
        <h3 className="text-white text-center font-bold text-3xl">
          Welcome to Kingz Cut <br /> Barbering Salon
        </h3>
        <Image
          src="/login-salon.png"
          alt="Salon or barbering shop"
          width={400}
          height={16}
        />
      </div>
    </div>
  );
}