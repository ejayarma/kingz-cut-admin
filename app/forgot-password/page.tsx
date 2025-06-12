'use client';

import Image from "next/image";
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
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
import { Loader2, ArrowLeft, Mail } from "lucide-react";

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
})

function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })

  // 2. Define a submit handler for password reset.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      await sendPasswordResetEmail(auth, values.email);

      console.log('Password reset email sent to:', values.email);

      toast.success('Password reset email sent successfully! Please check your inbox.');
      
      setIsEmailSent(true);

    } catch (error: any) {
      console.error('Error sending password reset email:', error);

      // Handle different error types
      let errorMessage = 'An error occurred while sending the reset email.';

      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email address.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many reset attempts. Please wait before trying again.';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your connection and try again.';
          break;
        default:
          errorMessage = error.message || 'An error occurred while sending the reset email.';
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

  // Reset form to send another email
  function handleSendAnother() {
    setIsEmailSent(false);
    form.reset();
  }

  if (isEmailSent) {
    return (
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <Mail className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-xl font-medium">Check your email</h2>
          <p className="text-gray-600">
            We've sent a password reset link to<br />
            <span className="font-medium">{form.getValues('email')}</span>
          </p>
        </div>

        <div className="space-y-3">
          <Button
            onClick={handleSendAnother}
            variant="outline"
            className="w-full"
            disabled={isLoading}
          >
            Send another email
          </Button>
          
          <Link href="/login">
            <Button variant="ghost" className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to login
            </Button>
          </Link>
        </div>

        <p className="text-sm text-gray-500">
          Didn't receive the email? Check your spam folder or try sending another one.
        </p>
      </div>
    );
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
                  placeholder="Enter your email address"
                  type="email"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                We'll send you a link to reset your password
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          size={'lg'}
          className="w-full rounded-none bg-[#FF9600] hover:bg-[#158F83]"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending Reset Link...
            </>
          ) : (
            'Send Reset Link'
          )}
        </Button>

        <Link href="/login">
          <Button variant="ghost" className="w-full">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to login
          </Button>
        </Link>

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

export default function ForgotPassword() {
  return (
    <div className="min-h-screen flex">
      <div className="w-1/2 inline-flex items-center justify-center">
        <div className="w-4/6">
          <h1 className="text-2xl font-medium mb-3">Reset Password</h1>
          <p className="text-gray-600 mb-6">
            Enter your email address and we'll send you a link to reset your password.
          </p>
          <ForgotPasswordForm />
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