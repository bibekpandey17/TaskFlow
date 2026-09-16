export default function ConfirmDeleteModal({
  employee,
  onConfirm,
  onCancel,
}) {
  if (!employee) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">

        {/* Title */}
        <h2 className="text-lg font-semibold text-slate-800">
          Delete Employee
        </h2>

        {/* Message */}
        <p className="text-sm text-slate-500 mt-2">
          Are you sure you want to delete{" "}
          <span className="font-medium text-slate-700">
            {employee.name}
          </span>
          ?
        </p>

        <p className="text-xs text-slate-400 mt-1">
          This action cannot be undone.
        </p>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">

          {/* Cancel */}
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50"
          >
            Cancel
          </button>

          {/* Confirm */}
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
          >
            Confirm
          </button>

        </div>
      </div>
    </div>
  );
}