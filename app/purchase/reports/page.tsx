export default function PurchaseReportsPage() {
    return (
        <div className="p-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Purchase Reports</h1>
                <p className="text-gray-500 mt-1">Analytics and summaries for purchase modules</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="font-semibold text-gray-700 mb-2">Total Purchases (This Month)</h3>
                    <p className="text-3xl font-bold text-orange-600">₹0</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="font-semibold text-gray-700 mb-2">Pending Orders</h3>
                    <p className="text-3xl font-bold text-gray-800">0</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="font-semibold text-gray-700 mb-2">Completed GRNs</h3>
                    <p className="text-3xl font-bold text-green-600">0</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center justify-center min-h-[300px]">
                <div className="text-center text-gray-500">
                    Chart data will appear here once records are created.
                </div>
            </div>
        </div>
    );
}
