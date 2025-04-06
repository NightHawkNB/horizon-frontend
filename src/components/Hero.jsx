import { useState } from "react";
import { motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useDispatch } from "react-redux";
import { submit } from "@/lib/features/searchSlice";
import { SignedOut } from "@clerk/clerk-react";
import { Link } from "react-router";

AOS.init({
  duration: 500,
  easing: "ease-in-out",
  once: false,
  mirror: true,
});

//* Form schema using Zod
const formSchema = z
  .object({
    query: z.string().min(1, "Destination is required"),
    requirements: z.string().optional(),
    checkIn: z.date({
      // required_error: "Check-in date is required",
    }),
    checkOut: z
      .date({
        // required_error: "Check-out date is required",
      })
      .refine((data) => data > new Date(), {
        message: "Check-out date must be in the future",
      }),
  })
  .refine((data) => data.checkOut > data.checkIn, {
    message: "Check-out date must be after check-in date",
    path: ["checkOut"],
  });

const Hero = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query: "",
      requirements: "",
    },
  });

  const onSubmit = (data) => {
    setIsLoading(true);

    const searchQuery = `${data.query} having ${data.requirements}`;
    console.log("Search Query:", searchQuery);

    dispatch(submit(searchQuery));
    setIsLoading(false);

    //* Scroll to the hotel listing section
    const hotelListingElement = document.getElementById("hotel-listing");
    if (hotelListingElement) {
      hotelListingElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Hero Section with Background Image */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center z-1"
          style={{
            backgroundImage: "url('/assets/hero/hero.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            filter: "blur(3px) brightness(0.7)",
            transform: "scale(1.05)",
          }}
        />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center" data-aos="fade-down">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Find Your Perfect Stay
            </h1>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto">
              Discover amazing hotels and resorts tailored to your preferences
            </p>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20 -mt-16" data-aos="fade-up">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-xl shadow-xl p-6 md:p-8">
            <h2 className="text-2xl font-semibold text-purple-800 mb-6">
              Advanced Search
            </h2>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="query"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-purple-700">
                          Destination or Hotel Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Where do you want to stay?"
                            {...field}
                            className="focus-visible:ring-purple-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="requirements"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-purple-700">
                          Special Requirements
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. ocean view, pet-friendly"
                            {...field}
                            className="focus-visible:ring-purple-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="checkIn"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-purple-700">
                          Check-in Date
                        </FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date < new Date(new Date().setHours(0, 0, 0, 0))
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="checkOut"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-purple-700">
                          Check-out Date
                        </FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date <=
                                (form.getValues("checkIn") ||
                                  new Date(new Date().setHours(0, 0, 0, 0)))
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end pt-2 gap-3 items-stretch">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      className="w-full md:w-auto px-8 py-6 bg-purple-600 hover:bg-purple-700 text-white font-medium"
                      disabled={isLoading}
                    >
                      {isLoading ? "Searching..." : "Find Hotels"}
                    </Button>
                  </motion.div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => dispatch(submit(""))}
                    className="w-full md:w-auto px-8 py-6 bg-white hover:bg-purple-200 border-purple-300 border-2 text-purple-500 font-medium"
                  >
                    Clear
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <SignedOut>
        <section className="px-4 sm:px-6 lg:px-8 py-20 bg-purple-900 text-white">
          <div className="max-w-4xl mx-auto text-center" data-aos="zoom-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready for your next adventure?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Sign up now to get exclusive deals and personalized
              recommendations.
            </p>
            <motion.button
              className="px-8 py-3 bg-white text-purple-900 font-medium rounded-lg hover:bg-purple-100 transition duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Sign Up for Free
            </motion.button>
            <Button variant="ghost" asChild>
              <Link to="/sign-in">Log In</Link>
            </Button>
            <Button asChild>
              <Link to="/sign-up">Sign Up</Link>
            </Button>
          </div>
        </section>
      </SignedOut>
    </div>
  );
};

export default Hero;
