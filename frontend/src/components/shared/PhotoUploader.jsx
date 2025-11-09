export default function PhotoUploader({ onFiles }) {
  return (
    <label className="block border rounded p-3 cursor-pointer">
      <input type="file" multiple accept="image/*" className="hidden"
             onChange={(e)=> onFiles?.([...e.target.files]) } />
      <div className="text-sm">Upload Foto Lapangan</div>
      <div className="text-xs text-gray-500">PNG/JPG, maksimal 4MB/berkas</div>
    </label>
  );
}
