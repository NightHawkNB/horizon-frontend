import Hero from "@/components/Hero";
import HotelListings from "@/components/HotelListings";

const HomePage = () => {
  return (
    <main>
      <div className="relative min-h-screen">
        <Hero />
      </div>
      <HotelListings />
    </main>
  )
}

export default HomePage
