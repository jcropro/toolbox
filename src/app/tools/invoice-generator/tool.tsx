"use client";

import { useState, useCallback, useMemo } from "react";

interface LineItem {
  id: number;
  description: string;
  quantity: number;
  unitPrice: number;
}

let nextId = 1;

function createLineItem(): LineItem {
  return { id: nextId++, description: "", quantity: 1, unitPrice: 0 };
}

export function InvoiceGeneratorTool() {
  const [fromName, setFromName] = useState("");
  const [fromAddress, setFromAddress] = useState("");
  const [toName, setToName] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("INV-001");
  const [invoiceDate, setInvoiceDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [dueDate, setDueDate] = useState("");
  const [taxRate, setTaxRate] = useState(0);
  const [items, setItems] = useState<LineItem[]>([createLineItem()]);
  const [notes, setNotes] = useState("");

  const addItem = useCallback(() => {
    setItems((prev) => [...prev, createLineItem()]);
  }, []);

  const removeItem = useCallback(
    (id: number) => {
      if (items.length <= 1) return;
      setItems((prev) => prev.filter((item) => item.id !== id));
    },
    [items.length]
  );

  const updateItem = useCallback(
    (id: number, field: keyof LineItem, value: string | number) => {
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
      );
    },
    []
  );

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0),
    [items]
  );
  const taxAmount = useMemo(
    () => subtotal * (taxRate / 100),
    [subtotal, taxRate]
  );
  const total = useMemo(() => subtotal + taxAmount, [subtotal, taxAmount]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const fmt = (n: number) =>
    n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <>
      {/* Print-optimized styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #invoice-printable,
          #invoice-printable * {
            visibility: visible;
          }
          #invoice-printable {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 20px;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 no-print">
          Invoice Generator
        </h1>
        <p className="text-gray-600 mb-6 no-print">
          Fill in the details below to create a professional invoice. Click
          &ldquo;Download PDF&rdquo; to print or save as a PDF &mdash; everything runs
          in your browser.
        </p>

        <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center no-print">
          Ad Space
        </div>

        {/* Editable form (hidden during print) */}
        <div className="no-print space-y-6 mb-8">
          {/* From / To */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-gray-800">From</h2>
              <input
                type="text"
                placeholder="Your name / business name"
                value={fromName}
                onChange={(e) => setFromName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                placeholder="Your address"
                value={fromAddress}
                onChange={(e) => setFromAddress(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-gray-800">Bill To</h2>
              <input
                type="text"
                placeholder="Client name / business name"
                value={toName}
                onChange={(e) => setToName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                placeholder="Client address"
                value={toAddress}
                onChange={(e) => setToAddress(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
          </div>

          {/* Invoice details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Invoice #
              </label>
              <input
                type="text"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Invoice Date
              </label>
              <input
                type="date"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Line items */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Line Items</h2>
            <div className="space-y-2">
              {/* Header */}
              <div className="hidden sm:grid sm:grid-cols-12 gap-2 text-xs font-medium text-gray-500 uppercase px-1">
                <div className="col-span-5">Description</div>
                <div className="col-span-2">Qty</div>
                <div className="col-span-2">Unit Price</div>
                <div className="col-span-2">Amount</div>
                <div className="col-span-1"></div>
              </div>

              {items.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center"
                >
                  <input
                    type="text"
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) =>
                      updateItem(item.id, "description", e.target.value)
                    }
                    className="sm:col-span-5 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    min={0}
                    step={1}
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(
                        item.id,
                        "quantity",
                        Math.max(0, parseFloat(e.target.value) || 0)
                      )
                    }
                    className="sm:col-span-2 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    value={item.unitPrice}
                    onChange={(e) =>
                      updateItem(
                        item.id,
                        "unitPrice",
                        Math.max(0, parseFloat(e.target.value) || 0)
                      )
                    }
                    className="sm:col-span-2 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="sm:col-span-2 text-sm font-medium text-gray-700 px-1">
                    ${fmt(item.quantity * item.unitPrice)}
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    disabled={items.length <= 1}
                    className="sm:col-span-1 text-red-500 hover:text-red-700 disabled:text-gray-300 text-sm cursor-pointer disabled:cursor-not-allowed"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={addItem}
              className="mt-3 px-4 py-2 text-sm font-medium text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
            >
              + Add Line Item
            </button>
          </div>

          {/* Tax rate */}
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700">Tax Rate (%)</label>
            <input
              type="number"
              min={0}
              max={100}
              step={0.1}
              value={taxRate}
              onChange={(e) =>
                setTaxRate(Math.max(0, parseFloat(e.target.value) || 0))
              }
              className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes (optional)
            </label>
            <textarea
              placeholder="Payment terms, thank you message, etc."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Totals preview */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-1 text-sm max-w-xs ml-auto">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">${fmt(subtotal)}</span>
            </div>
            {taxRate > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Tax ({taxRate}%)</span>
                <span className="font-medium">${fmt(taxAmount)}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-gray-200 pt-1 text-base font-bold">
              <span>Total</span>
              <span>${fmt(total)}</span>
            </div>
          </div>

          <button
            onClick={handlePrint}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium cursor-pointer"
          >
            Download PDF
          </button>
        </div>

        {/* Printable invoice */}
        <div id="invoice-printable" className="hidden print:block">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">INVOICE</h2>
              <p className="text-sm text-gray-500 mt-1">#{invoiceNumber}</p>
            </div>
            <div className="text-right text-sm text-gray-600">
              <p>
                <span className="font-medium">Date:</span> {invoiceDate}
              </p>
              {dueDate && (
                <p>
                  <span className="font-medium">Due:</span> {dueDate}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-8 text-sm">
            <div>
              <p className="font-semibold text-gray-500 uppercase text-xs mb-1">
                From
              </p>
              <p className="font-medium text-gray-900">{fromName}</p>
              <p className="text-gray-600 whitespace-pre-line">{fromAddress}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-500 uppercase text-xs mb-1">
                Bill To
              </p>
              <p className="font-medium text-gray-900">{toName}</p>
              <p className="text-gray-600 whitespace-pre-line">{toAddress}</p>
            </div>
          </div>

          <table className="w-full text-sm mb-6">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="text-left py-2 font-semibold text-gray-700">
                  Description
                </th>
                <th className="text-right py-2 font-semibold text-gray-700 w-20">
                  Qty
                </th>
                <th className="text-right py-2 font-semibold text-gray-700 w-28">
                  Unit Price
                </th>
                <th className="text-right py-2 font-semibold text-gray-700 w-28">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-gray-200">
                  <td className="py-2 text-gray-800">
                    {item.description || "—"}
                  </td>
                  <td className="py-2 text-right text-gray-800">
                    {item.quantity}
                  </td>
                  <td className="py-2 text-right text-gray-800">
                    ${fmt(item.unitPrice)}
                  </td>
                  <td className="py-2 text-right text-gray-800">
                    ${fmt(item.quantity * item.unitPrice)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end">
            <div className="w-64 space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>${fmt(subtotal)}</span>
              </div>
              {taxRate > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax ({taxRate}%)</span>
                  <span>${fmt(taxAmount)}</span>
                </div>
              )}
              <div className="flex justify-between border-t-2 border-gray-300 pt-2 text-base font-bold">
                <span>Total</span>
                <span>${fmt(total)}</span>
              </div>
            </div>
          </div>

          {notes && (
            <div className="mt-8 text-sm text-gray-600">
              <p className="font-semibold text-gray-500 uppercase text-xs mb-1">
                Notes
              </p>
              <p className="whitespace-pre-line">{notes}</p>
            </div>
          )}
        </div>

        <div className="ad-slot my-6 p-4 bg-gray-100 rounded text-center text-gray-400 text-sm min-h-[90px] flex items-center justify-center no-print">
          Ad Space
        </div>

        <section className="mt-8 prose prose-gray max-w-none no-print">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            About This Invoice Generator
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Create clean, professional invoices in seconds. Add your business
            details, client info, and line items &mdash; the tool handles subtotals,
            tax, and totals automatically. Click &ldquo;Download PDF&rdquo; to open
            your browser&rsquo;s print dialog, where you can save as PDF. No account
            needed, no data uploaded.
          </p>
        </section>
      </div>
    </>
  );
}
