"use client"
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const authStore = useAuthStore()
  const router = useRouter();
  useEffect(() => {
    if (authStore.isAuthenticated) {
      router.push('/barns');
    } else {
      router.push('/login');
    }
  }, [authStore, router]);
}
