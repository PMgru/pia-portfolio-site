import type { NextApiRequest, NextApiResponse } from 'next';
import { JsonDb } from '@/lib/db';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { action } = req.query;

  // Track page hit
  if (req.method === 'POST' && action === 'track') {
    const { session_id, page_path, referrer, device_type, browser, os, country } = req.body;

    const event = {
      session_id: session_id || 'unknown_session',
      visitor_id: req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'anonymous',
      event_type: 'pageview',
      page_path: page_path || '/',
      referrer: referrer || 'Direct',
      device_type: device_type || 'Desktop',
      browser: browser || 'Unknown',
      os: os || 'Unknown',
      country: country || 'Bangladesh',
      timestamp: new Date().toISOString()
    };

    JsonDb.insert('analytics_events', event);
    return res.status(200).json({ success: true });
  }

  // Handle heartbeat pings
  if (req.method === 'POST' && action === 'ping') {
    const { session_id, page_path } = req.body;
    if (!session_id) {
      return res.status(400).json({ message: 'session_id is required' });
    }

    const events = JsonDb.getCollection('analytics_events');
    const existing = events.find(e => e.session_id === session_id && e.event_type === 'pageview');

    const event = {
      session_id,
      visitor_id: req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'anonymous',
      event_type: 'ping',
      page_path: page_path || '/',
      referrer: existing?.referrer || 'Direct',
      device_type: existing?.device_type || 'Desktop',
      browser: existing?.browser || 'Unknown',
      os: existing?.os || 'Unknown',
      country: existing?.country || 'Bangladesh',
      timestamp: new Date().toISOString()
    };

    JsonDb.insert('analytics_events', event);
    return res.status(200).json({ success: true });
  }

  // Get stats for Admin Dashboard
  if (req.method === 'GET' && action === 'stats') {
    const events = JsonDb.getCollection('analytics_events');

    // Filter pageviews and pings separately
    const pageviews = events.filter(e => e.event_type === 'pageview');

    // 1. Total Metrics
    const totalViews = pageviews.length;
    const uniqueSessions = new Set(pageviews.map(e => e.session_id));
    const uniqueVisitors = uniqueSessions.size;

    // 2. Active visitors (active in the last 30 seconds)
    const thirtySecAgo = new Date(Date.now() - 30 * 1000).toISOString();
    const activeSessions = new Set(
      events.filter(e => e.timestamp >= thirtySecAgo).map(e => e.session_id)
    );
    const liveVisitorCount = activeSessions.size;

    // 3. Top Pages breakdown
    const pageViewsMap: Record<string, number> = {};
    pageviews.forEach(e => {
      pageViewsMap[e.page_path] = (pageViewsMap[e.page_path] || 0) + 1;
    });

    // 4. Countries breakdown
    const countriesMap: Record<string, number> = {};
    pageviews.forEach(e => {
      countriesMap[e.country] = (countriesMap[e.country] || 0) + 1;
    });

    // 5. Operating Systems breakdown
    const osMap: Record<string, number> = {};
    pageviews.forEach(e => {
      osMap[e.os] = (osMap[e.os] || 0) + 1;
    });

    // 6. Devices breakdown
    const devicesMap: Record<string, number> = {};
    pageviews.forEach(e => {
      devicesMap[e.device_type] = (devicesMap[e.device_type] || 0) + 1;
    });

    // 7. Last 7 Days Traffic Graph
    const daysGraph: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const label = d.toLocaleDateString('en-US', { weekday: 'short' });
      daysGraph[label] = 0;
    }
    pageviews.forEach(e => {
      const dateLabel = new Date(e.timestamp).toLocaleDateString('en-US', { weekday: 'short' });
      if (dateLabel in daysGraph) {
        daysGraph[dateLabel]++;
      }
    });
    const graphData = Object.entries(daysGraph).map(([label, val]) => ({
      day: label,
      views: val
    }));

    // 8. Session-level analysis for Bounce Rate, Average Duration and Live Users Details
    // Group all events by session
    const sessionsData: Record<string, typeof events> = {};
    events.forEach(e => {
      if (!sessionsData[e.session_id]) {
        sessionsData[e.session_id] = [];
      }
      sessionsData[e.session_id].push(e);
    });

    let totalDurationMs = 0;
    let singlePageSessionsCount = 0;
    const sessionDetailsList: any[] = [];

    Object.entries(sessionsData).forEach(([sid, sEvents]) => {
      // Sort chronologically
      sEvents.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

      const sPageviews = sEvents.filter(e => e.event_type === 'pageview');
      if (sPageviews.length === 1) {
        singlePageSessionsCount++;
      }

      const firstEvent = sEvents[0];
      const lastEvent = sEvents[sEvents.length - 1];
      const durationMs = new Date(lastEvent.timestamp).getTime() - new Date(firstEvent.timestamp).getTime();
      totalDurationMs += durationMs;

      // Check if session is active (last event within last 5 minutes is considered "live" for history viewing)
      const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
      const isSessionLive = lastEvent.timestamp >= fiveMinAgo;

      // Compile page history with durations
      const history: any[] = [];
      for (let i = 0; i < sPageviews.length; i++) {
        const pv = sPageviews[i];
        const pvTime = new Date(pv.timestamp).getTime();
        
        let pageDurationSec = 0;
        if (i < sPageviews.length - 1) {
          // Duration is until the next page view
          const nextPv = sPageviews[i + 1];
          pageDurationSec = Math.round((new Date(nextPv.timestamp).getTime() - pvTime) / 1000);
        } else {
          // Duration of the final page is until the last ping or action on this page
          const samePagePings = sEvents.filter(e => e.event_type === 'ping' && e.page_path === pv.page_path);
          if (samePagePings.length > 0) {
            const lastPingTime = new Date(samePagePings[samePagePings.length - 1].timestamp).getTime();
            pageDurationSec = Math.round((lastPingTime - pvTime) / 1000);
          } else {
            pageDurationSec = 0; // visited but left instantly or no heartbeat yet
          }
        }

        history.push({
          path: pv.page_path,
          duration: pageDurationSec > 0 ? formatSec(pageDurationSec) : 'instantly',
          timestamp: pv.timestamp
        });
      }

      sessionDetailsList.push({
        session_id: sid,
        ip: firstEvent.visitor_id,
        location: firstEvent.country,
        device: firstEvent.device_type,
        browser: firstEvent.browser,
        os: firstEvent.os,
        current_page: lastEvent.page_path,
        is_live: isSessionLive,
        last_active: lastEvent.timestamp,
        time_spent: formatMs(durationMs),
        history
      });
    });

    const sessionCount = Object.keys(sessionsData).length;
    const bounceRate = sessionCount > 0 ? `${((singlePageSessionsCount / sessionCount) * 100).toFixed(1)}%` : '0%';
    const avgDuration = sessionCount > 0 ? formatMs(totalDurationMs / sessionCount) : '0s';

    // Sort live details list so that the most recently active sessions are first
    sessionDetailsList.sort((a, b) => new Date(b.last_active).getTime() - new Date(a.last_active).getTime());

    return res.status(200).json({
      total_views: totalViews,
      unique_visitors: uniqueVisitors,
      live_visitors: liveVisitorCount,
      top_pages: Object.entries(pageViewsMap).map(([path, count]) => ({ path, count })),
      countries: Object.entries(countriesMap).map(([name, count]) => ({ name, count })),
      os: Object.entries(osMap).map(([name, count]) => ({ name, count })),
      devices: Object.entries(devicesMap).map(([name, count]) => ({ name, count })),
      traffic_chart: graphData,
      bounce_rate: bounceRate,
      average_duration: avgDuration,
      live_sessions: sessionDetailsList
    });
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}

function formatMs(ms: number): string {
  if (ms <= 0) return '0s';
  const totalSec = Math.round(ms / 1000);
  return formatSec(totalSec);
}

function formatSec(totalSec: number): string {
  if (totalSec < 60) return `${totalSec}s`;
  const mins = Math.floor(totalSec / 60);
  const secs = totalSec % 60;
  return `${mins}m ${secs}s`;
}
