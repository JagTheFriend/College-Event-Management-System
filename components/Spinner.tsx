export default function Spinner({ size = 24 }: { size?: number }) {
  return (
    <div className="flex items-center justify-center p-8">
      <div
        className="spinner"
        style={{ width: size, height: size, borderWidth: Math.max(2, size / 8) }}
      />
    </div>
  );
}
