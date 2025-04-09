import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useCreateBookingMutation, useGetHotelByIdQuery } from "@/lib/api";
import {
  Coffee,
  MapPin,
  MenuIcon as Restaurant,
  ParkingCircle,
  Star,
  Tv,
  Wifi,
  Droplets,
  X,
  Check,
} from "lucide-react";
import { Link, useParams } from "react-router";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import BookingForm from "@/components/BookingForm";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";

export default function HotelPage() {
  const { id } = useParams();
  const { data: hotel, isLoading, isError, error } = useGetHotelByIdQuery(id);
  const [createBooking, { isLoading: isCreateBookingLoading }] =
    useCreateBookingMutation();

  const handleBook = async () => {
    try {
      const loadingToastId = toast.loading("Booking your stay...");
      await createBooking({
        hotelId: id,
        checkIn: new Date(),
        checkOut: new Date(),
        roomNumber: 200,
      });
      toast.success("Booking successful", { id: loadingToastId });
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while booking your stay");
    }
  };

  const amenityConfig = [
    { key: "WiFi", label: "Free Wi-Fi", icon: Wifi },
    { key: "Pool", label: "Swimming Pool", icon: Droplets },
    { key: "Parking", label: "Free Parking", icon: ParkingCircle },
    { key: "Restaurant", label: "Restaurant", icon: Restaurant },
  ];

  if (isLoading)
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <Skeleton className="w-full h-[400px] rounded-lg" />
            <div className="flex space-x-2">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-28" />
            </div>
          </div>
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <Skeleton className="h-8 w-64 mb-2" />
                <Skeleton className="h-4 w-48" />
              </div>
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
            <Skeleton className="h-4 w-36" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <Card>
              <CardContent className="p-4">
                <Skeleton className="h-6 w-32 mb-4" />
                <div className="grid grid-cols-2 gap-4">
                  {[...Array(4)].map((_, index) => (
                    <div key={index} className="flex items-center">
                      <Skeleton className="h-5 w-5 mr-2" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <div className="flex items-center justify-between">
              <div>
                <Skeleton className="h-8 w-24 mb-1" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-12 w-32" />
            </div>
          </div>
        </div>
      </div>
    );

  if (isError) return <p className="text-red">Error: {isError.message}</p>;

  // Randomize review values
  const randomRating = (Math.random() * 5).toFixed(1);
  const randomReviews = Math.floor(Math.random() * 5000);

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="relative w-full h-[400px]">
            <img
              src={hotel.image}
              alt={hotel.name}
              className="absolute object-cover rounded-lg w-full h-full"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge
              variant="secondary"
              className="bg-purple-100 text-purple-700"
            >
              Rooftop View
            </Badge>
            <Badge
              variant="secondary"
              className="bg-purple-100 text-purple-700"
            >
              French Cuisine
            </Badge>
            <Badge
              variant="secondary"
              className="bg-purple-100 text-purple-700"
            >
              City Center
            </Badge>
          </div>
        </div>
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-purple-700">
                {hotel.name}
              </h1>
              <div className="flex items-center mt-2">
                <MapPin className="h-5 w-5 text-muted-foreground mr-1" />
                <p className="text-muted-foreground">{hotel.location}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="h-5 w-5 fill-primary text-primary" />
            <span className="font-bold">{randomRating}</span>
            <span className="text-muted-foreground">
              ({randomReviews.toLocaleString()} reviews)
            </span>
          </div>
          <p className="text-muted-foreground">{hotel.description}</p>
          <Card>
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold mb-4">Amenities</h2>
              <div className="grid grid-cols-2 gap-4">
                {amenityConfig.map(({ key, label, icon: Icon }) => {
                  const isAvailable = hotel.amenities.includes(key);
                  return (
                    <div key={key} className="flex items-center space-x-2">
                      {isAvailable ? (
                        <Check className="text-green-600 w-4 h-4" />
                      ) : (
                        <X className="text-red-500 w-4 h-4" />
                      )}
                      <Icon
                        className={`w-5 h-5 ${
                          isAvailable ? "text-black" : "text-red-400"
                        }`}
                      />
                      <span
                        className={`${
                          isAvailable
                            ? "text-black"
                            : "text-muted-foreground line-through"
                        }`}
                      >
                        {label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-purple-700">
                ${hotel.price}
              </p>
              <p className="text-sm text-muted-foreground">per night</p>
            </div>
            <SignedIn>
              <BookingForm hotel={hotel} />
            </SignedIn>
            <SignedOut>
              <Button variant="ghost" asChild>
                <Link to="/sign-in">Log In</Link>
              </Button>
            </SignedOut>
          </div>
        </div>
      </div>
    </div>
  );
}
