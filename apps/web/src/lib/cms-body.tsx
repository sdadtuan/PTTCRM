export function CmsBody({ body }: { body: string }) {
  return (
    <>
      {body.split('\n\n').map((para, i) => {
        const key = `${i}-${para.slice(0, 24)}`;
        if (para.startsWith('## ')) return <h2 key={key}>{para.slice(3)}</h2>;
        if (para.startsWith('# ')) return <h2 key={key}>{para.slice(2)}</h2>;
        return <p key={key}>{para}</p>;
      })}
    </>
  );
}
