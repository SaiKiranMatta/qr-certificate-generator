"use client";

import { NextPage } from "next";
import { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import * as XLSX from "xlsx";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { ColDef } from "ag-grid-community";
import { useTheme } from "next-themes";

const Page: NextPage = () => {
    const [baseUrl, setBaseUrl] = useState(
        "https://cbitosc.github.io/verify24/reactfastapibootcampFM/?id="
    );
    const [templateFile, setTemplateFile] = useState<File | null>(null);
    const [excelFile, setExcelFile] = useState<File | null>(null);
    const [outputDir, setOutputDir] = useState("");
    const [codeSerial, setCodeSerial] = useState("RFBM");
    const [codesStartNumber, setCodesStartNumber] = useState(0);
    const [jsonFileName, setJsonFileName] = useState("Data.json");
    const [jsonDir, setJsonDir] = useState("");
    const [columnDefs, setColumnDefs] = useState<ColDef[]>([
        { field: "Name" },
        { field: "Department", cellEditor: "agTextCellEditor" },
    ]);
    const [rowData, setRowData] = useState<
        { Name: string; Department: string }[]
    >([]);
    const { resolvedTheme } = useTheme();

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setExcelFile(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: "array" });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const parsedData = XLSX.utils.sheet_to_json(sheet, {
                    header: 1,
                });

                const filteredData = parsedData.filter((row: any) =>
                    row.some(
                        (cell: any) =>
                            cell !== null && cell !== undefined && cell !== ""
                    )
                );

                // Extract columns and data
                const headers = parsedData[0];
                const processedData = filteredData.map((row: any) => ({
                    Name: row[0],
                    Department: row[1],
                }));
                setRowData(processedData);
            };
            reader.readAsArrayBuffer(file);
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append("base_url", baseUrl);
        formData.append("template", templateFile as Blob);
        formData.append("excel", excelFile as Blob);
        formData.append("output_directory", outputDir);
        formData.append("code_serial", codeSerial);
        formData.append("codes_start_number", codesStartNumber.toString());
        formData.append("json_file_name", jsonFileName);
        formData.append("json_directory", jsonDir);

        try {
            const response = await fetch("/api/generate-certificates", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            alert("Certificates generated successfully!");
        } catch (error) {
            console.error(error);
            alert("An error occurred while generating certificates.");
        }
    };

    return (
        <div className="flex flex-col px-8 py-8 text-foreground">
            <h1 className="text-primary text-4xl font-semibold">
                Generate QR Certificates
            </h1>
            <Separator className="my-8" />
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="form-group">
                    <label htmlFor="baseUrl">Base URL:</label>
                    <Input
                        type="text"
                        id="baseUrl"
                        value={baseUrl}
                        onChange={(e) => setBaseUrl(e.target.value)}
                        className="form-control"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="template">
                        Upload Certificate Template (PNG/JPG):
                    </label>
                    <Input
                        type="file"
                        id="template"
                        onChange={(e) =>
                            setTemplateFile(e.target.files?.[0] || null)
                        }
                        className="form-control"
                        accept=".png, .jpg, .jpeg"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="excel">Upload Excel File (XLSX):</label>
                    <Input
                        type="file"
                        id="excel"
                        onChange={handleFileUpload}
                        className="form-control"
                        accept=".xlsx"
                        required
                    />
                </div>
                <div
                    className={`${
                        resolvedTheme == "dark"
                            ? "  ag-theme-quartz-dark"
                            : "ag-theme-quartz"
                    } w-full h-96`}
                >
                    <AgGridReact
                        rowData={rowData}
                        columnDefs={columnDefs}
                        defaultColDef={{ flex: 1 }}
                        domLayout="normal"
                        className=""
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="outputDir">Output Directory:</label>
                    <Input
                        type="text"
                        id="outputDir"
                        value={outputDir}
                        onChange={(e) => setOutputDir(e.target.value)}
                        className="form-control"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="codeSerial">Code Serial:</label>
                    <Input
                        type="text"
                        id="codeSerial"
                        value={codeSerial}
                        onChange={(e) => setCodeSerial(e.target.value)}
                        className="form-control"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="codesStartNumber">
                        Codes Start Number:
                    </label>
                    <Input
                        type="number"
                        id="codesStartNumber"
                        value={codesStartNumber}
                        onChange={(e) =>
                            setCodesStartNumber(Number(e.target.value))
                        }
                        className="form-control"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="jsonFileName">Output JSON File Name:</label>
                    <Input
                        type="text"
                        id="jsonFileName"
                        value={jsonFileName}
                        onChange={(e) => setJsonFileName(e.target.value)}
                        className="form-control"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="jsonDir">Output JSON Directory:</label>
                    <Input
                        type="text"
                        id="jsonDir"
                        value={jsonDir}
                        onChange={(e) => setJsonDir(e.target.value)}
                        className="form-control"
                        required
                    />
                </div>
                <Button type="submit" className="btn btn-primary">
                    Generate Certificates
                </Button>
            </form>
        </div>
    );
};

export default Page;
