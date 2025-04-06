import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner"; // For toast notifications
import AOS from "aos"; // Animate on scroll
import "aos/dist/aos.css"; // AOS CSS
import { useGetBookingsUserQuery } from "@/lib/api";


const AccountPage = () => {

  const { data, isLoading, isError, error } = useGetBookingsUserQuery();

  const { isLoaded, isSignedIn, user } = useUser();
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [expiredBookings, setExpiredBookings] = useState([]);

  useEffect(() => {
    if (data) {
      const now = new Date();
      const upcoming = data.filter((booking) => new Date(booking.checkOut) >= now);
      const expired = data.filter((booking) => new Date(booking.checkOut) < now);

      upcoming.sort((a, b) => new Date(a.checkIn) - new Date(b.checkIn));
      expired.sort((a, b) => new Date(b.checkIn) - new Date(a.checkIn));

      setUpcomingBookings(upcoming);
      setExpiredBookings(expired);
    }

    AOS.init();
  }, [data]);

  if (!isSignedIn) {
    return <Navigate to="/sign-in" />;
  }

  return (
    <main className="container mx-auto px-4 py-8 min-h-screen">
      <h1 className="text-3xl md:text-4xl font-bold">My Account</h1>

      <div className="mt-8">
        <h2 className="text-xl md:text-2xl font-semibold mb-4">Personal Information</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <p className="text-muted-foreground">Name: {user?.fullName}</p>
            <p className="text-muted-foreground">Email: {user?.emailAddresses[0].emailAddress}</p>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-xl md:text-2xl font-semibold mb-4">Your Bookings</h2>
        
        {isLoading && <p>Loading bookings...</p>}
        {error && <p className="text-red-500">An error occurred while fetching bookings.</p>}

        {/* Upcoming Bookings */}
        {upcomingBookings.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold">Upcoming Bookings</h3>
            <div className="space-y-4 mt-4">
              {upcomingBookings.map((booking) => (
                <Card key={booking._id} className="p-4" data-aos="fade-up">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-xl font-semibold">{booking.hotelName}</h4>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(booking.checkIn), "PPP")} -{" "}
                        {format(new Date(booking.checkOut), "PPP")}
                      </p>
                    </div>
                    <Badge variant="outline" className="bg-blue-100 text-blue-600">
                      Upcoming
                    </Badge>
                  </div>

                  <div className="mt-2 text-sm">
                    <p>Room: {booking.roomNumber}</p>
                    <p>Guests: {booking.guests}</p>
                    <p>Total Price: ${booking.totalPrice}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Expired Bookings */}
        {expiredBookings.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold">Expired Bookings</h3>
            <div className="space-y-4 mt-4">
              {expiredBookings.map((booking) => (
                <Card key={booking._id} className="p-4" data-aos="fade-down">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-xl font-semibold">{booking.hotelName}</h4>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(booking.checkIn), "PPP")} -{" "}
                        {format(new Date(booking.checkOut), "PPP")}
                      </p>
                    </div>
                    <Badge variant="outline" className="bg-red-100 text-red-600">
                      Expired
                    </Badge>
                  </div>

                  <div className="mt-2 text-sm">
                    <p>Room: {booking.roomNumber}</p>
                    <p>Guests: {booking.guests}</p>
                    <p>Total Price: ${booking.totalPrice}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* If no bookings available */}
        {!upcomingBookings.length && !expiredBookings.length && (
          <p>No bookings found.</p>
        )}
      </div>
    </main>
  );
};

export default AccountPage;
