"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Determine if we are on the login page
        const isLoginPage = pathname === "/admin/login";

        // Check for mock session
        const session = localStorage.getItem("admin_session");

        if (!session && !isLoginPage) {
            router.push("/admin/login");
        } else if (session && isLoginPage) {
            router.push("/admin/dashboard");
        } else {
            setIsAuthenticated(true);
        }

        setIsLoading(false);
    }, [pathname, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    // If on login page, just render children (the login form)
    if (pathname === "/admin/login") {
        return <>{children}</>;
    }

    // Protected layout
    return (
        <div className="min-h-screen bg-gray-50">
            {/* We can add a topbar or sidebar here later */}
            {children}
        </div>
    );
}
