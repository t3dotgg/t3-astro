---
title: "Debunking the Myth: SSR Isn't Expensive"
date: "2024-12-10"
description: "SSR is not expensive. It's actually a great way to save money and improve the user experience."
imageURL: "https://t3.gg/images/ssr-expensive.jpg"
readMore: true
---

It’s becoming increasingly common to see claims that Server-Side Rendering (SSR) is expensive, unnecessary, or solely a ploy by cloud providers to inflate your bills. This sentiment oversimplifies the reality. SSR probably saves you money. Hear me out.

## 1. SSR Overhead Is Minimal

Turning JSON into HTML on the server is a relatively small computational task. Modern SSR frameworks, like Next.js, can render pages in just a few milliseconds—often under 20ms. This rendering time is negligible when compared to other parts of the request lifecycle, such as:

- **Database queries:** Even a basic DB call can easily take 10 times longer than the render step.
- **Authentication checks:** Verifying tokens and permissions also tends to consume more time than SSR itself.

Moreover, when data is not gated behind authentication, it can often be pre-rendered and cached. By doing so, you pay primarily for CDN bandwidth instead of constant compute cycles. This approach significantly reduces repeated costs associated with dynamic content generation.

## 2. SSR Can Actually Reduce Other Cloud Costs

Imagine a client-side rendered page with multiple components, each making its own API request. A single page might cause five (or more) individual round-trips to the server. Each request involves:

- Establishing and tearing down TCP connections
- Repeated authentication and token validation
- Parsing and processing multiple sets of HTTP headers
- Pulling database connections from pools multiple times

These overheads add up—both in performance and cost.

**“But I batch my requests!”** Unless you’re using something like Relay to perfectly orchestrate a single request, chances are you’re still making multiple calls from the client. This fragmentation can lead to higher bills because you’re paying for repeated overhead instead of a single, consolidated server-side process.

With SSR, you render all necessary data in one go. Modern frameworks even support out-of-order streaming, allowing you to deliver critical content immediately and stream less-critical parts as they become ready. This all happens over a single connection, slashing overhead and reducing the load on your infrastructure.

## 3. SSR Delivers a Better User Experience

Some argue: “I don’t care about SEO, so why bother?” But SSR isn’t only about search engines. Even if you only use SSR to render an initial shell, you still get significant benefits:

- **Route-specific metadata:** Better sharing, bookmarking, and context.
- **Route-specific JS and styles:** Only ship what the page needs, reducing bundle sizes.
- **Route-specific loading states:** Provide meaningful, contextual loading indicators.

All of these improvements lead to faster perceived load times and a more responsive user experience. SSR helps ensure that users see something meaningful right away, rather than staring at a blank screen or a generic loading spinner.

When you adopt SSR, you naturally move towards more optimal strategies—like caching, streaming, and selective hydration—that ultimately make your application both faster and cheaper to run.

## Conclusion

The claim that SSR is a cost-inflating maneuver by cloud providers misses the bigger picture. SSR’s computational overhead is minimal compared to the complexity and inefficiency introduced by multiple client-side requests. By consolidating logic, reducing round-trips, and improving performance, SSR often lowers your overall costs. It also paves the way for a better user experience and leaner resource usage.

If you’re working on anything beyond a trivial, static site, SSR is likely to save you money—not waste it.

This post started as a [Twitter long-post](https://x.com/theo/status/1866671921275998284). I decided to throw it at O1 Pro to turn it into a blog post. lmk what you think of the result
