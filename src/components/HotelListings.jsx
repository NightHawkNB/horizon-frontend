import { useGetHotelsForSearchQuery } from "@/lib/api";
import { useState } from "react";
import HotelCard from "./HotelCard";
import LocationTab from "./LocationTab";
import { useSelector } from "react-redux";
import { Skeleton } from "@/components/ui/skeleton";

export default function HotelListings() {
  const searchValue = useSelector((state) => state.search.value);

  const { data: hotels, isLoading, isError, error } = useGetHotelsForSearchQuery({
    searchQuery: searchValue,
  });

  const locations = ["ALL", "France", "Italy", "Australia", "Japan"];
  const [selectedLocation, setSelectedLocation] = useState("ALL");

  const handleSelectedLocation = (location) => {
    setSelectedLocation(location);
  };

  const filteredHotels =
    selectedLocation === "ALL"
      ? hotels
      : hotels.filter(({ hotel }) =>
          hotel.location.toLowerCase().includes(selectedLocation.toLowerCase())
        );

  return (
    <section className="px-6 sm:px-8 md:px-12 py-10 lg:py-16 bg-gradient-to-b from-purple-50 to-white">
      <div className="mb-10" data-aos="fade-up">
        <h2 id="hotel-listing" className="text-3xl md:text-4xl font-extrabold text-purple-700 mb-3">
          Top trending hotels worldwide
        </h2>
        <p className="text-md md:text-lg text-purple-500 max-w-xl">
          Discover the most trending hotels worldwide for an unforgettable experience.
        </p>
      </div>

      <div
        className="flex flex-wrap items-center gap-3 md:gap-4 mb-8"
        data-aos="fade-up"
        data-aos-delay="100"
      >
        {locations.map((location, i) => (
          <LocationTab
            key={i}
            selectedLocation={selectedLocation}
            name={location}
            onClick={handleSelectedLocation}
          />
        ))}
      </div>

      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
        data-aos="fade-up"
        data-aos-delay="200"
      >
        {isLoading &&
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-4" data-aos="fade-up">
              <Skeleton className="h-48 rounded-xl" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))
        }

        {!isLoading && isError && (
          <p className="text-red-500">{error}</p>
        )}

        {!isLoading &&
          !isError &&
          filteredHotels.map(({ hotel, confidence }, index) => (
            <div key={hotel._id} data-aos="fade-up" data-aos-delay={index * 100}>
              <HotelCard hotel={hotel} confidence={confidence} />
            </div>
          ))}
      </div>
    </section>
  );
}
