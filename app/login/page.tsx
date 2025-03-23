'use client';
import Image from "next/image";
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
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

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
})

function ProfileForm() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email" {...field} />
              </FormControl>
              {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
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
                <Input placeholder="Enter your password" {...field} />
              </FormControl>
              <FormDescription>
                {/* This is your public display name. */}
                <a href="#" className="text-blue-400 font-medium">Forgot password?</a>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button size={'lg'} className="w-full rounded-none bg-[#FF9600] hover:bg-[#158F83]" type="submit">Login</Button>
        <Button size={'lg'} variant={'outline'} className="w-full" type="button">
          <DeviconGoogle />
          Continue with Google
        </Button>

        <p className="text-gray-400 text-center">Don't have an account? <Link href="/register" className="text-blue-400">Create an account</Link></p>
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
        <h3 className="text-white text-center font-bold text-3xl">Welcome to Kingz Cut <br /> Barbering Salon</h3>
        <Image src="/login-salon.png" alt="Salon or barbering shop" width={400} height={16} />

      </div>
    </div>
  );
}
