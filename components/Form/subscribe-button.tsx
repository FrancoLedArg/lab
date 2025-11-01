import { useFormContext } from "@/hooks/form";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";

export default function SubscribeButton({ label }: { label: string }) {
  const form = useFormContext();

  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <Button variant='outline' disabled={isSubmitting} aria-label='submit'>
          {isSubmitting ? <LoaderCircle className='animate-spin' /> : label}
        </Button>
      )}
    </form.Subscribe>
  );
}
