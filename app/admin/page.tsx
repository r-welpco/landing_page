"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";

interface Subscriber {
  id: number;
  email: string;
  segment: string;
  locale: string;
  interestedCustomer: boolean;
  interestedWelper: boolean;
  comment: string | null;
  createdAt: string;
}

type SortKey = keyof Subscriber;
type SortDir = "asc" | "desc";

const COLUMNS: { key: SortKey; label: string; width?: string }[] = [
  { key: "id", label: "#", width: "60px" },
  { key: "email", label: "Email" },
  { key: "segment", label: "Segment", width: "100px" },
  { key: "locale", label: "Locale", width: "70px" },
  { key: "interestedCustomer", label: "Customer", width: "90px" },
  { key: "interestedWelper", label: "Welper", width: "80px" },
  { key: "comment", label: "Comment" },
  { key: "createdAt", label: "Signed up", width: "170px" },
];

export default function AdminPage() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [data, setData] = useState<Subscriber[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("");
  const [segmentFilter, setSegmentFilter] = useState<string>("all");
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setApiKey(params.get("key"));
  }, []);

  const fetchData = useCallback(async (key: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/subscribers?key=${encodeURIComponent(key)}`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError((body as { error?: string }).error ?? `HTTP ${res.status}`);
        return;
      }
      const json = (await res.json()) as { subscribers: Subscriber[]; total: number };
      setData(json.subscribers);
      setTotal(json.total);
    } catch {
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (apiKey) fetchData(apiKey);
  }, [apiKey, fetchData]);

  const filtered = useMemo(() => {
    let rows = data;
    if (segmentFilter !== "all") {
      rows = rows.filter((r) => r.segment === segmentFilter);
    }
    if (filter.trim()) {
      const q = filter.toLowerCase();
      rows = rows.filter(
        (r) =>
          r.email.toLowerCase().includes(q) ||
          r.segment.toLowerCase().includes(q) ||
          (r.comment ?? "").toLowerCase().includes(q)
      );
    }
    return rows;
  }, [data, filter, segmentFilter]);

  const sorted = useMemo(() => {
    const rows = [...filtered];
    rows.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      if (typeof av === "boolean") return (av === bv ? 0 : av ? -1 : 1) * (sortDir === "asc" ? 1 : -1);
      if (typeof av === "number" && typeof bv === "number") return (av - bv) * (sortDir === "asc" ? 1 : -1);
      return String(av).localeCompare(String(bv)) * (sortDir === "asc" ? 1 : -1);
    });
    return rows;
  }, [filtered, sortKey, sortDir]);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  function handleExport() {
    if (!apiKey) return;
    window.open(`/api/admin/subscribers?key=${encodeURIComponent(apiKey)}&format=csv`, "_blank");
  }

  if (apiKey === null) {
    return <div style={styles.container}><p style={styles.loading}>Loading...</p></div>;
  }

  if (error === "Unauthorized") {
    return (
      <div style={styles.container}>
        <div style={styles.errorBox}>
          <h1 style={styles.errorTitle}>Access Denied</h1>
          <p style={styles.errorText}>Invalid or missing API key. Access this page with <code>?key=YOUR_KEY</code></p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Subscribers</h1>
        <span style={styles.badge}>{total} total</span>
      </div>

      {error && <p style={styles.errorInline}>{error}</p>}

      <div style={styles.toolbar}>
        <input
          type="text"
          placeholder="Search email, segment, comment..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={styles.searchInput}
        />
        <select
          value={segmentFilter}
          onChange={(e) => setSegmentFilter(e.target.value)}
          style={styles.select}
        >
          <option value="all">All segments</option>
          <option value="customer">Customer</option>
          <option value="welper">Welper</option>
          <option value="both">Both</option>
        </select>
        <button type="button" onClick={handleExport} style={styles.exportBtn}>
          Export CSV
        </button>
      </div>

      <p style={styles.resultCount}>
        Showing {sorted.length} of {total}
      </p>

      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr>
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  style={{ ...styles.th, width: col.width, cursor: "pointer", userSelect: "none" }}
                >
                  {col.label}
                  {sortKey === col.key ? (sortDir === "asc" ? " ↑" : " ↓") : ""}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={COLUMNS.length} style={styles.emptyTd}>Loading...</td>
              </tr>
            ) : sorted.length === 0 ? (
              <tr>
                <td colSpan={COLUMNS.length} style={styles.emptyTd}>No subscribers found</td>
              </tr>
            ) : (
              sorted.map((row) => (
                <tr key={row.id} style={styles.tr}>
                  <td style={styles.td}>{row.id}</td>
                  <td style={styles.td}>{row.email}</td>
                  <td style={styles.td}>
                    <span style={{ ...styles.segmentBadge, ...segmentColor(row.segment) }}>
                      {row.segment}
                    </span>
                  </td>
                  <td style={styles.td}>{row.locale.toUpperCase()}</td>
                  <td style={styles.td}>{row.interestedCustomer ? "✓" : "—"}</td>
                  <td style={styles.td}>{row.interestedWelper ? "✓" : "—"}</td>
                  <td style={{ ...styles.td, maxWidth: 240, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={row.comment ?? ""}>
                    {row.comment || "—"}
                  </td>
                  <td style={styles.td}>{new Date(row.createdAt).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function segmentColor(segment: string): React.CSSProperties {
  switch (segment) {
    case "customer": return { background: "#e0f2e9", color: "#15803d" };
    case "welper": return { background: "#e0e7ff", color: "#3730a3" };
    case "both": return { background: "#fef3c7", color: "#92400e" };
    default: return {};
  }
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "2rem 1.5rem",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    color: "#1a1a1a",
    minHeight: "100vh",
    background: "#fafafa",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    marginBottom: "1.5rem",
  },
  title: {
    fontSize: "1.75rem",
    fontWeight: 700,
    margin: 0,
  },
  badge: {
    fontSize: "0.8rem",
    fontWeight: 600,
    background: "#e5e7eb",
    color: "#374151",
    borderRadius: 20,
    padding: "0.25rem 0.75rem",
  },
  toolbar: {
    display: "flex",
    gap: "0.75rem",
    flexWrap: "wrap" as const,
    marginBottom: "0.75rem",
    alignItems: "center",
  },
  searchInput: {
    flex: "1 1 240px",
    padding: "0.6rem 0.9rem",
    fontSize: "0.9rem",
    border: "1px solid #d1d5db",
    borderRadius: 8,
    outline: "none",
    background: "#fff",
  },
  select: {
    padding: "0.6rem 0.9rem",
    fontSize: "0.9rem",
    border: "1px solid #d1d5db",
    borderRadius: 8,
    background: "#fff",
    cursor: "pointer",
  },
  exportBtn: {
    padding: "0.6rem 1.25rem",
    fontSize: "0.9rem",
    fontWeight: 600,
    border: "1px solid #d1d5db",
    borderRadius: 8,
    background: "#fff",
    cursor: "pointer",
    whiteSpace: "nowrap" as const,
  },
  resultCount: {
    fontSize: "0.8rem",
    color: "#6b7280",
    marginBottom: "0.5rem",
  },
  tableWrap: {
    overflowX: "auto" as const,
    border: "1px solid #e5e7eb",
    borderRadius: 10,
    background: "#fff",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
    fontSize: "0.875rem",
  },
  th: {
    textAlign: "left" as const,
    padding: "0.75rem 0.75rem",
    borderBottom: "2px solid #e5e7eb",
    fontWeight: 600,
    fontSize: "0.8rem",
    color: "#6b7280",
    textTransform: "uppercase" as const,
    letterSpacing: "0.03em",
    whiteSpace: "nowrap" as const,
  },
  tr: {
    borderBottom: "1px solid #f3f4f6",
  },
  td: {
    padding: "0.6rem 0.75rem",
    verticalAlign: "middle" as const,
  },
  emptyTd: {
    padding: "2rem",
    textAlign: "center" as const,
    color: "#9ca3af",
  },
  segmentBadge: {
    display: "inline-block",
    padding: "0.15rem 0.5rem",
    borderRadius: 6,
    fontSize: "0.8rem",
    fontWeight: 600,
  },
  loading: {
    textAlign: "center" as const,
    color: "#6b7280",
    padding: "4rem 0",
    fontSize: "1rem",
  },
  errorBox: {
    textAlign: "center" as const,
    padding: "4rem 2rem",
  },
  errorTitle: {
    fontSize: "1.5rem",
    fontWeight: 700,
    marginBottom: "0.5rem",
    color: "#dc2626",
  },
  errorText: {
    color: "#6b7280",
    fontSize: "0.95rem",
  },
  errorInline: {
    color: "#dc2626",
    fontSize: "0.9rem",
    marginBottom: "1rem",
  },
};
