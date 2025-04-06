import { useState, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CalendarIcon, Loader2, Bed, Users } from "lucide-react";
import { useRef } from "react";
import { format, addDays, differenceInDays } from "date-fns";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateBookingMutation } from "@/lib/api";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useUser } from "@clerk/clerk-react";

const formSchema = z.object({
  checkIn: z.date({
    required_error: "Check-in date is required",
  }),
  checkOut: z.date({
    required_error: "Check-out date is required",
  }),
  guests: z.string().min(1, "Number of guests is required"),
});

const BookingForm = ({ hotel }) => {
  const dialogCloseRef = useRef(null);
  const { user } = useUser();
  const userId = user?.id;
  const [createBooking, { isLoading: isCreateBookingLoading }] =
    useCreateBookingMutation();
  const [nights, setNights] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      guests: "1",
    },
  });

  const checkInDate = form.watch("checkIn");
  const checkOutDate = form.watch("checkOut");

  // Automatically calculate nights and price when dates change
  useEffect(() => {
    if (checkInDate && checkOutDate) {
      const days = differenceInDays(checkOutDate, checkInDate);
      setNights(days);
      setTotalPrice(days * hotel.price);
    } else {
      setNights(0);
      setTotalPrice(0);
    }
  }, [checkInDate, checkOutDate, hotel.price]);

  const handleBooking = async (data) => {
    try {
      const loadingToastId = toast.loading("Booking your stay...");
      await createBooking({
        userId: userId,
        hotelId: hotel._id,
        checkIn: data.checkIn,
        checkOut: data.checkOut,
        guests: parseInt(data.guests),
        totalPrice: totalPrice,
      });
      toast.success("Booking successful", { id: loadingToastId });
      setTimeout(() => dialogCloseRef.current?.click(), 500)
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while booking your stay");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-fit bg-purple-500 text-white hover:bg-purple-800 hover:text-white py-3 text-lg"
        >
          Book Now
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] px-6 py-8">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-purple-700">
            {hotel.name} | Booking
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Provide the necessary details to create a booking.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleBooking)}
            className="space-y-6"
          >
            <div className="grid grid-cols-2 gap-4">
              {/* Check-in Date */}
              <FormField
                control={form.control}
                name="checkIn"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-sm">Check-in</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-medium text-lg",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? format(field.value, "PPP")
                              : "Pick a date"}
                            <CalendarIcon className="ml-auto h-5 w-5 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            field.onChange(date);
                            form.setValue("checkOut", undefined);
                          }}
                          disabled={(date) =>
                            date < new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage className="text-xs text-red-500 mt-1" />
                  </FormItem>
                )}
              />

              {/* Check-out Date */}
              <FormField
                control={form.control}
                name="checkOut"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-sm">Check-out</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild disabled={!checkInDate}>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-medium text-lg",
                              !field.value && "text-muted-foreground",
                              !checkInDate && "opacity-50 cursor-not-allowed"
                            )}
                          >
                            {field.value
                              ? format(field.value, "PPP")
                              : "Pick a date"}
                            <CalendarIcon className="ml-auto h-5 w-5 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            !checkInDate ||
                            date < addDays(checkInDate, 1) ||
                            date < new Date()
                          }
                          fromDate={
                            checkInDate ? addDays(checkInDate, 1) : undefined
                          }
                          initialFocus
                          className="text-sm"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage className="text-xs text-red-500 mt-1" />
                  </FormItem>
                )}
              />
            </div>

            {/* Number of Guests */}
            <FormField
              control={form.control}
              name="guests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Number of Guests</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <div className="flex items-center">
                          <Users className="h-5 w-5 mr-2" />
                          <SelectValue placeholder="Select guests" />
                        </div>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} {num === 1 ? "guest" : "guests"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs text-red-500 mt-1" />
                </FormItem>
              )}
            />

            {/* Stay Details */}
            {checkInDate && checkOutDate && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm">
                    <Bed className="h-5 w-5 mr-2" />
                    {nights} {nights === 1 ? "night" : "nights"}
                  </div>
                  <div className="text-sm">
                    ${hotel.price} x {nights} nights
                  </div>
                </div>
                <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                  <div>Total</div>
                  <div>${totalPrice.toFixed(2)}</div>
                </div>
              </div>
            )}

            <DialogFooter className="sm:justify-start mt-4">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="secondary"
                  className="w-full py-3 text-lg"
                  ref={dialogCloseRef}
                >
                  Close
                </Button>
              </DialogClose>
              <Button
                type="submit"
                variant="primary"
                className="ml-2 w-full py-3 text-lg bg-purple-600 hover:bg-purple-700 text-white"
                disabled={
                  isCreateBookingLoading || !checkInDate || !checkOutDate
                }
              >
                {isCreateBookingLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Booking...
                  </>
                ) : (
                  "Book Now"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default BookingForm;
