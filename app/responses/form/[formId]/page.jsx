"use client";
import React, { useEffect, useState } from "react";
import { db } from "@/config";
import { JsonForms, userResponses } from "@/config/schema";
import { eq } from "drizzle-orm";
import { ArrowLeft, Download } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import EmptyStatePlaceholder from "@/app/_components/EmptyStatePlaceholder";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import * as XLSX from "xlsx";
import { ProtectedPage } from "@/app/_components/Protected";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Loading from "@/./app/_components/Loading";

const formatHeaderName = (key) => {
  // Convert camelCase or snake_case to Title Case with spaces
  return (
    key
      // Split by uppercase letters, underscores, or hyphens
      .split(/(?=[A-Z])|_|-/)
      // Capitalize first letter of each word and join with spaces
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ")
  );
};

const FormAnalysisPage = () => {
  const params = useParams();
  const router = useRouter();
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [modalData, setModalData] = useState(null);
  const [jsonForm, setJsonForm] = useState(null);
  const [columnOrder, setColumnOrder] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  let jsonData = [];

  useEffect(() => {
    const fetchForm = async (formId) => {
      setLoading(true);
      try {
        const result = await db
          .select()
          .from(JsonForms)
          .where(eq(JsonForms.id, formId));

        if (result && result.length > 0) {
          const parsedForm = JSON.parse(result[0].jsonform);
          setJsonForm(parsedForm);

          // Extract field names from the form definition
          if (parsedForm?.fields && Array.isArray(parsedForm.fields)) {
            const formFieldNames = parsedForm.fields.map(
              (field) => field.fieldName
            );
            setColumnOrder(formFieldNames);
          }

          return parsedForm;
        }
      } catch (error) {
        console.error("Error fetching form:", error);
      }
      return null;
    };

    const fetchResponses = async (formId, form) => {
      setLoading(true);
      try {
        const result = await db
          .select()
          .from(userResponses)
          .where(eq(userResponses.formRef, formId))
          .orderBy(userResponses.createdAt);

        setResponses(result);

        // If form definition didn't provide column order, extract from responses
        if ((!form || !form.fields) && result.length > 0) {
          // Get all unique keys from all responses
          const allKeys = new Set();
          result.forEach((response) => {
            try {
              const parsedResponse = JSON.parse(response.jsonResponse);
              Object.keys(parsedResponse).forEach((key) => allKeys.add(key));
            } catch (error) {
              console.error("Error parsing response:", error);
            }
          });

          // Convert to array and set as column order
          setColumnOrder(Array.from(allKeys));
        }

        // Group responses by date for chart
        const groupedData = result.reduce((acc, response) => {
          // Ensure we have a valid date before proceeding
          const dateObj = new Date(response.createdAt);
          if (isNaN(dateObj.getTime())) {
            // Skip invalid dates
            return acc;
          }

          // Format date consistently
          const date = dateObj.toLocaleDateString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          });

          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {});

        // Convert to array format for chart
        const formattedChartData = Object.keys(groupedData).map((date) => {
          // Create valid date objects for sorting
          const dateParts = date.split("/");
          // Ensure date parts are in the right order and format (depends on your locale)
          const dateObj = new Date(
            dateParts[2],
            parseInt(dateParts[0]) - 1,
            dateParts[1]
          );

          return {
            date,
            dateObj, // For sorting
            submissions: groupedData[date],
          };
        });

        // Sort by date - using actual date objects for accurate sorting
        formattedChartData.sort((a, b) => a.dateObj - b.dateObj);

        // Remove the temporary dateObj property used for sorting
        const cleanedChartData = formattedChartData.map((item) => ({
          date: item.date,
          submissions: item.submissions,
        }));

        setChartData(cleanedChartData);
      } catch (error) {
        console.error("Error fetching responses:", error);
      } finally {
        setLoading(false);
      }
    };

    const loadData = async () => {
      if (params?.formId) {
        const form = await fetchForm(params.formId);
        await fetchResponses(params.formId, form);
      }
    };

    loadData();
  }, [params?.formId]);

  const getFieldLabel = (fieldName) => {
    if (jsonForm?.fields) {
      const field = jsonForm.fields.find((f) => f.fieldName === fieldName);
      return field?.fieldTitle || field?.label || formatHeaderName(fieldName);
    }
    return formatHeaderName(fieldName);
  };

  const renderCell = (value) => {
    if (value === null || value === undefined) return "";

    if (Array.isArray(value)) {
      return value
        .map((item) =>
          typeof item === "object" && item.label ? item.label : item
        )
        .join(", ");
    }

    // Handle checkbox option responses
    if (typeof value === "object" && value !== null) {
      if (value.label) return value.label;
      if (
        Object.keys(value).some((key) => key === "value" || key === "label")
      ) {
        return Object.entries(value)
          .filter(([k, v]) => v === true || (k === "label" && v))
          .map(([k, v]) => (k === "label" ? v : k))
          .join(", ");
      }
      return JSON.stringify(value, null, 2);
    }

    return value?.toString() || "";
  };

  const ExportData = async () => {
    setLoading(true);
    jsonData = responses.map((item) => {
      try {
        return JSON.parse(item.jsonResponse);
      } catch (error) {
        return {};
      }
    });
    exportToExcel(jsonData);
    setLoading(false);
  };

  // Convert JSON into EXCEL File to download it
  const exportToExcel = (jsonData) => {
    if (jsonData.length === 0) return;

    // Function to flatten a JSON object
    const flattenObject = (obj, prefix = "") => {
      let flattened = {};

      Object.keys(obj).forEach((key) => {
        const newKey = prefix ? `${prefix}_${key}` : key;

        if (Array.isArray(obj[key])) {
          // If the value is an array of objects (e.g., checkbox fields)
          if (obj[key].length > 0 && typeof obj[key][0] === "object") {
            // Handle array of objects (like selected options)
            flattened[newKey] = obj[key]
              .map((item) => item.label || item.value || JSON.stringify(item))
              .filter(Boolean)
              .join(", ");
          } else {
            // Simple array values
            flattened[newKey] = obj[key].join(", ");
          }
        } else if (typeof obj[key] === "object" && obj[key] !== null) {
          if (obj[key].label) {
            // Handle single selection objects with label property
            flattened[newKey] = obj[key].label;
          } else if (obj[key].value !== undefined) {
            // Handle value objects
            flattened[newKey] = obj[key].value;
          } else {
            // Check if it's a checkbox-style object (where keys are options and values are boolean)
            const checkboxValues = Object.entries(obj[key])
              .filter(([_, v]) => v === true)
              .map(([k, _]) => k);

            if (checkboxValues.length > 0) {
              flattened[newKey] = checkboxValues.join(", ");
            } else {
              // Otherwise recursively flatten the object
              Object.assign(flattened, flattenObject(obj[key], newKey));
            }
          }
        } else {
          flattened[newKey] = obj[key]; // Keep primitive values as they are
        }
      });

      return flattened;
    };

    // Transform responses & flatten data
    const transformedData = jsonData.map((item) => flattenObject(item));

    // Determine all possible headers
    let allHeaders = new Set();
    transformedData.forEach((item) => {
      Object.keys(item).forEach((key) => allHeaders.add(key));
    });

    // Prioritize column order from form definition if available
    const excelHeaders =
      columnOrder.length > 0
        ? columnOrder.filter((header) => allHeaders.has(header))
        : Array.from(allHeaders);

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet([
      excelHeaders.map((header) => getFieldLabel(header)),
    ]);

    // Add data rows with consistent column ordering
    transformedData.forEach((row) => {
      const rowData = excelHeaders.map((header) => row[header] || "");
      XLSX.utils.sheet_add_aoa(worksheet, [rowData], { origin: -1 });
    });

    // Apply some styling to improve readability
    const headerRow =
      worksheet["!ref"].split(":")[0].replace(/[0-9]/g, "") + "1";
    const lastCol = worksheet["!ref"].split(":")[1].replace(/[0-9]/g, "");

    // Set column widths for better display
    const wscols = excelHeaders.map(() => ({ wch: 20 })); // Default width of 20 characters
    worksheet["!cols"] = wscols;

    // Add some basic formatting to the header row
    for (let col = 0; col < excelHeaders.length; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
      if (!worksheet[cellAddress]) continue;

      worksheet[cellAddress].s = {
        font: { bold: true },
        fill: { fgColor: { rgb: "EEEEEE" } },
        alignment: { horizontal: "center", vertical: "center" },
      };
    }

    // Append worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Responses");

    // Save file with appropriate filename
    XLSX.writeFile(workbook, `${jsonForm?.formTitle || "Form Responses"}.xlsx`);
  };

  // Function to get the current responses for the page
  const currentResponses = () => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return responses.slice(startIndex, startIndex + rowsPerPage);
  };

  // Function to handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Calculate total pages
  const totalPages = Math.ceil(responses.length / rowsPerPage);

  console.log(chartData);

  return (
    <ProtectedPage>
      <section className="max-w-[1376px] mx-auto p-4 md:p-8 min-h-screen overflow-hidden">
        <div className="flex flex-col gap-8 min-h-screen">
          <div className="inline-flex flex-col justify-start items-start gap-3">
            <div
              className="flex items-center gap-2 text-muted-foreground cursor-pointer hover:text-muted-foreground/200"
              onClick={() => router.push("/responses")}
            >
              <ArrowLeft />
              <span className="text-sm font-medium break-words">
                Back to Responses
              </span>
            </div>
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 md:gap-6 w-full">
              <div className="flex flex-col gap-1">
                <h1 className="text-2xl md:text-3xl font-semibold">
                  {jsonForm?.formTitle || "Untitled Form"}
                </h1>
                <p className="text-base font-medium text-muted-foreground">
                  {jsonForm?.formHeading || "No description available."}
                </p>
              </div>
              <Button
                className="w-full md:w-auto flex items-center gap-2"
                onClick={() => ExportData()}
                disabled={loading || responses.length === 0}
              >
                <Download />
                Export Response
              </Button>
            </div>
          </div>

          {loading ? (
            <Loading />
          ) : responses.length === 0 ? (
            <EmptyStatePlaceholder
              title={"No Responses Found"}
              description={"Share your form to get responses."}
            ></EmptyStatePlaceholder>
          ) : (
            <>
              {/* Table with form-defined column ordering */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b">
                      {/* Use the column order derived from form definition */}
                      {columnOrder.map((fieldName) => (
                        <TableHead
                          key={fieldName}
                          className="border-r last:border-r-0 font-semibold bg-muted/20 "
                        >
                          {getFieldLabel(fieldName)}
                        </TableHead>
                      ))}
                      <TableHead className="border-r font-semibold bg-muted/20">
                        Created By
                      </TableHead>
                      <TableHead className="font-semibold bg-muted/20">
                        Created At
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentResponses().map((response, index) => {
                      let parsedResponse;
                      try {
                        parsedResponse = JSON.parse(response.jsonResponse);
                      } catch (error) {
                        parsedResponse = {};
                      }

                      return (
                        <TableRow key={index} className="border-b">
                          {/* Map each column in the consistent order from form definition */}
                          {columnOrder.map((fieldName) => {
                            const value = parsedResponse[fieldName];
                            return (
                              <TableCell
                                key={fieldName}
                                className="max-w-[200px] truncate border-r"
                                onClick={() => value && setModalData(value)}
                              >
                                {renderCell(value)}
                              </TableCell>
                            );
                          })}
                          <TableCell className="border-r">
                            {response.createdBy}
                          </TableCell>
                          <TableCell>{response.createdAt}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination Controls */}
              <div className="flex justify-between items-center">
                <span className="text-foreground font-semibold">
                  Page {currentPage} of {totalPages}
                </span>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>

                  <Button
                    variant="putline"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>

              {/* Area Chart using shadcn styling */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">
                    Submissions Over Time
                  </CardTitle>
                  <CardDescription className="text-base">
                    {responses.length} total submissions
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={chartData}
                        margin={{
                          top: 10,
                          right: 30,
                          left: 0,
                          bottom: 0,
                        }}
                      >
                        <defs>
                          <linearGradient
                            id="colorSubmissions"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#14b8a6"
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="95%"
                              stopColor="#14b8a6"
                              stopOpacity={0.1}
                            />
                          </linearGradient>
                        </defs>
                        <XAxis
                          dataKey="date"
                          stroke="#888888"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(value) => {
                            // Make sure we display a valid date string
                            if (!value) return "";
                            // You can format the date display here if needed
                            return value;
                          }}
                        />
                        <YAxis
                          stroke="#888888"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          allowDecimals={false}
                        />
                        <CartesianGrid
                          strokeDasharray="3 3"
                          className="stroke-muted"
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            borderColor: "hsl(var(--border))",
                            borderRadius: "0.5rem",
                          }}
                          labelStyle={{
                            color: "hsl(var(--foreground))",
                          }}
                          formatter={(value, name) => [value, "Submissions"]}
                          labelFormatter={(label) => {
                            // Ensure label is a valid date
                            if (!label) return "Unknown Date";
                            return `Date: ${label}`;
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="submissions"
                          stroke="#14b8a6"
                          fillOpacity={1}
                          fill="url(#colorSubmissions)"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Modal for detailed data view */}
              {modalData && (
                <div
                  className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
                  onClick={() => setModalData(null)}
                >
                  <div
                    className="bg-background p-6 rounded-lg shadow-lg max-w-2xl"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h2 className="text-lg font-semibold mb-4">Full Data</h2>
                    <pre className="text-sm text-foreground/70 whitespace-pre-wrap bg-muted p-4 rounded-md overflow-auto max-h-96">
                      {typeof modalData === "object"
                        ? JSON.stringify(modalData, null, 2)
                        : modalData}
                    </pre>
                    <Button
                      variant="destructive"
                      className="mt-4"
                      onClick={() => setModalData(null)}
                    >
                      Close
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </ProtectedPage>
  );
};

export default FormAnalysisPage;
