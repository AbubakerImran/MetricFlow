export const dynamic = "force-dynamic";

export async function GET() {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      let revenue = 48290;
      let users = 2847;
      let sessions = 1249;
      let conversion = 3.24;

      const send = () => {
        revenue += Math.floor((Math.random() - 0.5) * revenue * 0.04);
        users += Math.floor((Math.random() - 0.5) * 6);
        sessions += Math.floor((Math.random() - 0.5) * sessions * 0.1);
        conversion += (Math.random() - 0.5) * 0.2;
        conversion = Math.max(0.5, Math.min(10, conversion));

        const data = {
          revenue: revenue.toLocaleString(),
          revenueChange: +(12.5 + (Math.random() - 0.5) * 2).toFixed(1),
          users: users.toLocaleString(),
          usersChange: +(8.2 + (Math.random() - 0.5) * 2).toFixed(1),
          sessions: sessions.toLocaleString(),
          sessionsChange: +(15.3 + (Math.random() - 0.5) * 3).toFixed(1),
          conversion: conversion.toFixed(2),
          conversionChange: +(0.4 + (Math.random() - 0.5) * 0.4).toFixed(1),
        };

        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
        } catch {
          clearInterval(interval);
        }
      };

      send(); // Initial data
      const interval = setInterval(send, 3000);

      // Cleanup after 5 minutes to prevent resource leaks
      setTimeout(() => {
        clearInterval(interval);
        try { controller.close(); } catch { /* ignore */ }
      }, 300000);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}
