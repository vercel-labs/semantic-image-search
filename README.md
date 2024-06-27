<a href="https://semantic-search.vercel.app">
  <img alt="Next.js 14 and App Router Semantic Search." src="https://semantic-image-search.vercel.app/opengraph-image.png">
  <h1 align="center">Semantic Image Search</h1>
</a>

<p align="center">
  An open-source AI semantic image search app template built with Next.js, the Vercel AI SDK, OpenAI, Vercel Postgres, Vercel Blob and Vercel KV.
</p>

<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#model-providers"><strong>Model Providers</strong></a> ·
  <a href="#deploy-your-own"><strong>Deploy Your Own</strong></a> ·
  <a href="#running-locally"><strong>Running locally</strong></a> ·
  <a href="#authors"><strong>Authors</strong></a>
</p>
<br/>

## Features

- [Next.js](https://nextjs.org) App Router
- React Server Components (RSCs), Suspense, and Server Actions
- [Vercel AI SDK](https://sdk.vercel.ai/docs) for multimodal prompting, generating & embedding image metadata, and streaming images from Server to Client
- Support for OpenAI (default), Gemini, Anthropic, Cohere, or custom AI chat models
- [shadcn/ui](https://ui.shadcn.com)
  - Styling with [Tailwind CSS](https://tailwindcss.com)
  - [Radix UI](https://radix-ui.com) for headless component primitives
- Query caching with [Vercel KV](https://vercel.com/storage/kv)
- Embeddings powered by [Vercel Postgres](https://vercel.com/storage/kv), [pgvector](https://github.com/pgvector/pgvector-node#drizzle-orm), and [Drizzle ORM](https://orm.drizzle.team/)
- File (image) storage with [Vercel Blob](https://vercel.com/storage/blob)

## Model Providers

This template ships with OpenAI `GPT-4o` as the default. However, thanks to the [Vercel AI SDK](https://sdk.vercel.ai/docs), you can switch LLM providers to [Gemini](https://gemini.google.com/), [Anthropic](https://anthropic.com), [Cohere](https://cohere.com/), and [more](https://sdk.vercel.ai/providers/ai-sdk-providers) with just a few lines of code.

## Deploy Your Own

You can deploy your own version of the Semantic Image Search App to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel-labs%2Fsemantic-image-search&env=OPENAI_API_KEY&envDescription=OpenAI%20key%20needed&envLink=https%3A%2F%2Fplatform.openai.com%2Fdocs%2Foverview)

## Setup
### Creating a KV Database Instance

Follow the steps outlined in the [quick start guide](https://vercel.com/docs/storage/vercel-kv/quickstart#create-a-kv-database) provided by Vercel. This guide will assist you in creating and configuring your KV database instance on Vercel, enabling your application to interact with it.

Remember to update your environment variables (`KV_URL`, `KV_REST_API_URL`, `KV_REST_API_TOKEN`, `KV_REST_API_READ_ONLY_TOKEN`) in the `.env` file with the appropriate credentials provided during the KV database setup.

### Creating a Postgres Database Instance

Follow the steps outlined in the [quick start guide](https://vercel.com/docs/storage/vercel-postgres/quickstart) provided by Vercel. This guide will assist you in creating and configuring your Postgres database instance on Vercel, enabling your application to interact with it.

Once you have instantiated your Vercel Postgres instance, run the following code to enable `pgvector`:
```bash
CREATE EXTENSION vector;
```

Remember to update your environment variables (`POSTGRES_URL`, `POSTGRES_PRISMA_URL`, `POSTGRES_URL_NON_POOLING`, `POSTGRES_USER`, `POSTGRES_HOST`, `POSTGRES_PASSWORD`, `POSTGRES_DATABASE`) in the `.env` file with the appropriate credentials provided during the Postgres database setup.

### Creating a Blob Instance

Follow the steps outlined in the [quick start guide](https://vercel.com/docs/storage/vercel-blob) provided by Vercel. This guide will assist you in creating and configuring your Blob instance on Vercel, enabling your application to interact with it.

Remember to update your environment variable (`BLOB_READ_WRITE_TOKEN`) in the `.env` file with the appropriate credentials provided during the Blob setup.


## Running locally

You will need to use the environment variables [defined in `.env.example`](.env.example) to run Next.js Semantic Image Search. It's recommended you use [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables) for this, but a `.env` file is all that is necessary.

> Note: You should not commit your `.env` file or it will expose secrets that will allow others to control access to your various OpenAI and authentication provider accounts.

1. Install Vercel CLI: `npm i -g vercel`
2. Link local instance with Vercel and GitHub accounts (creates `.vercel` directory): `vercel link`
3. Download your environment variables: `vercel env pull`

```bash
pnpm install
```

## Add OpenAI API Key
Be sure to add your OpenAI API Key to your `.env`.

## Database Setup
To push your schema changes to your Vercel Postgres database, run the following command.
```bash
pnpm run db:generate
pnpm run db:push
```

## Prepare your Images (Indexing Step)
To get your application ready for Semantic search, you will have to complete three steps.
1. Upload Images to storage
2. Send Images to a Large Language Model to generate metadata (title, description)
3. Iterate over each image, embed the metadata, and then save to the database

### Upload Images
Put the images you want to upload in the `images-to-index` directory (.jpg format) at the root of your application. Run the following command.
```bash
pnpm run upload
```
This script will upload the images to your Vercel Blob store.
Depending on how many photos you are uploading, this step could take a while.

### Generate Metadata
Run the following command.
```bash
pnpm run generate-metadata
```
This script will generate metadata for each of the images you uploaded in the previous step.
Depending on how many photos you are uploading, this step could take a while.

### Embed Metadata and Save to Database
Run the following command.
```bash
pnpm run embed-and-save
```
Depending on how many photos you are uploading, this step could take a while. This script will embed the descriptions generated in the previous step and save them to your Vercel Postgres instance.

## Starting the Server
Run the following command
```bash
pnpm run dev
```
Your app template should now be running on [localhost:3000](http://localhost:3000/).

## Authors

This library is created by [Vercel](https://vercel.com) and [Next.js](https://nextjs.org) team members, with contributions from:

- Jared Palmer ([@jaredpalmer](https://twitter.com/jaredpalmer)) - [Vercel](https://vercel.com)
- Shu Ding ([@shuding\_](https://twitter.com/shuding_)) - [Vercel](https://vercel.com)
- shadcn ([@shadcn](https://twitter.com/shadcn)) - [Vercel](https://vercel.com)
- Lars Grammel ([@lgrammel](https://twitter.com/lgrammel)) - [Vercel](https://vercel.com)
- Nico Albanese ([@nicoalbanese10](https://twitter.com/nicoalbanese10)) - [Vercel](https://vercel.com)
