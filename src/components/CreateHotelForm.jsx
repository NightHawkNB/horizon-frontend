import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useCreateHotelMutation } from "@/lib/api";

const formSchema = z.object({
  name: z.string().min(1, { message: "Hotel name is required" }),
  location: z.string().min(1),
  image: z.string().min(1),
  price: z.number(),
  description: z.string().min(1),
  amenities: z.array(z.string()).optional(),
});

const AMENITIES = ["WiFi", "Parking", "Pool", "Gym"];

const CreateHotelForm = () => {
  const [createHotel, { isLoading }] = useCreateHotelMutation();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amenities: [],
    },
  });

  const handleSubmit = async (values) => {
    const { name, location, image, price, description, amenities } = values;
    try {
      const toastId = toast.loading("Creating hotel...");
      await createHotel({
        name,
        location,
        image,
        price,
        description,
        amenities,
      }).unwrap();
      toast.dismiss(toastId);
      toast.success("Hotel created successfully");
      form.reset();
    } catch (error) {
      toast.error("Hotel creation failed");
    }
  };

  return (
    <Form {...form}>
      <form
        className="max-w-xl w-full mx-auto p-6 space-y-6 border rounded-xl shadow-sm"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <h2 className="text-2xl font-semibold">Create New Hotel</h2>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hotel Name</FormLabel>
              <FormControl>
                <Input placeholder="Hotel Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="Location" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/image.jpg" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="100"
                  onChange={(e) => {
                    field.onChange(parseFloat(e.target.value));
                  }}
                  value={field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Description of the hotel..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Amenities Section */}
        <FormField
          control={form.control}
          name="amenities"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amenities</FormLabel>
              <div className="grid grid-cols-2 gap-2">
                {AMENITIES.map((item) => (
                  <FormField
                    key={item}
                    control={form.control}
                    name="amenities"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={item}
                          className="flex flex-row items-center space-x-2"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, item])
                                  : field.onChange(
                                      field.value?.filter((val) => val !== item)
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">{item}</FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white text-md py-2"
          disabled={isLoading}
        >
          {isLoading ? "Creating..." : "Create Hotel"}
        </Button>
      </form>
    </Form>
  );
};

export default CreateHotelForm;
