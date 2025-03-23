"use client";

/* eslint-disable @typescript-eslint/no-unused-vars */
// app/admin/page.tsx

import { CompanyImport } from "@/components/CompanyImport";
import { LeadPricingSettings } from "@/components/admin/LeadPricingSettings";
import { LeadCreditsManager } from "@/components/admin/leads/LeadCreditsManager";
import { LeadDatabase } from "@/components/admin/leads/LeadDatabase";
import { LeadManagementDashboard } from "@/components/admin/leads/LeadManagementDashboard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface ApiError {
  status?: number;
  message?: string;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: ApiError) => {
        if (error?.status === 401 || error?.status === 403) return false;
        return failureCount < 3;
      },
      meta: {
        errorHandler: (error: ApiError) => {
          if (error?.status === 401 || error?.status === 403) {
            console.error("Authentication error:", error);
            window.location.href = "/login";
          }
        },
      },
    },
  },
});

const AdminPage = () => {
  const { toast } = useToast();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const currentSession = data.session;

        if (!currentSession) {
          router.push("/login");
          return;
        }

        const expiresAt = currentSession.expires_at || 0;
        const now = Math.floor(Date.now() / 1000);
        const timeUntilExpiry = expiresAt - now;

        if (timeUntilExpiry < 300) {
          const { data: refreshData, error } = await supabase.auth.refreshSession();
          if (error) throw error;
          setSession(refreshData.session);
        } else {
          setSession(currentSession);
        }
      } catch (error) {
        console.error("Session error:", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_OUT" || !session) {
          router.push("/login");
        } else {
          setSession(session);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  const handleLogout = async () => {
    try {
      setSession(null);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast({ title: "Success", description: "Logged out successfully" });
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
      router.push("/login");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-8 space-y-8">
        <div className="flex justify-between items-center mb-8">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="space-y-8">
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-[200px] w-full" />
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="container mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <Button
            variant="destructive"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Log Out
          </Button>
        </div>

        <Tabs defaultValue="leads" className="space-y-8">
          <TabsList>
            <TabsTrigger value="leads">Lead Management</TabsTrigger>
            <TabsTrigger value="database">Lead Database</TabsTrigger>
            <TabsTrigger value="credits">Lead Credits</TabsTrigger>
            <TabsTrigger value="pricing">Lead Pricing</TabsTrigger>
            <TabsTrigger value="companies">Companies</TabsTrigger>
            <TabsTrigger value="blog">Blog</TabsTrigger>
          </TabsList>

          <TabsContent value="leads">
            <LeadManagementDashboard />
          </TabsContent>

          <TabsContent value="database">
            <LeadDatabase />
          </TabsContent>

          <TabsContent value="credits">
            <LeadCreditsManager />
          </TabsContent>

          <TabsContent value="pricing">
            <LeadPricingSettings />
          </TabsContent>

          <TabsContent value="companies">
            <CompanyImport />
          </TabsContent>

          <TabsContent value="blog">{/* <BlogManagement /> */}</TabsContent>
        </Tabs>
      </div>
    </QueryClientProvider>
  );
};

export default AdminPage;

//! vite
// import { CompanyImport } from "@/components/CompanyImport";
// import { LeadPricingSettings } from "@/components/admin/LeadPricingSettings";
// import { LeadCreditsManager } from "@/components/admin/leads/LeadCreditsManager";
// import { LeadDatabase } from "@/components/admin/leads/LeadDatabase";
// import { LeadManagementDashboard } from "@/components/admin/leads/LeadManagementDashboard";
// import { Button } from "@/components/ui/button";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { useToast } from "@/hooks/use-toast";
// import { supabase } from "@/integrations/supabase/client";
// import { Session } from "@supabase/supabase-js";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { LogOut } from "lucide-react";
// import { useEffect, useState } from "react";
// import { Navigate, useNavigate } from "react-router-dom";

// interface ApiError {
//   status?: number;
//   message?: string;
// }

// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       retry: (failureCount, error: ApiError) => {
//         if (error?.status === 401 || error?.status === 403) {
//           return false;
//         }
//         return failureCount < 3;
//       },
//       meta: {
//         errorHandler: (error: ApiError) => {
//           if (error?.status === 401 || error?.status === 403) {
//             console.error("Authentication error:", error);
//             window.location.href = "/login";
//           }
//         },
//       },
//     },
//   },
// });

// const Admin = () => {
//   const { toast } = useToast();
//   const [session, setSession] = useState<Session | null>(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const checkSession = async () => {
//       try {
//         const {
//           data: { session: currentSession },
//         } = await supabase.auth.getSession();

//         if (!currentSession) {
//           navigate("/login");
//           return;
//         }

//         // Check token expiration
//         const expiresAt = currentSession?.expires_at || 0;
//         const now = Math.floor(Date.now() / 1000);
//         const timeUntilExpiry = expiresAt - now;

//         if (timeUntilExpiry < 300) {
//           // less than 5 minutes
//           const { data, error } = await supabase.auth.refreshSession();
//           if (error) {
//             throw error;
//           }
//           setSession(data.session);
//         } else {
//           setSession(currentSession);
//         }
//       } catch (error) {
//         console.error("Session error:", error);
//         navigate("/login");
//       } finally {
//         setLoading(false);
//       }
//     };

//     checkSession();

//     const {
//       data: { subscription },
//     } = supabase.auth.onAuthStateChange(async (event, session) => {
//       if (event === "SIGNED_OUT" || !session) {
//         setSession(null);
//         navigate("/login");
//         return;
//       }
//       setSession(session);
//     });

//     return () => {
//       subscription.unsubscribe();
//     };
//   }, [navigate]);

//   const handleLogout = async () => {
//     try {
//       // First clear the session state
//       setSession(null);

//       // Then attempt to sign out
//       const { error } = await supabase.auth.signOut();
//       if (error) throw error;

//       toast({
//         title: "Success",
//         description: "Logged out successfully",
//       });
//       navigate("/login");
//     } catch (error) {
//       console.error("Error signing out:", error);
//       toast({
//         title: "Error",
//         description: "Failed to log out. Please try again.",
//         variant: "destructive",
//       });
//       // Still redirect to login page even if logout fails
//       navigate("/login");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="container mx-auto p-8 space-y-8">
//         <div className="flex justify-between items-center mb-8">
//           <Skeleton className="h-8 w-48" />
//           <Skeleton className="h-10 w-24" />
//         </div>
//         <div className="space-y-8">
//           <Skeleton className="h-[200px] w-full" />
//           <Skeleton className="h-[200px] w-full" />
//         </div>
//       </div>
//     );
//   }

//   if (!session) {
//     return <Navigate to="/login" replace />;
//   }

//   return (
//     <QueryClientProvider client={queryClient}>
//       <div className="container mx-auto p-8">
//         <div className="flex justify-between items-center mb-8">
//           <h1 className="text-2xl font-bold">Admin Dashboard</h1>
//           <Button
//             variant="destructive"
//             onClick={handleLogout}
//             className="flex items-center gap-2"
//           >
//             <LogOut className="w-4 h-4" />
//             Log Out
//           </Button>
//         </div>

//         <Tabs defaultValue="leads" className="space-y-8">
//           <TabsList>
//             <TabsTrigger value="leads">Lead Management</TabsTrigger>
//             <TabsTrigger value="database">Lead Database</TabsTrigger>
//             <TabsTrigger value="credits">Lead Credits</TabsTrigger>
//             <TabsTrigger value="pricing">Lead Pricing</TabsTrigger>
//             <TabsTrigger value="companies">Companies</TabsTrigger>
//             <TabsTrigger value="blog">Blog</TabsTrigger>
//           </TabsList>

//           <TabsContent value="leads">
//             <LeadManagementDashboard />
//           </TabsContent>

//           <TabsContent value="database">
//             <LeadDatabase />
//           </TabsContent>

//           <TabsContent value="credits">
//             <LeadCreditsManager />
//           </TabsContent>

//           <TabsContent value="pricing">
//             <LeadPricingSettings />
//           </TabsContent>

//           <TabsContent value="companies">
//             <CompanyImport />
//           </TabsContent>

//           <TabsContent value="blog">{/* <BlogManagement /> */}</TabsContent>
//         </Tabs>
//       </div>
//     </QueryClientProvider>
//   );
// };

// export default Admin;
