"use client";

import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import TreatmentDetail from "./TreatmentDetail"; 

export default function TreatmentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const data = {
    id: searchParams.get("id"), 
    chuong: searchParams.get("chuong"),
    soLuong: searchParams.get("soLuong"),
    loaiBenh: searchParams.get("loaiBenh"),
    ngayPhatHien: searchParams.get("ngayPhatHien"),
  };

  return (
    <TreatmentDetail 
      data={data} 
      onBack={() => router.push("/health")} 
    />
  );
}