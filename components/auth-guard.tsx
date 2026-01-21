'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { Spinner } from './ui/spinner';
import { toast } from 'sonner';

// Map route patterns to permission keys
const routePermissionMap: { pattern: RegExp; key: string }[] = [
  { pattern: /^\/barns/, key: 'HEO_CHUONG' },
  { pattern: /^\/vaccines/, key: 'VAC_XIN' },
  { pattern: /^\/health/, key: 'HEO_BENH' },
  { pattern: /^\/export/, key: 'XUAT_CHUONG' },
  { pattern: /^\/inventory/, key: 'KHO' },
  { pattern: /^\/feeding/, key: 'KHAU_PHAN' },
  { pattern: /^\/finance/, key: 'CHI_PHI' },
  { pattern: /^\/tasks/, key: 'PHAN_CONG' },
  { pattern: /^\/reports/, key: 'BAO_CAO' },
  { pattern: /^\/settings/, key: 'SETTINGS' },
];

function getRequiredPermissionKey(pathname: string): string | null {
  const match = routePermissionMap.find(({ pattern }) => pattern.test(pathname));
  return match ? match.key : null;
}

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false); // Trạng thái sẵn sàng (đã nạp xong store)

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const userPermissions = useAuthStore((state) => state.userPermissions);

  useEffect(() => {
    // 1. Kiểm tra xem quá trình Rehydration đã hoàn tất chưa
    const checkHydration = () => {
      if (useAuthStore.persist.hasHydrated()) {
        setIsReady(true);
      } else {
        // Nếu chưa xong, lắng nghe sự kiện hoàn tất Rehydration
        const unsub = useAuthStore.persist.onFinishHydration(() => {
          setIsReady(true);
        });
        return unsub;
      }
    };

    const unsubHydration = checkHydration();
    return () => {
      if (unsubHydration) unsubHydration();
    };
  }, []);

  useEffect(() => {
    // 2. CHỈ thực hiện logic chuyển hướng khi Rehydration đã SẴN SÀNG
    if (!isReady) return;

    // Kiểm tra đăng nhập
    if (!isAuthenticated) {
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }

    // Kiểm tra quyền truy cập
    const requiredKey = getRequiredPermissionKey(pathname);
    if (requiredKey && !userPermissions.includes(requiredKey)) {
      toast('Không có quyền truy cập', {
        description: 'Bạn không có quyền truy cập vào trang này',
      });
      router.back();
      return;
    }
  }, [isReady, isAuthenticated, userPermissions, router, pathname]);

  // 3. Trong khi chờ nạp dữ liệu từ localStorage HOẶC khi chưa có quyền, hiện Spinner
  if (!isReady || !isAuthenticated) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Spinner />
          {/* <p className="text-sm text-gray-400">Verifying session...</p> */}
        </div>
      </div>
    );
  }

  // Kiểm tra quyền truy cập trước khi render
  const requiredKey = getRequiredPermissionKey(pathname);
  if (requiredKey && !userPermissions.includes(requiredKey)) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black text-white">
        <div className="flex flex-col items-center gap-2">
          <Spinner />
        </div>
      </div>
    );
  }

  // 4. Khi đã nạp xong và đã login, render nội dung
  return <>{children}</>;
}