---
title: "An Inconsistent Truth: Next.js and Type Safety"
date: "2021-12-01"
description: "Next.js is a great framework. It's a shame about that type safety..."
readMore: true
layout: "../../../layouts/BlogPost.astro"
---

Imagine a world where Next.js was architected around type safety.

> But doesn't Next.js already work with Typescript?

Yes. I even [recommend the Next.js Typescript template on init.tips](https://init.tips/).

Type safety goes deeper than Typescript support.

## What is Type Safety?

> ...type safety is the extent to which a programming language discourages or prevents type errors ([Wikipedia](https://en.wikipedia.org/wiki/Type_safety))

It's important to recognize first and foremost that type safety isn't a boolean 'on/off' state. Type safety is a set of pipes from your furthest off dependency and your user.

Throughout my career, I've seen a number of systems that handle types in various ways. For the sake of simplicity, I'm going to over-generalize the structure of a system into a few parts

- Data store (SQL, Mongo, Worker KV)
- Backend (interface to data store)
- API + Schema layer (REST/Swagger, GraphQL, gRPC)
- Client (Frontend web app, mobile app, video game)

I've been lucky to work primarily in systems where each of these pieces is type safe. At Twitch, we used PostgreSQL for data, Golang for backend, GraphQL for APIs, and React + TypeScript for the front end. Each piece was type safe, and tools like GraphQL allowed us to write a "type contract" between different type systems (in this case a GraphQL schema).

Given the separation of concerns and focus, combined with the varied technologies on frontend and backend, this architecture made a lot of sense.

Given a full-stack TypeScript app using Next.js, I think we can do much better.

### What isn't Type Safety?

Going to start this with a question for you:

When working in a type safe system, should you be writing more types, or less?

This question may seem dumb. "Of course you would have more type definitions in the better typed system!"

The best typed systems should require no types be written at all.

_But how??!_

Inference.

_Writing type definitions for every piece of your code does not make a type safe system._

_Good type systems are built on top of strongly typed dependencies and models. Type safety comes when the rest is inferred from there_.

### What It Looks Like

Say I have a model in SQL:

```tsx
model User {
  id   String  @id @default(cuid())
  name String?
}
```

We know, given a `User`, that we have an `id` string that is unique and we _might_ have a `name` that is a string. If we were interfacing with this in Typescript, the TS definition would look something like

```tsx
type User {
	id: string;
	name: string | null;
}
```

Here's where the Theo spice comes in: _you should never have to write types that look this much like your data models_

Tools like [Prisma](https://www.prisma.io/) serve as a beautiful "translation layer" between your SQL data and your Typescript backend.

```typescript
export const getUserById = (userId: string) => {
  return await prisma.user.findFirst({ where: { id: userId } });
};
```

That's it.

The type safety doesn't come from defining our own types. It comes from _the source of truth being honored and all further contracts being inferred from that source_.

Next.js breaks that contract.

## Next is a (type) safety risk

This statement is bold, but this problem is large enough to justify it IMO.

It is hard to believe that the biggest breach in contract for my type system exists within any given file in the Next.js `pages` directory, but it's the reality I'm here to shout about.

```tsx
// pages/user-info/[id].ts
export default function UserInfo(props) {
  return <div>Hello {props.user?.name}</div>;
}

export async function getServerSideProps(context) {
  const id = context.params.id;
  const user = await prisma.user.findFirst({ where: { id: id } });

  return { props: { user } };
}
```

This seems innocent enough, right? Drop this code into your Next.js `pages` dir and everything passes.

Sadly, there are numerous type errors that this will silently allow you to introduce, such as:

- Modifying the schema (rename `name` to `username`)
- Selecting different values from the `prisma.user` call
- Changing the key you return `user` under in `getServerSideProps`
- Erroneously deleting the `getServerSideProps` function (...yes I've done this before)

Even putting aside the _egregious_ allowance of `implicit-any` that allows most of these failures to be possible, the recommended mitigation strategies don't do enough. Let's take a look at a few.

### Manually Typing Props

```tsx
// pages/user-info/[id].ts
import type { User } from "@prisma/client";

const UserInfo: React.FC<{user: User}> = (props) {
  return <div>Hello {props.user?.name}</div>;
}
```

Yay we did it! If we were to change `name` to `username` in the schema, we'd get a type error here!

But what if we modify the `getServerSideProps` function?

```tsx
export async function getServerSideProps(context) {
  const id = context.params.id;
  const user = await prisma.user.findFirst({
    where: { id: id },
    select: { id }, // We only select ID now (so `name` isn't included)
  });

  return { props: { user } };
}
```

Note: we only made one change here, we _started selecting the values we needed more carefully_.

Sadly, since the page component _presumed the entire User was coming down the wire_, this will silently pass type checks. Since the `user?.name` call is optionally chained, this case will not throw an error, but that will only make debugging more painful.

### Manually typing API endpoints

This path is [vaguely hinted at in the Next.js docs](https://nextjs.org/docs/basic-features/typescript#api-routes), but will require we break up our solution a bit. I will also be including [React Query](https://react-query.tanstack.com/) to make this example significantly less burdensome (I would have used Vercel's [swr](https://swr.vercel.app/) package, but I literally can not find a single Typescript example in their docs).

```tsx
// pages/api/get-user-by-id.ts
import type { NextApiRequest, NextApiResponse } from "next";
import type { User } from "@prisma/client";

export type UserRequestData = {
  user: User;
};

export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { userId } = req.query;

  const user = await prisma.user.findFirst({ where: { id: userId } });
  res.status(200).json({ user });
};

// pages/user-info/[id].ts
import { UserRequestData } from "../api/get-user-by-id";
import { useQuery } from "react-query";

const getUserById = async (userId: string) => {
  const response = await fetch("/api/get-user-by-id?userId=" + query.userId);

  // Assign type imported from server code
  return (await response.json()) as UserRequestData;
};

export function UserInfo(props) {
  const { query } = useRouter(); // Get userId from query params

  // Fetch from server with loading and error state
  const { data, isLoading } = useQuery<UserRequestData>(
    ["user", query.id],
    () => getUserById(query.id)
  );

  if (isLoading) return null;

  if (!data) return <div>Error: user not found</div>;

  return <div>Hello {data.user?.name}</div>;
}
```

This one may look like a lot, but for a full-stack backend and frontend with typesafety across both, it's not bad. It's important to note that, by moving from `getServerSideProps` to React Query (or swr), _we have moved the data fetching from the server to the client in pursuit of type safety._

There are definite benefits to this approach. By putting the type definition so close to the API, we are making the "contract of what is returned" more reliable to consume.

There are definite negatives as well. The verbosity compared to the earlier options is apparent and absurd. We've given up a lot of our SSR benefits. But have we gained a lot in terms of type safety?

I'd argue no.

By defining the types manually, we're still leaving a lot of surface area for error. What if I import the wrong type? What if I fetch from the wrong URL? What if I forget to call `.json()` (which I totally did when writing this example)?

I think we can do better.

## An Inconsistent Truth

All of the type failures encountered in the above examples stem from roughly the same core issue: the "types" and the "sources of data" are not tied together implicitly. By separating the source of data and the source of truth, we introduce space for errors.

Let's repeat that for those in the back.

**By separating the source of data and the source of truth, we introduce space for errors.**

This is a big part of why I love Prisma so much. Your "source of truth" is the `schema.prisma` file. Everything else is inferred from there. You will not be writing your own type defs with Prisma.

`getServerSideProps` should work the same way.

### The Types Were With Us All Along

The funny thing about the first example I gave is that _the types we need are inferable_. Take a look at this (using [AsyncReturnType](https://stackoverflow.com/a/59774743) inference):

```tsx
// pages/user-info/[id].ts
export async function getServerSideProps(context) {
  const id = context.params.id;
  const user = await prisma.user.findFirst({ where: { id: id } });

  return { props: { user } };
}

// Infer types from getServerSideProps
type ServerSideProps = AsyncReturnType<typeof getServerSideProps>["props"];

// Assign inferred props in exported page component
export default function UserInfo(props: ServerSideProps) {
  return <div>Hello {props.user?.name}</div>;
}
```

The only major change from the first example is the inference of prop types through the server-side function types. **At this point in time, I think Next.js should provide a helper to generate safe types from server-side prop functions**. It is the _safest way to honor the contracts inherent to Typescript across the client and server barrier while using server side function helpers in Next._

I still think we can do better though.

## Exploring Other Solutions

### Typesafe APIs

Before I go too deep here, I should make my bias clear. I'm a [tRPC fanboy](https://twitter.com/t3dotgg/status/1438434802839945220).

[tRPC](https://trpc.io/) takes full stack type inference to the next level by relying on the types defined in your router as a "schema" on your client. [Blitz.js](https://blitzjs.com/) does [something similar with queries](https://blitzjs.com/docs/query-resolvers). Both wrap React Query with typesafe definitions at the API level, which enables some "magic" with type consistency.

```tsx
// pages/api/trpc/[trpc].ts
const appRouter = trpc.router().query("get-user-by-id", {
  input: z.object({
    userId: z.string(),
  }),
  async resolve({ input }) {
    const user = await prisma.user.findFirst({ where: { id: input.userId } });
    return { user };
  },
});

export type AppRouter = typeof appRouter;

// pages/user/[id].ts
import trpc from "../utils/trpc";

export default function UserInfo() {
  const { query } = useRouter();

  // trpc.useQuery will call "get-user-by-id" api with {userId: query.id}
  const { data } = trpc.useQuery(["get-user-by-id", { userId: query.id }]);

  if (!data) return <div>Error: user not found</div>;

  return <div>Hello {data.user?.name}</div>;
}
```

It's important to note that the `trpc.useQuery` call is as close to 100% typesafe as you can get (hell, even in this case it will type error because `[query.id](http://query.id)` isn't guaranteed to exist).

The `"get-user-by-id"` string will auto-complete, and type error if it is not a real query in your tRPC router. The input will error if it doesn't match the [zod schema](https://github.com/colinhacks/zod) in your query/mutation. The data is typed identically to the return types of your `resolve` function (even if you use `Map` and `Date`, [superjson](https://github.com/blitz-js/superjson) can convert those too). Also - unlike the earlier example, this one [can also work with SSR](https://trpc.io/docs/ssr#configure-_apptsx-for-ssr).

### Server Components

This is the React 18 solution. "Just call the backend code in the component".

```tsx
// components/user.server.tsx
export const UserInfo: React.FC<{ userId: string }> = (props) => {
  const user = prisma.user.findFirst({ where: { id: props.userId } });

  return <div>Hello {user?.name}</div>;
};

// pages/user/[id].tsx
import { Suspense } from "react";
import { UserInfo } from "../../components/user.server";

export default function UserInfoPage(props) {
  const { query } = useRouter();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserInfo userId={query.id} />
    </Suspense>
  );
}
```

Server components are really damn cool. I think they will help significantly reduce the number of places where this problem exists. I also suspect the transition towards server components will take a long while, and important cases like header metadata will be missed unless explicitly SSR'd ahead of time.

Server components are the future. What about now?

## A Proposal: `_props.ts`

I want to preface this with a few things

- I'm writing this out of immense love for Vercel and Next.js. This stack is the most productive I've ever felt and I don't suspect that will change any time soon. I'm betting my company on it.
- I'm far from a TypeScript expert - especially on the maintainer side. TypeScript is a whole different beast when you are working on libraries that provide generics. Thank you [Tanner](https://twitter.com/tannerlinsley) and [KATT](https://twitter.com/alexdotjs) for giving me a glimpse into that world.
- I have no intention of implementing any of the things I discuss here. I'm very happy with my tRPC + Next setup and don't want to move. This is purely theoretical.

All that said, hear me out.

### Lightly Inspired

Think of this ergonomically as an in-between of the new [Next.js Middleware syntax](https://nextjs.org/docs/middleware) of `_middleware.ts` and the philosophy behind [Blitz.js query resolvers](https://blitzjs.com/docs/query-resolvers).

```tsx
// pages/user-info/_props.ts
export async function getServerSideProps(context) {
  const id = context.params.id;
  const user = await prisma.user.findFirst({ where: { id: id } });

  return { props: { user } };
}

// pages/user-info/[id].ts
import Props from "./_props"; // This will have to be some wizardry or a compile step

// This should lint error if the type was assigned
// to something other than _props in the same dir
export default function UserInfo(props: Props) {
  return <div>Hello {props.user?.name}</div>;
}
```

This is a very rough sketch of what I have in mind. My "general thought" is a file-level barrier between "the thing run on the server" and "the thing run on server AND client", with an implicit type contract (potentially generated) through the creation of these files.

Under the hood I would expect this to use something similar to the `AsyncInferType` example earlier. I can see potential ways to extend this further, such as additional keys you can return or other named files i.e. `_serverSideProps.ts` or `_staticProps.ts`.

Generally, I like the idea of "files with an underscore run on the server", and that thought brought me here.

## Thank You

This was a long one. I know it may seem harsh towards Next and Vercel, but that was not my intent at all. I'm critical out of love. I would never have written this much about something _I didn't intend to use for years_. I bet my company on this stack. I feel like we're working in a stack from the future.

That said, I'd expect a little more type safety from [React in 2025](https://react2025.com/).
