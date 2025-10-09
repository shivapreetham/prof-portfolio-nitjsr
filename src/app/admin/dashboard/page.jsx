"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Eye, Users, Clock, TrendingUp, FileText, Video,
  BookOpen, Image, GraduationCap, Award, Calendar,
  Monitor, Smartphone, Tablet, RefreshCw, ArrowLeft, Radio
} from "lucide-react";
import Link from "next/link";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const COLORS = ['#0891B2', '#064A6E', '#0284C7', '#39A7C1', '#6B7280'];

export default function AnalyticsDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState(30);
  const [summary, setSummary] = useState(null);
  const [pageStats, setPageStats] = useState([]);
  const [resourceStats, setResourceStats] = useState({ resources: [], summary: {} });
  const [timeline, setTimeline] = useState([]);
  const [deviceData, setDeviceData] = useState({ devices: [], browsers: [], operatingSystems: [] });
  const [liveViewers, setLiveViewers] = useState(0);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
    }
  }, [session, status, router]);

  useEffect(() => {
    if (session) {
      fetchAnalytics();
      fetchLiveViewers();
    }
  }, [session, dateRange]);

  useEffect(() => {
    if (!session) return;

    const interval = setInterval(() => {
      fetchLiveViewers();
    }, 10000);

    return () => clearInterval(interval);
  }, [session]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const [summaryRes, pagesRes, resourcesRes, timelineRes, devicesRes] = await Promise.all([
        fetch(`/api/analytics/summary?days=${dateRange}`),
        fetch(`/api/analytics/pages?days=${dateRange}`),
        fetch(`/api/analytics/resources?days=${dateRange}`),
        fetch(`/api/analytics/timeline?days=${dateRange}`),
        fetch(`/api/analytics/devices?days=${dateRange}`)
      ]);

      const [summaryData, pagesData, resourcesData, timelineData, devicesData] = await Promise.all([
        summaryRes.json(),
        pagesRes.json(),
        resourcesRes.json(),
        timelineRes.json(),
        devicesRes.json()
      ]);

      setSummary(summaryData);
      setPageStats(pagesData);
      setResourceStats(resourcesData);
      setTimeline(timelineData);
      setDeviceData(devicesData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLiveViewers = async () => {
    try {
      const response = await fetch('/api/analytics/live');
      const data = await response.json();
      setLiveViewers(data.liveViewers || 0);
    } catch (error) {
      console.error('Error fetching live viewers:', error);
    }
  };

  if (status === "loading" || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="w-12 h-12 border-4 border-[#0891B2] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-[#0891B2] hover:text-[#064A6E] mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Admin
          </Link>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-[#064A6E] mb-2">Analytics Dashboard</h1>
              <div className="flex items-center gap-3">
                <p className="text-gray-600">Track your portfolio performance and visitor insights</p>
                <div className="flex items-center gap-2 bg-green-100 px-3 py-1 rounded-full">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-green-700">{liveViewers} Live</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(Number(e.target.value))}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:border-[#0891B2]"
              >
                <option value={7}>Last 7 Days</option>
                <option value={30}>Last 30 Days</option>
                <option value={90}>Last 90 Days</option>
                <option value={365}>Last Year</option>
              </select>
              <button
                onClick={fetchAnalytics}
                className="px-4 py-2 bg-[#0891B2] text-white rounded-lg hover:bg-[#064A6E] transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#0891B2] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              <KPICard
                title="Live Viewers"
                value={liveViewers}
                subtitle="Active now"
                icon={Radio}
                color="bg-green-500"
                isLive={true}
              />
              <KPICard
                title="Total Views"
                value={summary?.totalViews || 0}
                growth={summary?.growth?.views}
                icon={Eye}
                color="bg-blue-500"
              />
              <KPICard
                title="Unique Visitors"
                value={summary?.uniqueVisitors || 0}
                subtitle={`Avg: ${summary?.avgDailyVisitors || 0}/day`}
                growth={summary?.growth?.visitors}
                icon={Users}
                color="bg-cyan-500"
              />
              <KPICard
                title="Avg Duration"
                value={`${Math.round(summary?.avgDuration || 0)}s`}
                icon={Clock}
                color="bg-purple-500"
              />
              <KPICard
                title="Top Page"
                value={summary?.topPage?.title || 'N/A'}
                subtitle={`${summary?.topPage?.count || 0} views`}
                icon={TrendingUp}
                color="bg-orange-500"
              />
            </div>

            {/* Timeline Chart */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-semibold text-[#064A6E] mb-6">Visitors Over Time</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={timeline}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="views" stroke="#0891B2" strokeWidth={2} name="Page Views" />
                  <Line type="monotone" dataKey="uniqueVisitors" stroke="#064A6E" strokeWidth={2} name="Unique Visitors" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Page Analytics Table */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-semibold text-[#064A6E] mb-6">Page Performance</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-[#0891B2] text-white">
                    <tr>
                      <th className="px-4 py-3 text-left">Page</th>
                      <th className="px-4 py-3 text-left">Total Views</th>
                      <th className="px-4 py-3 text-left">Unique Visitors</th>
                      <th className="px-4 py-3 text-left">Avg Duration</th>
                      <th className="px-4 py-3 text-left">Avg Scroll</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageStats.slice(0, 10).map((page, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-700">{page.title || page.pagePath}</td>
                        <td className="px-4 py-3 text-gray-700">{page.totalViews}</td>
                        <td className="px-4 py-3 text-gray-700">{page.uniqueVisitors}</td>
                        <td className="px-4 py-3 text-gray-700">{Math.round(page.avgDuration)}s</td>
                        <td className="px-4 py-3 text-gray-700">{Math.round(page.avgScrollDepth)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Content Performance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <ContentCard
                title="Blog Posts"
                icon={FileText}
                count={resourceStats.summary.blog_view || 0}
                items={resourceStats.resources.filter(r => r.eventType === 'blog_view').slice(0, 5)}
              />
              <ContentCard
                title="Videos"
                icon={Video}
                count={resourceStats.summary.video_play || 0}
                items={resourceStats.resources.filter(r => r.eventType === 'video_play').slice(0, 5)}
              />
              <ContentCard
                title="Research Papers"
                icon={BookOpen}
                count={resourceStats.summary.paper_view || 0}
                items={resourceStats.resources.filter(r => r.eventType === 'paper_view').slice(0, 5)}
              />
              <ContentCard
                title="Gallery Images"
                icon={Image}
                count={resourceStats.summary.photo_view || 0}
                items={resourceStats.resources.filter(r => r.eventType === 'photo_view').slice(0, 5)}
              />
            </div>

            {/* Audience Insights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-[#064A6E] mb-4">Devices</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={deviceData.devices.map(d => ({ name: d._id || 'Unknown', value: d.count }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {deviceData.devices.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-[#064A6E] mb-4">Browsers</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={deviceData.browsers.map(b => ({ name: b._id || 'Unknown', count: b.count }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#0891B2" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-[#064A6E] mb-4">Operating Systems</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={deviceData.operatingSystems.map(os => ({ name: os._id || 'Unknown', count: os.count }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#064A6E" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function KPICard({ title, value, subtitle, growth, icon: Icon, color, isLive }) {
  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 ${isLive ? 'border-2 border-green-300' : ''}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm mb-1">{title}</p>
          <p className="text-2xl font-bold text-[#064A6E]">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
          {growth !== undefined && (
            <div className="flex items-center mt-2">
              <span className={`text-xs font-medium ${
                growth > 0 ? 'text-green-600' : growth < 0 ? 'text-red-600' : 'text-gray-500'
              }`}>
                {growth > 0 ? '↗' : growth < 0 ? '↘' : '→'} {Math.abs(growth)}%
              </span>
              <span className="text-xs text-gray-400 ml-1">vs prev period</span>
            </div>
          )}
        </div>
        <div className={`${color} p-3 rounded-lg relative`}>
          <Icon className="w-6 h-6 text-white" />
          {isLive && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          )}
        </div>
      </div>
    </div>
  );
}

function ContentCard({ title, icon: Icon, count, items }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <Icon className="w-6 h-6 text-[#0891B2]" />
        <h3 className="text-xl font-semibold text-[#064A6E]">{title}</h3>
        <span className="ml-auto bg-[#0891B2] text-white px-3 py-1 rounded-full text-sm">{count}</span>
      </div>
      <div className="space-y-2">
        {items.length > 0 ? (
          items.map((item, index) => (
            <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
              <span className="text-sm text-gray-700 truncate flex-1">{item.title || 'Untitled'}</span>
              <span className="text-sm font-semibold text-[#0891B2] ml-2">{item.totalViews}</span>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 py-4 text-center">No data available</p>
        )}
      </div>
    </div>
  );
}
