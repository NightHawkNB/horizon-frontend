import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

// Initialize AOS
AOS.init({
  duration: 800,
  easing: 'ease-in-out',
  once: false,
  mirror: true
});

// Form schema using Zod
const formSchema = z.object({
  query: z.string().min(1, 'Destination is required'),
  requirements: z.string().optional(),
  checkIn: z.date({
    required_error: "Check-in date is required",
  }),
  checkOut: z.date({
    required_error: "Check-out date is required",
  }).refine(data => data > new Date(), {
    message: "Check-out date must be in the future",
  }),
}).refine(data => data.checkOut > data.checkIn, {
  message: "Check-out date must be after check-in date",
  path: ["checkOut"],
});

const Hero = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query: '',
      requirements: '',
    },
  });

  const onSubmit = (data) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      navigate('/results', { 
        state: { 
          searchParams: {
            ...data,
            checkIn: format(data.checkIn, 'yyyy-MM-dd'),
            checkOut: format(data.checkOut, 'yyyy-MM-dd'),
          }
        } 
      });
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Hero Section with Background Image */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8 bg-purple-900/80">
        <div 
          className="absolute inset-0 bg-[url('/assets/hero/hero.jpg')] bg-cover bg-center bg-no-repeat -z-10"
          style={{
            backgroundImage: "linear-gradient(to bottom, rgba(76, 29, 149, 0.8), rgba(76, 29, 149, 0.6)), url('/assets/hero/hero.jpg')"
          }}
        />
        <div className="max-w-7xl mx-auto">
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
            <h2 className="text-2xl font-semibold text-purple-800 mb-6">Advanced Search</h2>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="query"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-purple-700">Destination or Hotel Name</FormLabel>
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
                        <FormLabel className="text-purple-700">Special Requirements</FormLabel>
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
                        <FormLabel className="text-purple-700">Check-in Date</FormLabel>
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
                        <FormLabel className="text-purple-700">Check-out Date</FormLabel>
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
                                date <= (form.getValues('checkIn') || new Date(new Date().setHours(0, 0, 0, 0)))
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
                
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    type="submit" 
                    className="w-full md:w-auto px-8 py-6 bg-purple-600 hover:bg-purple-700 text-white font-medium"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Searching...' : 'Find Hotels'}
                  </Button>
                </motion.div>
              </form>
            </Form>
          </div>
        </div>
      </section>

      {/* Featured Section (Placeholder) */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-purple-900 mb-10 text-center" data-aos="fade-up">
            Featured Hotels
          </h2>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="rounded-xl overflow-hidden shadow-md" data-aos="fade-up" data-aos-delay={index * 100}>
                  <Skeleton className="h-48 w-full bg-purple-100" />
                  <div className="p-4">
                    <Skeleton className="h-6 w-3/4 bg-purple-100 mb-2" />
                    <Skeleton className="h-4 w-1/2 bg-purple-100 mb-3" />
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-4 w-1/4 bg-purple-100" />
                      <Skeleton className="h-8 w-20 bg-purple-100 rounded-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-purple-700">
              <p>Search for hotels to see results</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 bg-purple-900 text-white">
        <div className="max-w-4xl mx-auto text-center" data-aos="zoom-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready for your next adventure?</h2>
          <p className="text-xl mb-8 opacity-90">
            Sign up now to get exclusive deals and personalized recommendations.
          </p>
          <motion.button
            className="px-8 py-3 bg-white text-purple-900 font-medium rounded-lg hover:bg-purple-100 transition duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Sign Up for Free
          </motion.button>
        </div>
      </section>
    </div>
  );
};

export default Hero;