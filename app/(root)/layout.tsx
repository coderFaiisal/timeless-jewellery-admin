"use client";

import { useIsStoreExistQuery } from "@/redux/features/store/storeApi";
import { getAdminInfo } from "@/services/auth.service";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function SetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const admin = getAdminInfo();
  const { data: store, isLoading } = useIsStoreExistQuery({});

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      setLoading(false);
    }
  }, [isLoading]);

  if (!isMounted || loading) {
    return null;
  }

  if (!admin) {
    redirect("/signIn");
  }

  if (store) {
    redirect(`/${store._id}`);
  }

  return <>{children}</>;
}
