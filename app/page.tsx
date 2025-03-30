"use client"

import { useState } from "react"
import { Bell, Search, Settings, CalendarDays, UserRound, Banknote } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"


import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { BookingTrendChart } from "./booking-trend-chart"
import Image from "next/image"
import Navbar from "./navbar"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")

  const topServices = [
    { id: 1, name: "Haircut", count: 55, image: '/haircut.png', bgColorClass: 'bg-blue-100' },
    { id: 2, name: "Beard Grooming", count: 32, image: '/beard.png', bgColorClass: 'bg-red-100' },
    { id: 3, name: "Hair Coloring", count: 20, image: '/coloring.png', bgColorClass: 'bg-amber-100' },
    { id: 4, name: "Wash & Styling", count: 17, image: '/styling.png', bgColorClass: 'bg-indigo-100' },
  ]

  const upcomingBookings = [
    {
      id: 1,
      customer: "Kojo Jnr.",
      staff: "John Doe",
      service: "Hair Cut",
      time: "10:00AM - 10:30AM"
    },
    {
      id: 2,
      customer: "Kojo Jnr.",
      staff: "John Doe",
      service: "Hair Cut",
      time: "10:00AM - 10:30AM"
    },
    {
      id: 3,
      customer: "Kojo Jnr.",
      staff: "John Doe",
      service: "Hair Cut",
      time: "10:00AM - 10:30AM"
    },
    {
      id: 4,
      customer: "Kojo Jnr.",
      staff: "John Doe",
      service: "Hair Cut",
      time: "10:00AM - 10:30AM"
    }
  ]

  const stats = [
    { icon: "📅", bgColor: "bg-amber-100", textColor: "text-amber-500", label: "Total bookings", value: "120" },
    { icon: "👥", bgColor: "bg-blue-100", textColor: "text-blue-500", label: "Total Customers", value: "1,600" },
    { icon: "👤", bgColor: "bg-pink-100", textColor: "text-pink-500", label: "Total Staff", value: "460" },
    { icon: "💰", bgColor: "bg-teal-100", textColor: "text-teal-500", label: "Total Income", value: "GHS 7,920" }
  ];

  return (
    <div className="min-h-screen bg-gray-100">

      <header className="shadow-lg border ">
        <div className="flex items-center justify-between px-6 pt-3">
          <div className="flex items-center gap-3">
            <img src="/kinzcut.png" width={50} alt="" />
            <h2 className="text-xl font-medium text-teal-700">Kingz Cut Barbering Salon</h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                className="pl-10 w-60 bg-slate-200 border-0 rounded-full shadow-none"
                placeholder="Search for something"
              />
            </div>
            <Button variant="ghost" size="icon" className="text-gray-500 bg-gray-200 rounded-full focus:bg-gray-300 hover:bg-gray-300">
              <Settings className="size-5 stroke-slate-400" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-500 bg-gray-200 rounded-full focus:bg-gray-300 hover:bg-gray-300">
              <Bell className="size-5 stroke-red-400" />
            </Button>
            <Avatar className="size-12">
              <AvatarImage src="/avatar.png" />
              <AvatarFallback className="bg-orange-200">JD</AvatarFallback>
            </Avatar>
          </div>
        </div>

        <Navbar />

      </header>


      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* {stats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-none">
              <CardContent className="p-6 flex items-center gap-4">
                <div className={`size-16 rounded-full ${stat.bgColor} flex items-center justify-center ${stat.textColor} text-xl`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                </div>
              </CardContent>
            </Card>
          ))} */}

          <Card className="border-0 shadow-none">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="size-16 rounded-full bg-amber-100 flex items-center justify-center text-amber-500 text-xl">
                <CalendarDays />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total bookings</p>
                <h3 className="text-2xl font-bold">120</h3>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-none">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="size-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 text-xl">
                <UserRound />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Customers</p>
                <h3 className="text-2xl font-bold">1,600</h3>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-none">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="size-16 rounded-full bg-pink-100 flex items-center justify-center text-pink-500 text-xl">
                <UserRound />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Staff</p>
                <h3 className="text-2xl font-bold">460</h3>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-none">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="size-16 rounded-full bg-teal-100 flex items-center justify-center text-teal-500 text-xl">
                <Banknote />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Income</p>
                <h3 className="text-2xl font-bold">GHS 7,920</h3>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col">
            <h3 className="text-xl font-bold text-gray-700 mb-4">Booking Trend</h3>
            <Card className="border-0 shadow-none h-full flex flex-col">
              <CardContent className="p-6 flex-1">
                <BookingTrendChart />
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col">
            <h3 className="text-xl font-bold text-gray-700 mb-4">Top Services Booked</h3>
            <Card className="border-0 shadow-none h-full flex flex-col">
              <CardContent className="p-6 flex-1">
                <div className="space-y-4">
                  {topServices.map((service) => (
                    <div key={service.id} className="flex items-center justify-between text-xl">
                      <div className="flex items-center gap-3">
                        <div className={`size-14 rounded-2xl flex items-center justify-center text-xl ${service.bgColorClass}`}>
                          <Image src={service.image} width={30} height={30} alt={service.name} />
                        </div>
                        <span className="text-gray-400 font-medium">{service.name}</span>
                      </div>
                      <span className="text-blue-300 font-light">{service.count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>


        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-700">Upcoming Bookings</h3>
            <Button variant="link" className="text-blue-600">View All</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {upcomingBookings.map((booking) => (
              <Card key={booking.id} className="border-0 shadow-none p-0">
                <CardContent className="p-0">
                  <div className="flex">
                    <div className="px-5 bg-teal-700/20 text-teal-700 font-medium inline-flex items-center rounded-2xl">
                      <p>Today</p>
                    </div>
                    <div className="p-4 space-y-2">
                      <div className="flex justify-between gap-4">
                        <span className="text-gray-500">Customer:</span>
                        <span className="font-medium">{booking.customer}</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-gray-500">Staff:</span>
                        <span className="font-medium">{booking.staff}</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-gray-500">Service:</span>
                        <span className="font-medium">{booking.service}</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-gray-500">Time</span>
                        <span className="font-medium">{booking.time}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>



      {/* <Tabs defaultValue="dashboard" className="w-full p-4">
        <TabsList className="w-full justify-start border-b rounded-none bg-transparent mb-6 space-x-6">
          <TabsTrigger
            value="dashboard"
            className={`h-10 px-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-teal-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none ${activeTab === "dashboard" ? "text-teal-600" : "text-gray-600"}`}
            onClick={() => setActiveTab("dashboard")}
          >
            Dashboard
          </TabsTrigger>
          <TabsTrigger
            value="appointments"
            className={`h-10 px-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-teal-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none ${activeTab === "appointments" ? "text-teal-600" : "text-gray-600"}`}
            onClick={() => setActiveTab("appointments")}
          >
            Customer Appointments
          </TabsTrigger>
          <TabsTrigger
            value="schedule"
            className={`h-10 px-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-teal-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none ${activeTab === "schedule" ? "text-teal-600" : "text-gray-600"}`}
            onClick={() => setActiveTab("schedule")}
          >
            Staff Schedule
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className={`h-10 px-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-teal-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none ${activeTab === "settings" ? "text-teal-600" : "text-gray-600"}`}
            onClick={() => setActiveTab("settings")}
          >
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-0">

        </TabsContent>

        <TabsContent value="appointments" className="mt-0">
          <div className="h-64 flex items-center justify-center">
            <p className="text-gray-500">Customer Appointments Content</p>
          </div>
        </TabsContent>

        <TabsContent value="schedule" className="mt-0">
          <div className="h-64 flex items-center justify-center">
            <p className="text-gray-500">Staff Schedule Content</p>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="mt-0">
          <div className="h-64 flex items-center justify-center">
            <p className="text-gray-500">Settings Content</p>
          </div>
        </TabsContent>
      </Tabs> */}


    </div>
  )
}