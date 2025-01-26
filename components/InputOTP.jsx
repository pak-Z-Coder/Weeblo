import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Key, LoaderCircle, Popcorn } from "lucide-react";
import { cn } from "@/lib/utils";

const FormSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time passkey must be 6 characters.",
  }),
});

const InputOTPForm = ({ SetPasskey, loading, error = false, path }) => {
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  });

  function onSubmit(data) {
    SetPasskey(data.pin);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-2/3 space-y-6 sm:flex sm:items-center justify-between space-x-2">
        <FormField
          control={form.control}
          name="pin"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold">
                {path == "rooms" ? "Enter Passkey" : "Set PassKey"}
              </FormLabel>
              <FormControl>
                <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          variant="ghost"
          type="submit"
          className={cn(
            "ml-auto hover:text-primary",
            path == "rooms" && "bg-primary/20"
          )}>
          {loading ? (
            <LoaderCircle className="animate-spin" />
          ) : path == "rooms" ? (
            <Key className="w-4 " />
          ) : (
            <span className="flex  items-center gap-1">
              <p className="text-xs font-bold">Create Cinema</p>
              <Popcorn className="w-4" />
            </span>
          )}
        </Button>
        <p className="mt-1 text-red-500 text-xs">
          {error && "Invalid Passkey!"}
        </p>
      </form>
    </Form>
  );
};
export default InputOTPForm;
