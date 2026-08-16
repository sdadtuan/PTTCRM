'use client';

import { useState } from 'react';

export default function CmsLoginPage() {
  const [secret, setSecret] = useState('');
  const [err, setErr] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr('');
    const res = await fetch('/api/cms/admin/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ secret }),
    });
    if (!res.ok) {
      setErr('Sai mật khẩu CMS.');
      return;
    }
    window.location.href = '/cms';
  }

  return (
    <form className="cms-login" onSubmit={onSubmit}>
      <h1>CMS PTTCRM</h1>
      <p>Desk tin tức / sự kiện của site marketing. Không dùng engine khác.</p>
      <label>
        Mật khẩu
        <input type="password" value={secret} onChange={(e) => setSecret(e.target.value)} required />
      </label>
      <p className="cms-err">{err}</p>
      <button className="cms-btn cms-btn-solid" type="submit">
        Đăng nhập
      </button>
    </form>
  );
}
