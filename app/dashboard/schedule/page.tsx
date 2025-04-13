import StaffWorkSchedule from "./staff-work-schedule"

export default function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  return (

    <StaffWorkSchedule></StaffWorkSchedule>
  )
}