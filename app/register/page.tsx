'use client';
import Image from "next/image";
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile
} from 'firebase/auth';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';
import { auth, db } from "@/utils/firebase.browser";
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
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters.' }).trim(),
  email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  confirmPassword: z.string().min(8, { message: "Please confirm your password." }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

function ProfileForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  // Function to create staff record
  async function createStaffRecord(user: any, additionalData?: any) {
    try {
      // Check if staff record already exists
      const staffQuery = query(
        collection(db, 'staff'),
        where('userId', '==', user.uid)
      );

      const staffSnapshot = await getDocs(staffQuery);

      if (staffSnapshot.empty) {
        // Create new staff record
        const staffData = {
          name: additionalData?.fullName || user.displayName || 'New User',
          email: user.email,
          phone: '', // Empty initially, can be updated later
          services: [], // Empty initially
          image: user.photoURL || '',
          userId: user.uid,
          active: true,
          role: 'staff' as const, // Default to staff for new registrations
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };

        await addDoc(collection(db, 'staff'), staffData);
        console.log('Staff record created successfully');
      } else {
        console.log('Staff record already exists');
      }
    } catch (error) {
      console.error('Error creating staff record:', error);
      // Don't throw error here to avoid breaking the registration flow
      toast.error('Registration successful, but there was an issue setting up your profile. Please contact support.');
    }
  }

  // 2. Define a submit handler for email/password registration.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );

      // Update user profile with display name
      await updateProfile(userCredential.user, {
        displayName: values.fullName,
      });

      console.log('User created:', userCredential.user);

      // Create staff record
      await createStaffRecord(userCredential.user, { fullName: values.fullName });

      toast.success('Account created successfully! Welcome to Kingz Cut!');

      // Redirect to dashboard
      router.push('/dashboard');

    } catch (error: any) {
      console.error('Error creating account:', error);

      // Handle different error types
      let errorMessage = 'An error occurred during registration.';

      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'An account with this email already exists.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address.';
          break;
        case 'auth/operation-not-allowed':
          errorMessage = 'Email/password accounts are not enabled.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password is too weak. Please choose a stronger password.';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your connection and try again.';
          break;
        default:
          errorMessage = error.message || 'An error occurred during registration.';
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

  // Handle Google Sign-Up
  async function handleGoogleSignUp() {
    setIsGoogleLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      // Force account selection prompt
      provider.setCustomParameters({
        prompt: 'select_account'
      });

      const result = await signInWithPopup(auth, provider);

      console.log('User signed up with Google:', result.user);

      // Create staff record
      await createStaffRecord(result.user);

      toast.success('Account created successfully with Google! Welcome to Kingz Cut!');

      // Redirect to dashboard
      router.push('/dashboard');

    } catch (error: any) {
      console.error('Error signing up with Google:', error);

      let errorMessage = 'An error occurred during Google sign up.';

      switch (error.code) {
        case 'auth/popup-closed-by-user':
          errorMessage = 'Sign up was cancelled.';
          break;
        case 'auth/popup-blocked':
          errorMessage = 'Popup was blocked. Please allow popups and try again.';
          break;
        case 'auth/account-exists-with-different-credential':
          errorMessage = 'An account already exists with this email using a different sign-in method.';
          break;
        case 'auth/cancelled-popup-request':
          errorMessage = 'Sign up was cancelled.';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your connection and try again.';
          break;
        default:
          errorMessage = error.message || 'An error occurred during Google sign up.';
      }

      toast.error(errorMessage);

    } finally {
      setIsGoogleLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {form.formState.errors.root && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
            {form.formState.errors.root.message}
          </div>
        )}

        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your full name"
                  type="text"
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
                    placeholder="Choose a password"
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
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    placeholder="Confirm your password"
                    type={showConfirmPassword ? "text" : "password"}
                    disabled={isLoading || isGoogleLoading}
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading || isGoogleLoading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                </div>
              </FormControl>
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
              Creating Account...
            </>
          ) : (
            'Create Account'
          )}
        </Button>

        <Button
          onClick={handleGoogleSignUp}
          size={'lg'}
          variant={'outline'}
          className="w-full"
          type="button"
          disabled={isLoading || isGoogleLoading}
        >
          {isGoogleLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Account...
            </>
          ) : (
            <>
              <DeviconGoogle />
              Continue with Google
            </>
          )}
        </Button>

        <p className="text-gray-400 text-center">
          Already have an account?
          <Link href="/login" className="text-blue-400 hover:underline ml-1">
            Login
          </Link>
        </p>
      </form>
    </Form>
  )
}

export default function Register() {
  return (
    <div className="min-h-screen flex">
      <div className="w-1/2 inline-flex items-center justify-center">
        <div className="w-4/6">
          <h1 className="text-2xl font-medium mb-3">Create an account</h1>
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