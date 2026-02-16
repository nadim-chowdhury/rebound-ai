import { NextResponse } from "next/server";
import {
  mockDashboardStats,
  mockRevenueTrend,
  mockActivity,
} from "@/lib/mock-data";

// Dashboard Stats API
// Returns aggregated dashboard data.
// In production, this queries Supabase for real-time data.

export async function GET() {
  // ============================================
  // PRODUCTION: Query from Supabase
  // ============================================
  // const { data: payments } = await supabase
  //   .from('failed_payments')
  //   .select('*')
  //   .order('created_at', { ascending: false });
  //
  // const stats = calculateStats(payments);

  // ============================================
  // DEMO MODE: Return mock data
  // ============================================
  return NextResponse.json({
    stats: mockDashboardStats,
    revenueTrend: mockRevenueTrend,
    recentActivity: mockActivity,
  });
}
