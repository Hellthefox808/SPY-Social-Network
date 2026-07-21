import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get("jobId");
    const format = searchParams.get("format") || "json";

    if (!jobId) {
      return NextResponse.json({ error: "jobId is required" }, { status: 400 });
    }

    const job = await db.analysisJob.findUnique({
      where: { id: jobId },
      include: {
        profiles: true,
        entities: true,
        locations: true,
        edges: true,
        evidenceItems: true,
      },
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    const profile = job.profiles[0];
    const handle = profile?.handle || "profile";

    if (format === "pdf" || format === "html") {
      const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>OSINT Intelligence Report - ${profile?.displayName || handle}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.5; color: #1e293b; padding: 40px; max-width: 900px; margin: 0 auto; }
    h1 { color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 24px; font-size: 24px; }
    h2 { color: #1e293b; margin-top: 32px; font-size: 18px; border-bottom: 1px solid #cbd5e1; padding-bottom: 6px; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; text-transform: uppercase; background: #e0f2fe; color: #0369a1; }
    .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 24px; }
    .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; }
    .label { font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 600; }
    .value { font-size: 14px; font-weight: 600; color: #0f172a; margin-top: 4px; }
    table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 13px; }
    th, td { text-align: left; padding: 8px 12px; border-bottom: 1px solid #e2e8f0; }
    th { background: #f1f5f9; font-size: 11px; text-transform: uppercase; color: #475569; }
    .footer { margin-top: 48px; pt: 24px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #94a3b8; }
    @media print { body { padding: 0; } .no-print { display: none; } }
  </style>
</head>
<body>
  <div class="no-print" style="margin-bottom: 20px; text-align: right;">
    <button onclick="window.print()" style="background: #2563eb; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 600; cursor: pointer;">
      Print / Save as PDF
    </button>
  </div>

  <h1>SocialGraph Atlas • OSINT Intelligence Executive Report</h1>

  <div class="grid">
    <div class="card">
      <div class="label">Target Subject</div>
      <div class="value">${profile?.displayName || handle} (@${handle})</div>
    </div>
    <div class="card">
      <div class="label">Platform Source</div>
      <div class="value"><span class="badge">${profile?.platform || job.detectedPlatform}</span></div>
    </div>
    <div class="card">
      <div class="label">Report Execution ID</div>
      <div class="value">${job.id}</div>
    </div>
    <div class="card">
      <div class="label">Generated Timestamp</div>
      <div class="value">${new Date(job.createdAt).toLocaleString()}</div>
    </div>
  </div>

  <h2>Subject Bio & Metrics</h2>
  <div class="card">
    <p><strong>Bio:</strong> ${profile?.bio || "No bio text declared."}</p>
    <p><strong>Declared Location:</strong> ${profile?.locationText || "Not specified"}</p>
    <p><strong>Metrics:</strong> Followers: ${profile?.followersCount || 0} | Following: ${profile?.followingCount || 0} | Posts: ${profile?.postsCount || 0}</p>
  </div>

  <h2>Network Connections (${job.edges.length})</h2>
  <table>
    <thead>
      <tr>
        <th>Entity Name</th>
        <th>Relation Type</th>
        <th>Source URL</th>
        <th>Confidence</th>
      </tr>
    </thead>
    <tbody>
      ${job.edges.map(edge => {
        const entity = job.entities.find(e => e.id === edge.targetEntityId);
        return `<tr>
          <td><strong>${entity?.name || "Unknown"}</strong></td>
          <td>${edge.relationType}</td>
          <td>${edge.sourceUrl || "N/A"}</td>
          <td>${(edge.confidence * 100).toFixed(0)}%</td>
        </tr>`;
      }).join("")}
    </tbody>
  </table>

  <h2>Geointelligence Signals (${job.locations.length})</h2>
  <table>
    <thead>
      <tr>
        <th>Location Label</th>
        <th>Type</th>
        <th>Coordinates</th>
        <th>Confidence</th>
      </tr>
    </thead>
    <tbody>
      ${job.locations.map(loc => `<tr>
        <td><strong>${loc.label}</strong></td>
        <td>${loc.locationType}</td>
        <td>${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)}</td>
        <td>${(loc.confidence * 100).toFixed(0)}%</td>
      </tr>`).join("")}
    </tbody>
  </table>

  <div class="footer">
    SocialGraph Atlas Enterprise Security Platform • Confidential Intelligence Export
  </div>

  <script>
    if (window.location.search.includes('download=1')) {
      window.onload = function() { window.print(); }
    }
  </script>
</body>
</html>`;

      return new Response(htmlContent, {
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Content-Disposition": `inline; filename="socialgraph_${handle}_report.html"`,
        },
      });
    }

    if (format === "csv") {
      let csvContent = `--- PROFILE METADATA ---\n`;
      csvContent += `Handle,Display Name,Platform,URL,Bio,Location,Followers,Following,Posts\n`;
      csvContent += `"${profile?.handle || ""}","${profile?.displayName || ""}","${profile?.platform || ""}","${profile?.sourceUrl || ""}","${(profile?.bio || "").replace(/"/g, '""')}","${profile?.locationText || ""}",${profile?.followersCount || ""},${profile?.followingCount || ""},${profile?.postsCount || ""}\n\n`;

      csvContent += `--- CONNECTIONS ---\n`;
      csvContent += `Connection ID,Name,Relation Type,Source URL,Confidence\n`;
      job.edges.forEach((edge) => {
        const targetEntity = job.entities.find((e) => e.id === edge.targetEntityId);
        csvContent += `"${edge.id}","${targetEntity?.name || ""}","${edge.relationType}","${edge.sourceUrl || ""}","${edge.confidence}"\n`;
      });

      csvContent += `\n--- LOCATIONS ---\n`;
      csvContent += `Location ID,Label,City,State,Country,Latitude,Longitude,Type,Confidence,Source URL\n`;
      job.locations.forEach((loc) => {
        csvContent += `"${loc.id}","${loc.label}","${loc.city || ""}","${loc.state || ""}","${loc.country || ""}",${loc.lat},${loc.lng},"${loc.locationType}",${loc.confidence},"${loc.sourceUrl}"\n`;
      });

      return new Response(csvContent, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="socialgraph_${handle}_export.csv"`,
        },
      });
    }

    return new Response(JSON.stringify(job, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="socialgraph_${jobId}_export.json"`,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    console.error("API Export GET Error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
