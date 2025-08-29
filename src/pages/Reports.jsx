// src/pages/Reports.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import Header from "../components/Header";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer
} from "recharts";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

const ReportsPage = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("monthly"); // daily | weekly | monthly

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  // UI helpers
  const Card = ({ children }) => (
    <div className="p-4 shadow-md rounded-xl bg-white">{children}</div>
  );
  const CardContent = ({ children }) => <div>{children}</div>;
  const Button = ({ children, onClick }) => (
    <button
      onClick={onClick}
      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
    >
      {children}
    </button>
  );

  // Fetch sales data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("invoices")
        .select("id, total_amount, created_at, status, customer_id");

      if (error) console.error("Error fetching sales:", error);
      else setSales(data || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  // 📌 Apply filters (daily / weekly / monthly)
  const filteredSales = sales.filter((sale) => {
    const date = new Date(sale.created_at);
    const today = new Date();

    if (filter === "daily") {
      return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      );
    }

    if (filter === "weekly") {
      const weekAgo = new Date();
      weekAgo.setDate(today.getDate() - 7);
      return date >= weekAgo && date <= today;
    }

    if (filter === "monthly") {
      return (
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      );
    }

    return true;
  });

  // 📊 Sales grouped by day/week/month for chart
  const groupedData = filteredSales.reduce((acc, sale) => {
    let key;
    const date = new Date(sale.created_at);

    if (filter === "daily") {
      key = date.toLocaleDateString("default", { hour: "2-digit" });
    } else if (filter === "weekly") {
      key = date.toLocaleDateString("default", { weekday: "short" });
    } else {
      key = date.toLocaleString("default", { month: "short" });
    }

    acc[key] = (acc[key] || 0) + sale.total_amount;
    return acc;
  }, {});

  const chartData = Object.entries(groupedData).map(([key, amount]) => ({
    name: key,
    amount,
  }));

  // Pie chart: status distribution
  const statusData = [
    { name: "Paid", value: filteredSales.filter((s) => s.status === "paid").length },
    { name: "Pending", value: filteredSales.filter((s) => s.status === "pending").length },
    { name: "Cancelled", value: filteredSales.filter((s) => s.status === "cancelled").length },
  ];

  // 📤 Export to Excel
  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredSales);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sales");
    XLSX.writeFile(workbook, "sales_report.xlsx");
  };

  // 📤 Export to PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Sales Report", 14, 10);
    const tableData = filteredSales.map((s) => [
      s.id,
      s.total_amount,
      new Date(s.created_at).toLocaleDateString(),
      s.status,
    ]);
    doc.autoTable({
      head: [["ID", "Amount", "Date", "Status"]],
      body: tableData,
    });
    doc.save("sales_report.pdf");
  };

  // 🖨️ Print report
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">📊 Reports & Analytics</h2>

          {/* Filter Selector */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border p-2 rounded-md"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent>
                  <h3 className="font-bold text-gray-500">Total Sales</h3>
                  <p className="text-2xl font-bold text-green-600">
                    ₹{filteredSales.reduce((a, b) => a + b.total_amount, 0)}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent>
                  <h3 className="font-bold text-gray-500">Total Invoices</h3>
                  <p className="text-2xl font-bold">{filteredSales.length}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent>
                  <h3 className="font-bold text-gray-500">Paid Invoices</h3>
                  <p className="text-2xl font-bold text-blue-600">
                    {filteredSales.filter((s) => s.status === "paid").length}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent>
                  <h3 className="font-bold text-gray-500">Pending Invoices</h3>
                  <p className="text-2xl font-bold text-orange-500">
                    {filteredSales.filter((s) => s.status === "pending").length}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Sales & Status Charts */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <Card>
                <h3 className="text-lg font-bold mb-4">📅 Sales ({filter})</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="amount" fill="#4F46E5" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              <Card>
                <h3 className="text-lg font-bold mb-4">💳 Invoice Status</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      label
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* Export & Print Buttons */}
            <div className="mt-6 space-x-4">
              <Button onClick={exportExcel}>Export Excel</Button>
              <Button onClick={exportPDF}>Export PDF</Button>
              <Button onClick={handlePrint}>🖨️ Print</Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
