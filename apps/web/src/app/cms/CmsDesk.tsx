'use client';

import { CMS_SLOT_KEYS } from '@pttcrm/gtm-core';
import { useEffect, useState } from 'react';

type Tab = 'articles' | 'events' | 'customers' | 'media' | 'slots';

type Article = {
  id: string;
  slug: string;
  status: string;
  category: string;
  featured_home: boolean;
  title_vi: string;
  title_en: string | null;
  dek_vi: string;
  dek_en: string | null;
  body_vi: string;
  body_en: string | null;
  cover_url: string | null;
  alt_vi: string;
  alt_en: string | null;
};

type EventRow = {
  id: string;
  slug: string;
  status: string;
  title_vi: string;
  title_en: string | null;
  dek_vi: string;
  dek_en: string | null;
  body_vi: string;
  body_en: string | null;
  start_at: string;
  end_at: string;
  location_vi: string | null;
  cta_url: string | null;
};

type CustomerRow = {
  id: string;
  slug: string;
  status: string;
  po_signed: boolean;
  metrics_verified: boolean;
  industry: string;
  sku: string;
  title_vi: string;
  title_en: string | null;
  summary_vi: string;
  summary_en: string | null;
  body_vi: string;
  cpl_vnd: number;
  roas: number;
};

type MediaRow = { id: string; public_url: string; filename: string; alt_vi: string };
type SlotRow = { slot_key: string; media_url: string | null; caption_vi: string | null };

const emptyArticle = (): Article => ({
  id: '',
  slug: '',
  status: 'draft',
  category: 'insight',
  featured_home: false,
  title_vi: '',
  title_en: '',
  dek_vi: '',
  dek_en: '',
  body_vi: '',
  body_en: '',
  cover_url: '',
  alt_vi: '',
  alt_en: '',
});

const emptyCustomer = (): CustomerRow => ({
  id: '',
  slug: '',
  status: 'draft',
  po_signed: false,
  metrics_verified: false,
  industry: 'agency',
  sku: 'ind',
  title_vi: '',
  title_en: '',
  summary_vi: '',
  summary_en: '',
  body_vi: '',
  cpl_vnd: 0,
  roas: 0,
});

const emptyEvent = (): EventRow => ({
  id: '',
  slug: '',
  status: 'draft',
  title_vi: '',
  title_en: '',
  dek_vi: '',
  dek_en: '',
  body_vi: '',
  body_en: '',
  start_at: new Date().toISOString().slice(0, 16),
  end_at: new Date(Date.now() + 3600000).toISOString().slice(0, 16),
  location_vi: '',
  cta_url: '/vi/dang-ky-demo',
});

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, init);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error || `HTTP ${res.status}`);
  return data as T;
}

export function CmsDesk() {
  const [tab, setTab] = useState<Tab>('articles');
  const [err, setErr] = useState('');
  const [articles, setArticles] = useState<Article[]>([]);
  const [events, setEvents] = useState<EventRow[]>([]);
  const [customers, setCustomers] = useState<CustomerRow[]>([]);
  const [media, setMedia] = useState<MediaRow[]>([]);
  const [slots, setSlots] = useState<SlotRow[]>([]);
  const [article, setArticle] = useState<Article>(emptyArticle());
  const [event, setEvent] = useState<EventRow>(emptyEvent());
  const [customer, setCustomer] = useState<CustomerRow>(emptyCustomer());

  async function reload() {
    const [a, e, c, m, s] = await Promise.all([
      api<Article[]>('/api/cms/admin/articles'),
      api<EventRow[]>('/api/cms/admin/events'),
      api<CustomerRow[]>('/api/cms/admin/customers'),
      api<MediaRow[]>('/api/cms/admin/media'),
      api<SlotRow[]>('/api/cms/admin/slots'),
    ]);
    setArticles(a);
    setEvents(e);
    setCustomers(c);
    setMedia(m);
    setSlots(s);
  }

  useEffect(() => {
    reload().catch((e: Error) => setErr(e.message));
  }, []);

  async function logout() {
    await fetch('/api/cms/admin/logout', { method: 'POST' });
    window.location.href = '/cms/login';
  }

  return (
    <div className="cms-shell">
      <header className="cms-top">
        <div>
          <h1>CMS PTTCRM</h1>
          <p>Tin / sự kiện / khách hàng / media / slot — lưu trên site, không qua hệ thống khác.</p>
        </div>
        <button className="cms-btn" type="button" onClick={logout}>
          Đăng xuất
        </button>
      </header>
      <div className="cms-tabs" role="tablist">
        {(['articles', 'events', 'customers', 'media', 'slots'] as Tab[]).map((t) => (
          <button key={t} type="button" role="tab" aria-selected={tab === t} onClick={() => setTab(t)}>
            {t}
          </button>
        ))}
      </div>
      <p className="cms-err">{err}</p>

      {tab === 'articles' && (
        <div className="cms-grid">
          <div className="cms-list">
            <button type="button" onClick={() => setArticle(emptyArticle())}>
              + Bài mới
            </button>
            {articles.map((a) => (
              <button
                key={a.id}
                type="button"
                aria-current={article.id === a.id}
                onClick={() => setArticle(a)}
              >
                {a.title_vi || a.slug}
                <small>
                  {a.status} · {a.slug}
                </small>
              </button>
            ))}
          </div>
          <form
            className="cms-form"
            onSubmit={async (e) => {
              e.preventDefault();
              setErr('');
              try {
                const body = { ...article, cover_url: article.cover_url || null };
                const saved = article.id
                  ? await api<Article>(`/api/cms/admin/articles/${article.id}`, {
                      method: 'PATCH',
                      headers: { 'content-type': 'application/json' },
                      body: JSON.stringify(body),
                    })
                  : await api<Article>('/api/cms/admin/articles', {
                      method: 'POST',
                      headers: { 'content-type': 'application/json' },
                      body: JSON.stringify(body),
                    });
                setArticle(saved);
                await reload();
              } catch (ex) {
                setErr(ex instanceof Error ? ex.message : 'save_failed');
              }
            }}
          >
            <label>
              Slug
              <input value={article.slug} onChange={(e) => setArticle({ ...article, slug: e.target.value })} required />
            </label>
            <label>
              Category
              <select
                value={article.category}
                onChange={(e) => setArticle({ ...article, category: e.target.value })}
              >
                <option value="insight">insight</option>
                <option value="nganh">nganh</option>
                <option value="huong-dan">huong-dan</option>
              </select>
            </label>
            <label>
              Title VI
              <input value={article.title_vi} onChange={(e) => setArticle({ ...article, title_vi: e.target.value })} />
            </label>
            <label>
              Title EN
              <input value={article.title_en ?? ''} onChange={(e) => setArticle({ ...article, title_en: e.target.value })} />
            </label>
            <label>
              Dek VI
              <textarea value={article.dek_vi} onChange={(e) => setArticle({ ...article, dek_vi: e.target.value })} />
            </label>
            <label>
              Body VI
              <textarea value={article.body_vi} onChange={(e) => setArticle({ ...article, body_vi: e.target.value })} />
            </label>
            <label>
              Body EN
              <textarea value={article.body_en ?? ''} onChange={(e) => setArticle({ ...article, body_en: e.target.value })} />
            </label>
            <label>
              Cover URL
              <input value={article.cover_url ?? ''} onChange={(e) => setArticle({ ...article, cover_url: e.target.value })} />
            </label>
            <label>
              <span>
                <input
                  type="checkbox"
                  checked={article.featured_home}
                  onChange={(e) => setArticle({ ...article, featured_home: e.target.checked })}
                />{' '}
                Featured home
              </span>
            </label>
            <div className="cms-actions">
              <button className="cms-btn cms-btn-solid" type="submit">
                Lưu draft
              </button>
              {article.id && (
                <button
                  className="cms-btn"
                  type="button"
                  onClick={async () => {
                    setErr('');
                    try {
                      setArticle(await api<Article>(`/api/cms/admin/articles/${article.id}/publish`, { method: 'POST' }));
                      await reload();
                    } catch (ex) {
                      setErr(ex instanceof Error ? ex.message : 'publish_failed');
                    }
                  }}
                >
                  Publish
                </button>
              )}
              {article.id && (
                <button
                  className="cms-btn cms-btn-danger"
                  type="button"
                  onClick={async () => {
                    setErr('');
                    try {
                      setArticle(await api<Article>(`/api/cms/admin/articles/${article.id}/archive`, { method: 'POST' }));
                      await reload();
                    } catch (ex) {
                      setErr(ex instanceof Error ? ex.message : 'archive_failed');
                    }
                  }}
                >
                  Archive
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {tab === 'events' && (
        <div className="cms-grid">
          <div className="cms-list">
            <button type="button" onClick={() => setEvent(emptyEvent())}>
              + Sự kiện mới
            </button>
            {events.map((ev) => (
              <button key={ev.id} type="button" aria-current={event.id === ev.id} onClick={() => setEvent(ev)}>
                {ev.title_vi || ev.slug}
                <small>
                  {ev.status} · {ev.slug}
                </small>
              </button>
            ))}
          </div>
          <form
            className="cms-form"
            onSubmit={async (e) => {
              e.preventDefault();
              setErr('');
              try {
                const body = {
                  ...event,
                  start_at: new Date(event.start_at).toISOString(),
                  end_at: new Date(event.end_at).toISOString(),
                };
                const saved = event.id
                  ? await api<EventRow>(`/api/cms/admin/events/${event.id}`, {
                      method: 'PATCH',
                      headers: { 'content-type': 'application/json' },
                      body: JSON.stringify(body),
                    })
                  : await api<EventRow>('/api/cms/admin/events', {
                      method: 'POST',
                      headers: { 'content-type': 'application/json' },
                      body: JSON.stringify(body),
                    });
                setEvent(saved);
                await reload();
              } catch (ex) {
                setErr(ex instanceof Error ? ex.message : 'save_failed');
              }
            }}
          >
            <label>
              Slug
              <input value={event.slug} onChange={(e) => setEvent({ ...event, slug: e.target.value })} required />
            </label>
            <label>
              Title VI
              <input value={event.title_vi} onChange={(e) => setEvent({ ...event, title_vi: e.target.value })} />
            </label>
            <label>
              Dek VI
              <textarea value={event.dek_vi} onChange={(e) => setEvent({ ...event, dek_vi: e.target.value })} />
            </label>
            <label>
              Body VI
              <textarea value={event.body_vi} onChange={(e) => setEvent({ ...event, body_vi: e.target.value })} />
            </label>
            <label>
              Start
              <input type="datetime-local" value={toLocal(event.start_at)} onChange={(e) => setEvent({ ...event, start_at: e.target.value })} />
            </label>
            <label>
              End
              <input type="datetime-local" value={toLocal(event.end_at)} onChange={(e) => setEvent({ ...event, end_at: e.target.value })} />
            </label>
            <label>
              Location VI
              <input value={event.location_vi ?? ''} onChange={(e) => setEvent({ ...event, location_vi: e.target.value })} />
            </label>
            <label>
              CTA URL
              <input value={event.cta_url ?? ''} onChange={(e) => setEvent({ ...event, cta_url: e.target.value })} />
            </label>
            <div className="cms-actions">
              <button className="cms-btn cms-btn-solid" type="submit">
                Lưu draft
              </button>
              {event.id && (
                <button
                  className="cms-btn"
                  type="button"
                  onClick={async () => {
                    setErr('');
                    try {
                      setEvent(await api<EventRow>(`/api/cms/admin/events/${event.id}/publish`, { method: 'POST' }));
                      await reload();
                    } catch (ex) {
                      setErr(ex instanceof Error ? ex.message : 'publish_failed');
                    }
                  }}
                >
                  Publish
                </button>
              )}
              {event.id && (
                <button
                  className="cms-btn cms-btn-danger"
                  type="button"
                  onClick={async () => {
                    setErr('');
                    try {
                      setEvent(await api<EventRow>(`/api/cms/admin/events/${event.id}/archive`, { method: 'POST' }));
                      await reload();
                    } catch (ex) {
                      setErr(ex instanceof Error ? ex.message : 'archive_failed');
                    }
                  }}
                >
                  Archive
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {tab === 'customers' && (
        <div className="cms-grid">
          <div className="cms-list">
            <button type="button" onClick={() => setCustomer(emptyCustomer())}>
              + Case mới
            </button>
            {customers.map((row) => (
              <button
                key={row.id}
                type="button"
                aria-current={customer.id === row.id}
                onClick={() => setCustomer(row)}
              >
                {row.title_vi || row.slug}
                <small>
                  {row.status} · {row.industry} · PO {row.po_signed ? 'ký' : 'chưa'}
                </small>
              </button>
            ))}
          </div>
          <form
            className="cms-form"
            onSubmit={async (e) => {
              e.preventDefault();
              setErr('');
              try {
                const body = {
                  ...customer,
                  cpl_vnd: Number(customer.cpl_vnd) || 0,
                  roas: Number(customer.roas) || 0,
                };
                const saved = customer.id
                  ? await api<CustomerRow>(`/api/cms/admin/customers/${customer.id}`, {
                      method: 'PATCH',
                      headers: { 'content-type': 'application/json' },
                      body: JSON.stringify(body),
                    })
                  : await api<CustomerRow>('/api/cms/admin/customers', {
                      method: 'POST',
                      headers: { 'content-type': 'application/json' },
                      body: JSON.stringify(body),
                    });
                setCustomer(saved);
                await reload();
              } catch (ex) {
                setErr(ex instanceof Error ? ex.message : 'save_failed');
              }
            }}
          >
            <label>
              Slug
              <input value={customer.slug} onChange={(e) => setCustomer({ ...customer, slug: e.target.value })} required />
            </label>
            <label>
              Ngành
              <select value={customer.industry} onChange={(e) => setCustomer({ ...customer, industry: e.target.value })}>
                <option value="bds">bds</option>
                <option value="agency">agency</option>
                <option value="fnb">fnb</option>
                <option value="education">education</option>
                <option value="pharma">pharma</option>
              </select>
            </label>
            <label>
              SKU
              <select value={customer.sku} onChange={(e) => setCustomer({ ...customer, sku: e.target.value })}>
                <option value="mkt">mkt</option>
                <option value="ind">ind</option>
                <option value="agy">agy</option>
              </select>
            </label>
            <label>
              Title VI
              <input value={customer.title_vi} onChange={(e) => setCustomer({ ...customer, title_vi: e.target.value })} />
            </label>
            <label>
              Title EN
              <input value={customer.title_en ?? ''} onChange={(e) => setCustomer({ ...customer, title_en: e.target.value })} />
            </label>
            <label>
              Summary VI
              <textarea value={customer.summary_vi} onChange={(e) => setCustomer({ ...customer, summary_vi: e.target.value })} />
            </label>
            <label>
              Body VI
              <textarea value={customer.body_vi} onChange={(e) => setCustomer({ ...customer, body_vi: e.target.value })} />
            </label>
            <label>
              <span>
                <input
                  type="checkbox"
                  checked={customer.po_signed}
                  onChange={(e) =>
                    setCustomer({
                      ...customer,
                      po_signed: e.target.checked,
                      metrics_verified: e.target.checked ? customer.metrics_verified : false,
                    })
                  }
                />{' '}
                PO đã ký (bắt buộc để publish)
              </span>
            </label>
            <label>
              <span>
                <input
                  type="checkbox"
                  checked={customer.metrics_verified}
                  disabled={!customer.po_signed}
                  onChange={(e) => setCustomer({ ...customer, metrics_verified: e.target.checked })}
                />{' '}
                PO xác nhận số (mới hiện CPL/ROAS)
              </span>
            </label>
            <label>
              CPL VND
              <input
                type="number"
                value={customer.cpl_vnd}
                onChange={(e) => setCustomer({ ...customer, cpl_vnd: Number(e.target.value) })}
              />
            </label>
            <label>
              ROAS
              <input
                type="number"
                step="0.1"
                value={customer.roas}
                onChange={(e) => setCustomer({ ...customer, roas: Number(e.target.value) })}
              />
            </label>
            <div className="cms-actions">
              <button className="cms-btn cms-btn-solid" type="submit">
                Lưu draft
              </button>
              {customer.id && (
                <button
                  className="cms-btn"
                  type="button"
                  onClick={async () => {
                    setErr('');
                    try {
                      setCustomer(
                        await api<CustomerRow>(`/api/cms/admin/customers/${customer.id}/publish`, { method: 'POST' }),
                      );
                      await reload();
                    } catch (ex) {
                      setErr(ex instanceof Error ? ex.message : 'publish_failed');
                    }
                  }}
                >
                  Publish
                </button>
              )}
              {customer.id && (
                <button
                  className="cms-btn cms-btn-danger"
                  type="button"
                  onClick={async () => {
                    setErr('');
                    try {
                      setCustomer(
                        await api<CustomerRow>(`/api/cms/admin/customers/${customer.id}/archive`, { method: 'POST' }),
                      );
                      await reload();
                    } catch (ex) {
                      setErr(ex instanceof Error ? ex.message : 'archive_failed');
                    }
                  }}
                >
                  Archive
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {tab === 'media' && (
        <div>
          <form
            className="cms-form"
            onSubmit={async (e) => {
              e.preventDefault();
              setErr('');
              const form = e.currentTarget;
              const data = new FormData(form);
              try {
                await api('/api/cms/admin/media', { method: 'POST', body: data });
                form.reset();
                await reload();
              } catch (ex) {
                setErr(ex instanceof Error ? ex.message : 'upload_failed');
              }
            }}
          >
            <label>
              Ảnh (jpeg/png/webp/svg, ≤ 5MB)
              <input name="file" type="file" accept="image/jpeg,image/png,image/webp,image/svg+xml" required />
            </label>
            <label>
              Alt VI
              <input name="alt_vi" />
            </label>
            <button className="cms-btn cms-btn-solid" type="submit">
              Upload
            </button>
          </form>
          <div className="cms-media" style={{ marginTop: 16 }}>
            {media.map((m) => (
              <figure key={m.id}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m.public_url} alt={m.alt_vi} />
                <figcaption>
                  <small>{m.public_url}</small>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      )}

      {tab === 'slots' && (
        <div className="cms-form">
          {CMS_SLOT_KEYS.map((key) => {
            const row = slots.find((s) => s.slot_key === key);
            return (
              <form
                key={key}
                onSubmit={async (e) => {
                  e.preventDefault();
                  const fd = new FormData(e.currentTarget);
                  setErr('');
                  try {
                    await api(`/api/cms/admin/slots/${key}`, {
                      method: 'PUT',
                      headers: { 'content-type': 'application/json' },
                      body: JSON.stringify({
                        media_url: String(fd.get('media_url') || '') || null,
                        caption_vi: String(fd.get('caption_vi') || '') || null,
                      }),
                    });
                    await reload();
                  } catch (ex) {
                    setErr(ex instanceof Error ? ex.message : 'slot_failed');
                  }
                }}
              >
                <strong>{key}</strong>
                <label>
                  Media URL
                  <input name="media_url" defaultValue={row?.media_url ?? ''} />
                </label>
                <label>
                  Caption VI
                  <input name="caption_vi" defaultValue={row?.caption_vi ?? ''} />
                </label>
                <button className="cms-btn" type="submit">
                  Lưu slot
                </button>
              </form>
            );
          })}
        </div>
      )}
    </div>
  );
}

function toLocal(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso.slice(0, 16);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
