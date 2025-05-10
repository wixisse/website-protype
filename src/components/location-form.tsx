'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const FormSchema = z.object({
  location: z.string().min(2, {
    message: 'Location must be at least 2 characters.',
  }),
});

interface LocationFormProps {
  onLocationSubmit: (location: string) => void;
  isLoading: boolean;
}

export function LocationForm({ onLocationSubmit, isLoading }: LocationFormProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      location: '',
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    onLocationSubmit(data.location);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2 items-end w-full max-w-md">
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem className="flex-grow">
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="E.g., Paris, France" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} aria-label="Get Weather">
          <Search className="mr-2 h-4 w-4" /> {isLoading ? 'Loading...' : 'Search'}
        </Button>
      </form>
    </Form>
  );
}
