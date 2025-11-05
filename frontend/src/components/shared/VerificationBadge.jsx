export default function VerificationBadge({ status = "menunggu" }) {
  const style =
    status === "valid"
      ? "bg-emerald-100 text-emerald-700"
      : status === "tidak_valid"
      ? "bg-rose-100 text-rose-700"
      : "bg-amber-100 text-amber-700";
  return (
    <span className={`inline-block px-2 py-1 text-xs rounded ${style}`}>
      {String(status).replace("_", " ").toUpperCase()}
    </span>
  );
}
