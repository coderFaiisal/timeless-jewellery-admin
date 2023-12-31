"use client";

import { redirect, useParams, useRouter } from "next/navigation";

import { Plus } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/dataTable";
import { CategoryColumn, columns } from "./columns";
import { useGetAllCategoriesQuery } from "@/redux/features/category/categoryApi";
import { getAdminInfo } from "@/services/auth.service";

export const CategoriesClient = () => {
  const admin = getAdminInfo();
  if (!admin) {
    redirect("/signIn");
  }

  const params = useParams();
  const storeId = params.storeId;

  const router = useRouter();

  const { data: categories = [], isLoading } =
    useGetAllCategoriesQuery(storeId);

  if (isLoading) {
    return null;
  }

  const formattedCategories: CategoryColumn[] = categories?.map(
    (item: any) => ({
      id: item?._id,
      name: item?.name,
      code: item?.code,
      storeId: item?.storeId?._id,
      billboardId: item?.billboardId?._id,
      billboardLabel: item?.billboardId?.label,
      createdAt: format(new Date(item?.createdAt), "MMMM do, yyyy"),
    })
  );

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Categories (${formattedCategories?.length})`}
          description="Manage categories for your store"
        />
        <Button
          onClick={() => router.push(`/${params?.storeId}/categories/new`)}
        >
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable
        searchKey="name"
        columns={columns}
        data={formattedCategories}
      />
    </>
  );
};
