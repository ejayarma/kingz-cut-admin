// app/page.js
"use client"

import { useState } from "react"
import { Bell, Search, Settings } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")

  const bookingData = [
    {
      name: "Mon",
      "New Client": 450,
      "Returning Client": 240,
    },
    {
      name: "Tue",
      "New Client": 340,
      "Returning Client": 120,
    },
    {
      name: "Wed",
      "New Client": 320,
      "Returning Client": 260,
    },
    {
      name: "Thurs",
      "New Client": 450,
      "Returning Client": 370,
    },
    {
      name: "Fri",
      "New Client": 160,
      "Returning Client": 250,
    },
    {
      name: "Sat",
      "New Client": 400,
      "Returning Client": 240,
    },
    {
      name: "Sun",
      "New Client": 400,
      "Returning Client": 340,
    },
  ]

  const topServices = [
    { id: 1, name: "Haircut", count: 55, icon: "✂️" },
    { id: 2, name: "Beard Grooming", count: 32, icon: "🧔" },
    { id: 3, name: "Hair Coloring", count: 20, icon: "🎨" },
    { id: 4, name: "Wash & Styling", count: 17, icon: "💧" },
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

  return (
    <div className="min-h-screen bg-gray-100">

      <div className="flex items-center justify-between mb-6 p-4 shadow-lg">
        <div className="flex items-center gap-3">
          <img src="/kinzcut.png" width={50} alt="" />
          <h2 className="text-xl font-medium text-teal-700">Kingz Cut Barbering Salon</h2>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              className="pl-10 w-60 bg-gray-50 border-0"
              placeholder="Search for something"
            />
          </div>
          <Button variant="ghost" size="icon" className="text-gray-500 bg-gray-200 rounded-full focus:bg-gray-300 hover:bg-gray-300">
            <Settings className="size-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-500 bg-gray-200 rounded-full focus:bg-gray-300 hover:bg-gray-300">
            <Bell className="size-5" />
          </Button>
          <Avatar>
            <AvatarImage src="/avatar.jpg" />
            <AvatarFallback className="bg-orange-200">JD</AvatarFallback>
          </Avatar>
        </div>
      </div>

      <Tabs defaultValue="dashboard" className="w-full p-4">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-500 text-xl">
                  📅
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total bookings</p>
                  <h3 className="text-2xl font-bold">120</h3>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 text-xl">
                  👥
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Customers</p>
                  <h3 className="text-2xl font-bold">1,600</h3>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center text-pink-500 text-xl">
                  👤
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Staff</p>
                  <h3 className="text-2xl font-bold">460</h3>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-500 text-xl">
                  💰
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Income</p>
                  <h3 className="text-2xl font-bold">GHS 7,920</h3>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Booking Trend</h3>
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={bookingData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 0,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="New Client" fill="#6366F1" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Returning Client" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Top Services Booked</h3>
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {topServices.map((service) => (
                      <div key={service.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl
                              ${service.name === "Haircut" ? "bg-blue-100" :
                              service.name === "Beard Grooming" ? "bg-red-100" :
                                service.name === "Hair Coloring" ? "bg-amber-100" : "bg-indigo-100"}`
                          }>
                            {service.icon}
                          </div>
                          <span className="text-gray-600">{service.name}</span>
                        </div>
                        <span className="text-gray-700 font-medium">{service.count}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Upcoming Bookings</h3>
              <Button variant="link" className="text-blue-600">View All</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {upcomingBookings.map((booking) => (
                <Card key={booking.id} className="border-0 shadow-sm">
                  <CardContent className="p-0">
                    <div className="p-4 bg-teal-50 text-teal-700 font-medium">
                      Today
                    </div>
                    <div className="p-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Customer:</span>
                        <span className="font-medium">{booking.customer}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Staff:</span>
                        <span className="font-medium">{booking.staff}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Service:</span>
                        <span className="font-medium">{booking.service}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Time</span>
                        <span className="font-medium">{booking.time}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
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
      </Tabs>
    </div>
  )
}