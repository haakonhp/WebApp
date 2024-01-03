export default function TaskText(props: { text: string }) {
  const { text } = props
  return <p className="text-sm text-slate-400">{text}</p>
}
