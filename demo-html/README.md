# PTTCRM — HTML demo (W0 preview)

Clickable static prototype of the commercial site. Not the Next.js app.

## Open

```bash
cd demo-html
python3 -m http.server 3300
```

Then open http://127.0.0.1:3300/

## Pages

- `/` home
- `/bang-gia.html` pricing (VND when VI, no USD when EN)
- `/dang-ky-demo.html` form (prefill `?industry=agency&sku=agy`)
- `/san-pham/{crm,ads,portal,ai}.html`
- `/giai-phap/{bds,agency,fnb}.html`
- `/ve-chung-toi.html`
- `/phap-ly/{bao-mat,dieu-khoan,cookie}.html`

Toggle **VI | EN** in the header. Cookie bar is localStorage only.
