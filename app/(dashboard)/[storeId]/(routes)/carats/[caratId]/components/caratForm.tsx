"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Trash } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import { AlertModal } from "@/components/modals/alertModal";

import CustomLoader from "@/components/customLoader";
import { RingLoader } from "react-spinners";
import {
  useCreateCaratMutation,
  useDeleteCaratMutation,
  useUpdateCaratMutation,
} from "@/redux/features/carat/caratApi";

const formSchema = z.object({
  name: z.string().min(1),
  value: z.string().min(1),
});

type CaratFormValues = z.infer<typeof formSchema>;

interface CaratFormProps {
  initialData: any;
}

export const CaratForm: React.FC<CaratFormProps> = ({ initialData }) => {
  const params = useParams();
  const id = params.caratId;
  const storeId = params.storeId;

  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [createCarat] = useCreateCaratMutation();
  const [updateCarat] = useUpdateCaratMutation();
  const [deleteCarat] = useDeleteCaratMutation();

  const title = initialData ? "Edit carat" : "Create carat";
  const description = initialData ? "Edit a carat" : "Add a new carat";

  const action = initialData ? "Save changes" : "Create";

  const form = useForm<CaratFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      label: "",
      imageURL: "",
    },
  });

  const onSubmit = async (data: CaratFormValues) => {
    setLoading(true);

    if (initialData) {
      const res: any = await updateCarat({ id, data });

      if (res?.data?._id) {
        router.push(`/${params.storeId}/carats`);
        toast.success("Carat updated successfully");
      } else if (res?.error) {
        toast.error(res?.error?.message);
      }
    } else {
      const caratData = {
        name: data.name,
        value: data.value,
        storeId,
      };

      const res: any = await createCarat(caratData);

      if (res?.data?._id) {
        router.push(`/${params.storeId}/carats`);
        toast.success("Carat created successfully");
      } else if (res?.error) {
        toast.error(res?.error?.message);
      }
    }

    setLoading(false);
  };

  const onDelete = async () => {
    setLoading(true);

    const res: any = await deleteCarat(id);

    if (res?.data?._id) {
      router.push(`/${params.storeId}/carats`);
      toast.success("Carat deleted successfully");
    } else if (res?.error) {
      toast.error(res?.error?.message);
    }

    setLoading(false);
    setOpen(false);
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="grid md:grid-cols-3 gap-4 md:gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Carat name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Carat value"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {loading ? (
              <>
                {action}
                <CustomLoader>
                  <RingLoader color="#ffffff" size={30} />
                </CustomLoader>
              </>
            ) : (
              action
            )}
          </Button>
        </form>
      </Form>
    </>
  );
};
