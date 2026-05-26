/**
 * /studio sidebar item: "📊 Dashboard"
 *
 * CRM-style landing view for clinic staff — opens to live counters of new,
 * contacted, confirmed bookings; today's schedule; this week's volume;
 * 30-day conversion rate; and shortlists of new + upcoming confirmed
 * appointments. Refreshes every 30 seconds so a phone call back at the
 * desk just shows up.
 *
 * Pure Studio component (runs in the browser inside the Studio bundle),
 * so no "use client" directive is needed and no server boundaries apply.
 */
import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  Flex,
  Grid,
  Heading,
  Inline,
  Spinner,
  Stack,
  Text,
} from "@sanity/ui";
import {
  CalendarIcon,
  ClockIcon,
  RefreshIcon,
  UsersIcon,
} from "@sanity/icons";
import { useClient } from "sanity";

const QUERY = /* groq */ `{
  "counts": {
    "new": count(*[_type == "appointment" && status == "new"]),
    "contacted": count(*[_type == "appointment" && status == "contacted"]),
    "confirmed": count(*[_type == "appointment" && status == "confirmed"]),
    "completed": count(*[_type == "appointment" && status == "completed"]),
    "cancelled": count(*[_type == "appointment" && status == "cancelled"]),
    "noShow": count(*[_type == "appointment" && status == "noShow"])
  },
  "todayAll": count(*[_type == "appointment" && preferredDate == $today]),
  "todayConfirmed": count(*[_type == "appointment" && status == "confirmed" && preferredDate == $today]),
  "thisWeekSubmitted": count(*[_type == "appointment" && submittedAt >= $weekAgo]),
  "last30dNew": count(*[_type == "appointment" && submittedAt >= $monthAgo]),
  "last30dConfirmed": count(*[_type == "appointment" && status in ["confirmed","completed"] && submittedAt >= $monthAgo]),
  "recentNew": *[_type == "appointment" && status == "new"] | order(submittedAt desc) [0...5] {
    _id, name, phone, concern, preferredDate, preferredTime, submittedAt
  },
  "upcomingConfirmed": *[_type == "appointment" && status == "confirmed" && preferredDate >= $today] | order(preferredDate asc, preferredTime asc) [0...5] {
    _id, name, phone, concern, preferredDate, preferredTime
  }
}`;

type ApptStub = {
  _id: string;
  name?: string;
  phone?: string;
  concern?: string;
  preferredDate?: string;
  preferredTime?: string;
  submittedAt?: string;
};

type DashboardData = {
  counts: {
    new: number;
    contacted: number;
    confirmed: number;
    completed: number;
    cancelled: number;
    noShow: number;
  };
  todayAll: number;
  todayConfirmed: number;
  thisWeekSubmitted: number;
  last30dNew: number;
  last30dConfirmed: number;
  recentNew: ApptStub[];
  upcomingConfirmed: ApptStub[];
};

const REFRESH_MS = 30_000;

function makeQueryParams() {
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
  return { today, weekAgo, monthAgo };
}

function relativeTime(iso?: string): string {
  if (!iso) return "";
  const then = new Date(iso).getTime();
  const diff = Date.now() - then;
  const mins = Math.round(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

function StatCard({
  label,
  value,
  tone = "default",
  hint,
}: {
  label: string;
  value: number | string;
  tone?: "default" | "primary" | "positive" | "caution" | "critical";
  hint?: string;
}) {
  return (
    <Card padding={4} radius={3} shadow={1} tone={tone}>
      <Stack space={3}>
        <Text size={1} muted weight="medium">
          {label}
        </Text>
        <Heading size={4}>{value}</Heading>
        {hint && (
          <Text size={1} muted>
            {hint}
          </Text>
        )}
      </Stack>
    </Card>
  );
}

function ApptRow({ a }: { a: ApptStub }) {
  return (
    <Card padding={3} radius={2} shadow={0} tone="transparent">
      <Flex align="center" justify="space-between" gap={3} wrap="wrap">
        <Stack space={2} flex={1}>
          <Text weight="semibold" size={2}>
            {a.name ?? "Unnamed"}
          </Text>
          <Inline space={3}>
            {a.phone && (
              <Text size={1} muted>
                📞 {a.phone}
              </Text>
            )}
            {a.concern && (
              <Text size={1} muted>
                · {a.concern}
              </Text>
            )}
            {(a.preferredDate || a.preferredTime) && (
              <Text size={1} muted>
                · {a.preferredDate ?? ""}
                {a.preferredTime ? ` ${a.preferredTime}` : ""}
              </Text>
            )}
          </Inline>
        </Stack>
        {a.submittedAt && (
          <Text size={1} muted>
            {relativeTime(a.submittedAt)}
          </Text>
        )}
      </Flex>
    </Card>
  );
}

export default function AppointmentsDashboard() {
  const client = useClient({ apiVersion: "2024-11-01" });
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshTick, setRefreshTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    client
      .fetch<DashboardData>(QUERY, makeQueryParams())
      .then((result) => {
        if (cancelled) return;
        setData(result);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load");
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [client, refreshTick]);

  useEffect(() => {
    const id = window.setInterval(
      () => setRefreshTick((n) => n + 1),
      REFRESH_MS,
    );
    return () => window.clearInterval(id);
  }, []);

  const conversionPct = useMemo(() => {
    if (!data || data.last30dNew === 0) return null;
    return Math.round((data.last30dConfirmed / data.last30dNew) * 100);
  }, [data]);

  const todayLabel = useMemo(() => {
    return new Date().toLocaleDateString(undefined, {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  }, []);

  return (
    <Box padding={4}>
      <Stack space={5}>
        {/* Header */}
        <Flex align="center" justify="space-between" wrap="wrap" gap={3}>
          <Stack space={2}>
            <Heading size={3}>Appointments Dashboard</Heading>
            <Text size={1} muted>
              {todayLabel} · auto-refreshes every 30 seconds
            </Text>
          </Stack>
          <Button
            icon={RefreshIcon}
            text={loading ? "Refreshing…" : "Refresh now"}
            mode="ghost"
            disabled={loading}
            onClick={() => setRefreshTick((n) => n + 1)}
          />
        </Flex>

        {error && (
          <Card padding={4} radius={3} tone="critical">
            <Text>Failed to load dashboard: {error}</Text>
          </Card>
        )}

        {loading && !data && (
          <Flex padding={5} align="center" justify="center">
            <Spinner />
          </Flex>
        )}

        {data && (
          <>
            {/* Pipeline counts */}
            <Stack space={3}>
              <Text size={1} muted weight="medium">
                PIPELINE
              </Text>
              <Grid columns={[2, 2, 4]} gap={3}>
                <StatCard
                  label="🟠 New — needs follow-up"
                  value={data.counts.new}
                  tone={data.counts.new > 0 ? "caution" : "default"}
                  hint="Open the Appointments tab in the sidebar to action"
                />
                <StatCard
                  label="📞 Contacted"
                  value={data.counts.contacted}
                  tone="primary"
                  hint="Awaiting patient response"
                />
                <StatCard
                  label="✅ Confirmed"
                  value={data.counts.confirmed}
                  tone="positive"
                  hint="Booked & scheduled"
                />
                <StatCard
                  label="✓ Completed (all-time)"
                  value={data.counts.completed}
                  hint="Patient visited"
                />
              </Grid>
            </Stack>

            {/* Today + week + conversion */}
            <Stack space={3}>
              <Text size={1} muted weight="medium">
                ACTIVITY
              </Text>
              <Grid columns={[1, 2, 3]} gap={3}>
                <StatCard
                  label="Today's confirmed visits"
                  value={data.todayConfirmed}
                  tone={data.todayConfirmed > 0 ? "positive" : "default"}
                  hint={
                    data.todayAll > data.todayConfirmed
                      ? `+${data.todayAll - data.todayConfirmed} unconfirmed today`
                      : "All today's bookings are confirmed"
                  }
                />
                <StatCard
                  label="Bookings this week (last 7 days)"
                  value={data.thisWeekSubmitted}
                  hint="Total submissions through the website"
                />
                <StatCard
                  label="30-day conversion"
                  value={
                    conversionPct === null ? "—" : `${conversionPct}%`
                  }
                  tone={
                    conversionPct === null
                      ? "default"
                      : conversionPct >= 60
                      ? "positive"
                      : conversionPct >= 30
                      ? "caution"
                      : "critical"
                  }
                  hint={
                    data.last30dNew === 0
                      ? "No bookings in the last 30 days"
                      : `${data.last30dConfirmed} of ${data.last30dNew} new bookings reached Confirmed/Completed`
                  }
                />
              </Grid>
            </Stack>

            {/* Two-column: New + Upcoming */}
            <Grid columns={[1, 1, 2]} gap={4}>
              <Card padding={4} radius={3} shadow={1}>
                <Stack space={4}>
                  <Flex align="center" gap={2}>
                    <UsersIcon />
                    <Heading size={1}>Newest bookings (needs follow-up)</Heading>
                  </Flex>
                  {data.recentNew.length === 0 ? (
                    <Text muted>
                      Inbox zero ✨ — no bookings waiting for follow-up.
                    </Text>
                  ) : (
                    <Stack space={2}>
                      {data.recentNew.map((a) => (
                        <ApptRow key={a._id} a={a} />
                      ))}
                    </Stack>
                  )}
                </Stack>
              </Card>

              <Card padding={4} radius={3} shadow={1}>
                <Stack space={4}>
                  <Flex align="center" gap={2}>
                    <CalendarIcon />
                    <Heading size={1}>Upcoming confirmed</Heading>
                  </Flex>
                  {data.upcomingConfirmed.length === 0 ? (
                    <Text muted>
                      No confirmed appointments scheduled going forward.
                    </Text>
                  ) : (
                    <Stack space={2}>
                      {data.upcomingConfirmed.map((a) => (
                        <ApptRow key={a._id} a={a} />
                      ))}
                    </Stack>
                  )}
                </Stack>
              </Card>
            </Grid>

            <Card padding={3} radius={2} tone="transparent">
              <Flex align="center" gap={2}>
                <ClockIcon />
                <Text size={1} muted>
                  Tip: click any appointment in the sidebar to view full
                  patient details, add internal notes, or change status.
                </Text>
              </Flex>
            </Card>
          </>
        )}
      </Stack>
    </Box>
  );
}
