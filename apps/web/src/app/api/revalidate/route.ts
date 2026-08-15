import { revalidateTag } from 'next/cache';

export async function POST(req: Request) {
  const secret = req.headers.get('x-cms-secret');
  if (secret !== process.env.CMS_REVALIDATE_SECRET) {
    return new Response('Unauthorized', { status: 401 });
  }

  let tags: string[] = [];
  try {
    const body = (await req.json()) as { tags?: string[] };
    tags = body.tags ?? [];
  } catch {
    return new Response('Bad Request', { status: 400 });
  }

  for (const tag of tags) {
    revalidateTag(tag);
  }

  return Response.json({ ok: true, revalidated: tags });
}
