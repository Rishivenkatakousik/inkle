"use client"

import React, { useEffect, useState, useRef } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { fetchCustomerById, fetchCountries, updateCustomer } from "@/lib/api"
import { TableRow } from "@/types/table"
import { IoMdClose } from "react-icons/io"
import { LuPencil } from "react-icons/lu"
import { FaMapMarkerAlt } from "react-icons/fa"

interface Props {
  id: string
  open: boolean
  onClose: () => void
}

export default function EditCustomerModal({ id, open, onClose }: Props) {
  const [name, setName] = useState("")
  const [countryName, setCountryName] = useState("India")
  const [countryId, setCountryId] = useState("")
  const [error, setError] = useState("")
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ["customer", id],
    queryFn: () => fetchCustomerById(id),
    enabled: open,
  })

  const {
    data: countries = [],
    isLoading: isCountriesLoading,
    isError: isCountriesError,
  } = useQuery({
    queryKey: ["countries"],
    queryFn: fetchCountries,
    enabled: open,
  })

  // Mutation for updating customer
  const { mutate, isPending: isSaving } = useMutation({
    mutationFn: (updateData: { name: string; country: string; countryId: string }) =>
      updateCustomer(id, updateData),
    onSuccess: (updatedCustomer) => {
      queryClient.setQueryData(["customer", id], updatedCustomer)

      queryClient.setQueryData<TableRow[]>(["table-data"], (oldData) => {
        if (!oldData) return oldData
        return oldData.map((row) =>
          row.id === id
            ? {
                ...row,
                name: updatedCustomer.name,
                country: updatedCustomer.country,
              }
            : row
        )
      })

      queryClient.invalidateQueries({ queryKey: ["table-data"] })

      onClose()
    },
    onError: (err: Error) => {
      setError(err.message || "Failed to save changes")
    },
  })

  useEffect(() => {
    if (data?.name) setName(data.name)
    if (data?.country) setCountryName(data.country)
    if (data?.id) setCountryId(data.id)
  }, [data])

  useEffect(() => {
    if (countries.length > 0 && countryName && !countryId) {
      const found = countries.find((c: { name: string }) => c.name === countryName)
      if (found) setCountryId(found.id)
    }
  }, [countries, countryName, countryId])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  if (!open) return null

  const handleCountrySelect = (countryItem: { name: string; id: string }) => {
    setCountryName(countryItem.name)
    setCountryId(countryItem.id)
    setDropdownOpen(false)
  }

  const handleSave = () => {
    if (!name.trim()) {
      setError("Name is required")
      return
    }
    setError("")
    
    mutate({
      name,
      country: countryName,
      countryId,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-xl h-[490px] bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between h-[56px] w-full pt-4 pr-4 pb-4 pl-8 border-b border-gray-100">
          <h2 className="font-semibold text-[20px] tracking-[0.15px] text-purple-deep">
            Edit Customer
          </h2>
          <button onClick={onClose} className="p-1 rounded-full transition-colors" disabled={isSaving}>
            <IoMdClose className="h-6 w-6 text-grey-primary cursor-pointer" />
          </button>
        </div>

        {/* Body */}
        <div className="h-[362px] pt-5 pr-8 pb-5 pl-8 flex flex-col gap-4 flex-1 overflow-auto">
          {isLoading || isCountriesLoading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin h-6 w-6 border-2 border-[#6320ee] border-t-transparent rounded-full" />
            </div>
          ) : isCountriesError ? (
            <div className="text-sm text-red-500 text-center">Failed to load countries.</div>
          ) : (
            <>
              {/* Name */}
              <div className="space-y-1.5">
                <label className="block text-[15px] text-grey-primary">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  disabled={isSaving}
                  className={`w-full rounded h-10 bg-[#FAFAFB] border-2 ${error ? "border-red-400" : "border-[#F3F3F5]"} px-4 py-3 text-base text-purple-deep focus:outline-none focus:border-purple-brand transition-all disabled:opacity-50`}
                />
                {error && (
                  <div className="text-red-500 text-xs">{error}</div>
                )}
              </div>

              {/* Custom Country Dropdown */}
              <div className="space-y-1.5">
                <label className="block text-[15px] text-grey-primary">Country</label>
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    disabled={isSaving}
                    className={`w-full flex items-center justify-between rounded border-2 ${dropdownOpen ? "border-purple-brand" : "border-[#F3F3F5]"} bg-[#FAFAFB] pt-[10px] pr-[12px] pb-[10px] pl-[12px] text-base text-purple-deep focus:outline-none transition-all disabled:opacity-50`}
                    onClick={() => setDropdownOpen((o) => !o)}
                  >
                    <span className="flex items-center gap-2">
                      {countryName || <span className="text-gray-400">Select country</span>}
                    </span>
                    <span className="flex gap-2 items-center">
                      <LuPencil className={`h-4 w-4 text-grey-primary ${dropdownOpen ? "hidden":""}`} />
                      <svg className={`w-5 h-5 text-gray-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    </span>
                  </button>
                  {dropdownOpen && (
                    <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded max-h-40 overflow-y-auto scrollbar-hide">
                      {countries.length > 0 ? (
                        countries.map((countryItem: { name: string; id: string }) => (
                          <div
                            key={countryItem.id}
                            className={`flex items-center justify-between cursor-pointer hover:bg-gray-50 ${countryName === countryItem.name ? "bg-gray-100" : ""} py-[10px] px-[12px]`}
                            onClick={() => handleCountrySelect(countryItem)}
                          >
                            <span className="flex items-center gap-2">
                              <FaMapMarkerAlt className="text-grey-primary/50" />
                              <span className="text-purple-deep">{countryItem.name}</span>
                            </span>
                            <LuPencil className="h-4 w-4 text-purple-brand" />
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-gray-400">No countries</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex h-20 justify-end gap-3 py-4 px-6 border-t border-gray-100">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="px-4 py-3 h-11 text-[14px] rounded-sm border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-3 h-11 text-[14px] rounded-sm bg-purple-brand text-white cursor-pointer hover:bg-[#5219cc] shadow-sm transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSaving && (
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            )}
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  )
}
