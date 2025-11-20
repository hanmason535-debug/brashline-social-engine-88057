import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getStoredEvents, clearStoredEvents, type AnalyticsEvent } from "@/lib/analytics";
import { Trash2, TrendingUp, MousePointerClick, Eye, Users } from "lucide-react";
import SEOHead from "@/components/SEO/SEOHead";
import { getPageSEO } from "@/utils/seo";

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--secondary))",
  "hsl(var(--accent))",
  "hsl(var(--muted))",
];

export default function Analytics() {
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setEvents(getStoredEvents());
  }, [refreshKey]);

  const handleClearData = () => {
    if (confirm("Are you sure you want to clear all analytics data?")) {
      clearStoredEvents();
      setRefreshKey((prev) => prev + 1);
    }
  };

  // Process data for charts
  const eventsByCategory = events.reduce(
    (acc, event) => {
      acc[event.event_category] = (acc[event.event_category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const categoryData = Object.entries(eventsByCategory).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
  }));

  // Events over time (last 7 days)
  const now = Date.now();
  const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
  const recentEvents = events.filter((e) => e.timestamp > sevenDaysAgo);

  const eventsByDay = recentEvents.reduce(
    (acc, event) => {
      const day = new Date(event.timestamp).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const timelineData = Object.entries(eventsByDay).map(([date, count]) => ({
    date,
    events: count,
  }));

  // Top events
  const eventsByName = events.reduce(
    (acc, event) => {
      acc[event.event_name] = (acc[event.event_name] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const topEvents = Object.entries(eventsByName)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, count]) => ({
      name: name.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      count,
    }));

  // UTM tracking data
  const eventsWithUTM = events.filter((e) => e.utm);

  const sourceData = eventsWithUTM.reduce(
    (acc, event) => {
      const source = event.utm?.utm_source || "direct";
      acc[source] = (acc[source] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const utmSourceData = Object.entries(sourceData)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }));

  const mediumData = eventsWithUTM.reduce(
    (acc, event) => {
      const medium = event.utm?.utm_medium || "none";
      acc[medium] = (acc[medium] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const utmMediumData = Object.entries(mediumData)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }));

  const campaignData = eventsWithUTM.reduce(
    (acc, event) => {
      const campaign = event.utm?.utm_campaign || "none";
      acc[campaign] = (acc[campaign] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const utmCampaignData = Object.entries(campaignData)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }));

  // Key metrics
  const totalEvents = events.length;
  const ctaClicks = events.filter((e) => e.event_name === "cta_click").length;
  const formSubmissions = events.filter((e) => e.event_name === "contact_form_submit").length;
  const lightboxOpens = events.filter((e) => e.event_name === "lightbox_open").length;

  const metrics = [
    { label: "Total Events", value: totalEvents, icon: TrendingUp, color: "text-primary" },
    { label: "CTA Clicks", value: ctaClicks, icon: MousePointerClick, color: "text-secondary" },
    { label: "Form Submissions", value: formSubmissions, icon: Users, color: "text-accent" },
    { label: "Content Views", value: lightboxOpens, icon: Eye, color: "text-muted-foreground" },
  ];

  return (
    <>
      <SEOHead pageSEO={getPageSEO("analytics")} />

      <div className="min-h-screen bg-background pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Analytics Dashboard</h1>
              <p className="text-muted-foreground">Track engagement and user interactions</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleClearData} className="gap-2">
              <Trash2 className="w-4 h-4" />
              Clear Data
            </Button>
          </div>

          {events.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <TrendingUp className="w-16 h-16 text-muted-foreground mb-4" />
                <h2 className="text-2xl font-semibold text-foreground mb-2">No Data Yet</h2>
                <p className="text-muted-foreground text-center max-w-md">
                  Start interacting with the website to see analytics. Click CTAs, submit forms, or
                  open content to generate data.
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {metrics.map((metric) => {
                  const Icon = metric.icon;
                  return (
                    <Card key={metric.label}>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          {metric.label}
                        </CardTitle>
                        <Icon className={`w-4 h-4 ${metric.color}`} />
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-foreground">{metric.value}</div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Events Over Time */}
                <Card>
                  <CardHeader>
                    <CardTitle>Events Over Time</CardTitle>
                    <CardDescription>Last 7 days activity</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={timelineData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis
                          dataKey="date"
                          stroke="hsl(var(--muted-foreground))"
                          style={{ fontSize: "12px" }}
                        />
                        <YAxis stroke="hsl(var(--muted-foreground))" style={{ fontSize: "12px" }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "6px",
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="events"
                          stroke="hsl(var(--primary))"
                          strokeWidth={2}
                          dot={{ fill: "hsl(var(--primary))" }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Events by Category */}
                <Card>
                  <CardHeader>
                    <CardTitle>Events by Category</CardTitle>
                    <CardDescription>Distribution of event types</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={100}
                          fill="hsl(var(--primary))"
                          dataKey="value"
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "6px",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Top Events */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Events</CardTitle>
                  <CardDescription>Most frequent user interactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={topEvents} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis
                        type="number"
                        stroke="hsl(var(--muted-foreground))"
                        style={{ fontSize: "12px" }}
                      />
                      <YAxis
                        type="category"
                        dataKey="name"
                        stroke="hsl(var(--muted-foreground))"
                        style={{ fontSize: "12px" }}
                        width={150}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "6px",
                        }}
                      />
                      <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* UTM Tracking Section */}
              {eventsWithUTM.length > 0 && (
                <>
                  <div className="col-span-full mt-8">
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                      Campaign Attribution
                    </h2>
                    <p className="text-muted-foreground">
                      Track marketing campaign performance via UTM parameters
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Traffic Sources */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Traffic Sources</CardTitle>
                        <CardDescription>Top UTM sources</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                          <BarChart data={utmSourceData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis
                              dataKey="name"
                              stroke="hsl(var(--muted-foreground))"
                              style={{ fontSize: "11px" }}
                            />
                            <YAxis
                              stroke="hsl(var(--muted-foreground))"
                              style={{ fontSize: "11px" }}
                            />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "hsl(var(--card))",
                                border: "1px solid hsl(var(--border))",
                                borderRadius: "6px",
                              }}
                            />
                            <Bar
                              dataKey="value"
                              fill="hsl(var(--secondary))"
                              radius={[4, 4, 0, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    {/* Traffic Mediums */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Traffic Mediums</CardTitle>
                        <CardDescription>Top UTM mediums</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                          <BarChart data={utmMediumData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis
                              dataKey="name"
                              stroke="hsl(var(--muted-foreground))"
                              style={{ fontSize: "11px" }}
                            />
                            <YAxis
                              stroke="hsl(var(--muted-foreground))"
                              style={{ fontSize: "11px" }}
                            />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "hsl(var(--card))",
                                border: "1px solid hsl(var(--border))",
                                borderRadius: "6px",
                              }}
                            />
                            <Bar dataKey="value" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    {/* Campaigns */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Campaigns</CardTitle>
                        <CardDescription>Top UTM campaigns</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                          <BarChart data={utmCampaignData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis
                              dataKey="name"
                              stroke="hsl(var(--muted-foreground))"
                              style={{ fontSize: "11px" }}
                            />
                            <YAxis
                              stroke="hsl(var(--muted-foreground))"
                              style={{ fontSize: "11px" }}
                            />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "hsl(var(--card))",
                                border: "1px solid hsl(var(--border))",
                                borderRadius: "6px",
                              }}
                            />
                            <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
