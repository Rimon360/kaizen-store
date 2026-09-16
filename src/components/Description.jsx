// Renders the admin's plain-text description: blank lines separate paragraphs,
// and lines starting with "- ", "• " or "* " become a bulleted list. Plain text
// in, React elements out — the admin's text is never parsed as HTML.
const BULLET = /^\s*[-•*]\s+/

function toBlocks(text) {
  const blocks = []
  for (const chunk of String(text || "").split(/\n\s*\n/)) {
    let paragraph = []
    let list = []
    const flushParagraph = () => paragraph.length && (blocks.push({ type: "p", lines: paragraph }), (paragraph = []))
    const flushList = () => list.length && (blocks.push({ type: "ul", items: list }), (list = []))
    for (const line of chunk.split("\n")) {
      if (!line.trim()) continue
      if (BULLET.test(line)) {
        flushParagraph()
        list.push(line.replace(BULLET, ""))
      } else {
        flushList()
        paragraph.push(line)
      }
    }
    flushParagraph()
    flushList()
  }
  return blocks
}

export default function Description({ text }) {
  return (
    <div className="space-y-4 text-[15px] leading-relaxed text-steel-300">
      {toBlocks(text).map((block, i) =>
        block.type === "ul" ? (
          <ul key={i} className="space-y-2">
            {block.items.map((item, j) => (
              <li key={j} className="flex gap-3">
                <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-glow-400" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p key={i} className="whitespace-pre-line [overflow-wrap:anywhere]">
            {block.lines.join("\n")}
          </p>
        ),
      )}
    </div>
  )
}
