import { useMemo, useState } from 'react';
import EmployeeRow from './EmployeeRow';

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'department', label: 'Department' },
  { key: 'position', label: 'Position' },
  { key: 'email', label: 'Email' },
  { key: 'status', label: 'Status' },
]

export default function EmployeeTable({ employees, onDeleteClick }) {
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState('name')
  const [sortAsc, setSortAsc] = useState(true)

  const filtered = useMemo(() => {
    let result = employees.filter((emp) =>
      [emp.name, emp.department, emp.position, emp.email]
        .join(' ')
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    result.sort((a, b) => {
      const valA = String(a[sortKey]).toLowerCase()
      const valB = String(b[sortKey]).toLowerCase()
      if (valA < valB) return sortAsc ? -1 : 1
      if (valA > valB) return sortAsc ? 1 : -1
      return 0
    })
    return result
  }, [employees, search, sortKey, sortAsc])

  function handleSort(key) {
    if (sortKey === key) {
      setSortAsc(!sortAsc)
    } else {
      setSortKey(key)
      setSortAsc(true)
    }
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
      <div className="p-4 border-b border-slate-100">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, department, position, or email"
          className="w-full max-w-sm border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 text-left">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className="py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wide cursor-pointer select-none"
                >
                  {col.label} {sortKey === col.key ? (sortAsc ? '▲' : '▼') : ''}
                </th>
              ))}
              <th className="py-3 px-4"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((emp) => (
              <EmployeeRow key={emp.id} employee={emp} onDeleteClick={onDeleteClick} />
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <p className="text-center text-sm text-slate-500 py-8">No employees match your search.</p>
        )}
      </div>
    </div>
  )
}