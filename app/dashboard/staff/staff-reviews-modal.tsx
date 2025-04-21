import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { AvatarImage } from "@radix-ui/react-avatar"
import Image from "next/image"

type StaffReviewsModalProps = {
  staffId: number
}

export function StaffReviewsModal({ staffId }: StaffReviewsModalProps) {
  // You could fetch data here using the staffId via useEffect or SWR

  return (
    <div className="flex flex-col md:flex-row gap-6 mt-4">
      {/* Left: Summary Card */}
      <div className="bg-white rounded-xl shadow-sm p-6 w-full md:w-1/3 text-center border">
        <Image
          src="/avatar-male.png"
          alt="John Will"
          width={80}
          height={80}
          className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
        />
        <h3 className="text-lg font-semibold">John Will</h3>
        <p className="text-md font-semibold mt-2">4.0 rating</p>
        <div className="text-yellow-500 my-1">★★★★☆</div>
        <p className="text-muted-foreground text-sm mb-4">125 reviews</p>

        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((star, i) => (
            <div
              key={i}
              className="flex justify-between items-center border border-orange-500 rounded-full px-4 py-1 text-sm text-orange-600"
            >
              <span>{star} ★</span>
              <span>{[25, 19, 55, 14, 12][i]} reviews</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Review List */}
      <div className="flex-1 space-y-4">
        {[1, 2, 3, 4].map((_, i) => (
          <div
            key={i}
            className="bg-white border rounded-lg p-4 shadow-sm flex items-start justify-between"
          >
            <div className="flex gap-3">
              <Avatar className="size-12 hover:border-white hover:border-2">
                <AvatarImage src="/avatar-male.png" />
                <AvatarFallback className="bg-orange-200">JD</AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-semibold text-sm">John Will</h4>
                <p className="text-sm text-muted-foreground">
                  Service was good. He’s really good.
                </p>
                <div className="text-yellow-500 mt-1 text-sm">★★★★★</div>
              </div>
            </div>
            <div className="text-xs text-muted-foreground whitespace-nowrap">
              19/02/2025 3:26am
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
