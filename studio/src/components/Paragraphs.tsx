export function Paragraphs({ text }: { text: string }) {
  return (
    <>
      {text.split(/\n\n+/).filter(Boolean).map((paragraph) => (
        <p key={paragraph.slice(0, 48)}>{paragraph}</p>
      ))}
    </>
  );
}
