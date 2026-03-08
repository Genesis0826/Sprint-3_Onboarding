import React, { useState, useMemo, useEffect } from "react";
import { View, Text, ScrollView, SafeAreaView, StatusBar, TextInput, ActivityIndicator } from "react-native";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
import { MetricCard } from "../components/MetricCard";
import { Colors } from "../constants/colors";
import { UserSession, authFetch } from "../services/auth";
import { API_BASE_URL } from "../lib/api";

type Employee = {
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  role_id: string;
};

export const ManagerDashboardScreen = ({ route, navigation }: any) => {
  const session: UserSession = route.params.session;
  const [search, setSearch] = useState("");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [usersRes, statsRes] = await Promise.all([
          authFetch(`${API_BASE_URL}/users`),
          authFetch(`${API_BASE_URL}/users/stats`),
        ]);
        const usersData = await usersRes.json().catch(() => []);
        const statsData = await statsRes.json().catch(() => ({}));
        if (!cancelled) {
          setEmployees(Array.isArray(usersData) ? usersData : []);
          setTotalCount(statsData?.total ?? null);
        }
      } catch {
        // session expired or network error — leave empty state
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return employees.filter((e) => {
      const fullName = [e.first_name, e.last_name].filter(Boolean).join(" ").toLowerCase();
      return fullName.includes(q) || e.email.toLowerCase().includes(q);
    });
  }, [search, employees]);

  return (
    <SafeAreaView style={{ backgroundColor: Colors.bgApp }} className="flex-1">
      <StatusBar barStyle="dark-content" />
      <View className="flex-1 flex-row">
        <Sidebar role="manager" userName={session.name} activeScreen="Dashboard" navigation={navigation} />
        <View className="flex-1">
          <Header role="manager" userName={session.name} />
          <ScrollView className="flex-1 px-4 py-4" showsVerticalScrollIndicator={false}>

            <View className="flex-row gap-3 mb-4">
              <MetricCard
                label="Team Size"
                value={totalCount !== null ? String(totalCount) : "—"}
                sub="Direct Reports"
                trend="Stable"
              />
              <MetricCard label="Pending Requests" value="—" sub="Time-off approvals" trend="N/A" alert />
            </View>
            <View className="mb-4">
              <MetricCard label="Approvals Needed" value="—" sub="Performance reviews" trend="Pending" />
            </View>

            <View className="rounded-2xl bg-white shadow-sm mb-6 overflow-hidden">
              <View style={{ backgroundColor: Colors.bgMuted, borderBottomColor: Colors.border }} className="px-4 pt-4 pb-3 border-b">
                <Text style={{ color: Colors.textPrimary }} className="font-bold text-base">Direct Reports</Text>
                <Text style={{ color: Colors.textMuted }} className="text-xs mt-0.5">Monitor team status</Text>
                <View style={{ borderColor: Colors.border }} className="mt-3 flex-row items-center rounded-xl border bg-white px-3 py-2.5">
                  <Text style={{ color: Colors.textPlaceholder }} className="mr-2">🔍</Text>
                  <TextInput value={search} onChangeText={setSearch} placeholder="Search team..."
                    placeholderTextColor={Colors.textPlaceholder} style={{ color: Colors.textPrimary }}
                    className="flex-1 text-xs" />
                </View>
              </View>

              <View style={{ backgroundColor: Colors.bgSubtle, borderBottomColor: Colors.border }} className="flex-row px-4 py-2 border-b">
                <Text style={{ color: Colors.textPlaceholder }} className="flex-1 text-[9px] font-bold uppercase tracking-widest">Member</Text>
                <Text style={{ color: Colors.textPlaceholder }} className="w-16 text-[9px] font-bold uppercase tracking-widest">Status</Text>
              </View>

              {loading ? (
                <View className="px-4 py-8 items-center">
                  <ActivityIndicator color={Colors.primary} />
                </View>
              ) : (
                <>
                  {filtered.map((row) => {
                    const fullName = [row.first_name, row.last_name].filter(Boolean).join(" ") || row.email;
                    const initials = (row.first_name?.charAt(0) ?? row.email.charAt(0)).toUpperCase();
                    return (
                      <View key={row.user_id} style={{ borderBottomColor: Colors.bgSubtle }} className="flex-row items-center px-4 py-3 border-b">
                        <View className="flex-1 flex-row items-center">
                          <View style={{ backgroundColor: Colors.primaryLight, borderColor: Colors.primaryBorder }}
                            className="h-9 w-9 rounded-full items-center justify-center mr-3 border">
                            <Text style={{ color: Colors.primary }} className="font-bold text-sm">{initials}</Text>
                          </View>
                          <View className="flex-1">
                            <Text style={{ color: Colors.textPrimary }} className="font-semibold text-sm">{fullName}</Text>
                            <Text style={{ color: Colors.textPlaceholder }} className="text-[10px]">{row.email}</Text>
                          </View>
                        </View>
                        <View className="w-16 items-end">
                          <View style={{ backgroundColor: Colors.success + "22" }} className="px-2 py-0.5 rounded-full">
                            <Text style={{ color: Colors.successText }} className="text-[9px] font-bold uppercase">Active</Text>
                          </View>
                        </View>
                      </View>
                    );
                  })}

                  {filtered.length === 0 && (
                    <View className="px-4 py-8 items-center">
                      <Text style={{ color: Colors.textPlaceholder }} className="text-sm">No team members found.</Text>
                    </View>
                  )}
                </>
              )}

              <View style={{ backgroundColor: Colors.bgMuted }} className="px-4 py-3">
                <Text style={{ color: Colors.textPlaceholder }} className="text-[10px] font-bold uppercase tracking-widest">
                  Showing {filtered.length} of {employees.length} members
                </Text>
              </View>
            </View>

          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};
