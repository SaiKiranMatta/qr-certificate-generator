"use client";

import { useEffect, useRef, useState } from "react";
import { Stage, Layer, Image, Text } from "react-konva";
import useImage from "use-image";
import { NextPage } from "next";
import { AgGridReact } from "ag-grid-react";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import * as XLSX from "xlsx";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { ColDef } from "ag-grid-community";
import { useTheme } from "next-themes";

const GenerateCertificate = () => {
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

        if (imageSize) {
            // Collect data related to the certificate design
            const textRect = textRef.current.getClientRect();
            const textCenterCoordinates = {
                x: textPosition.x / scale + textRect.width / scale / 2,
                y: textPosition.y / scale,
            };

            const designData = {
                templateImage,
                textSize,
                imageSize,
                textCenterCoordinates,
                qrPosition: {
                    x: qrPosition.x / scale,
                    y: qrPosition.y / scale,
                },
            };

            // Merge designData into form data
            const formData = new FormData();
            formData.append("base_url", baseUrl);
            formData.append("template", templateFile as Blob);
            formData.append("excel", excelFile as Blob);
            formData.append("output_directory", outputDir);
            formData.append("code_serial", codeSerial);
            formData.append("codes_start_number", codesStartNumber.toString());
            formData.append("json_file_name", jsonFileName);
            formData.append("json_directory", jsonDir);
            formData.append("design_data", JSON.stringify(designData));

            try {
                const response = await fetch("/api/generate-certificates", {
                    method: "POST",
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                alert("Certificates generated successfully!");
            } catch (error) {
                console.error(error);
                alert("An error occurred while generating certificates.");
            }
        } else {
            alert("Please complete the design.");
        }
    };

    // State and logic for the CertificateDesigner component
    const [templateImage, setTemplateImage] = useState<string | null>(null);
    const [textSize, setTextSize] = useState(90);
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [qrImage] = useImage("/qr_code.png");
    const [imageSize, setImageSize] = useState<{
        width: number;
        height: number;
    } | null>(null);
    const [textPosition, setTextPosition] = useState({ x: 100, y: 100 });
    const [qrPosition, setQrPosition] = useState({ x: 200, y: 200 });
    const [qrSize, setQrSize] = useState(400);

    const textRef = useRef<any>(null);
    const [loadedImage] = useImage(templateImage || "");

    useEffect(() => {
        if (loadedImage) {
            setImage(loadedImage);
            setImageSize({
                width: loadedImage.width,
                height: loadedImage.height,
            });
        }
    }, [loadedImage]);

    const handleTemplateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setTemplateFile(e.target.files?.[0] || null);
            const reader = new FileReader();
            reader.onloadend = () => {
                setTemplateImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const canvasWidth = window.innerWidth * 0.8; // 80% of the window width
    const canvasHeight = window.innerHeight * 0.8; // 80% of the window height
    const scale = Math.min(
        canvasWidth / (imageSize?.width || 1),
        canvasHeight / (imageSize?.height || 1)
    );

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
                    className={`w-full h-96 ${
                        resolvedTheme == "dark"
                            ? "ag-theme-quartz-dark"
                            : "ag-theme-quartz"
                    }`}
                >
                    <AgGridReact
                        rowData={rowData}
                        columnDefs={columnDefs}
                        defaultColDef={{ flex: 1 }}
                        domLayout="normal"
                    />
                </div>
                <div className="mt-10">
                    <label htmlFor="template">
                        Upload Certificate Template (PNG/JPG):
                    </label>
                    <Input
                        type="file"
                        onChange={handleTemplateUpload}
                        id="template"
                        className="form-control"
                        accept=".png, .jpg, .jpeg"
                        required
                    />
                    {image != null && (
                        <div>
                            <p className=" mt-4">
                                Drag to set the positions of Text and QR code
                            </p>
                            <Stage
                                width={canvasWidth}
                                height={canvasHeight}
                                scaleX={scale}
                                scaleY={scale}
                                draggable
                                className="mt-4"
                            >
                                <Layer>
                                    {image && (
                                        <Image
                                            image={image}
                                            width={imageSize?.width || 800}
                                            height={imageSize?.height || 600}
                                        />
                                    )}
                                    <Text
                                        text="{Name} of {Department} Department"
                                        fontSize={textSize}
                                        x={textPosition.x / scale}
                                        y={textPosition.y / scale}
                                        ref={textRef}
                                        draggable
                                        align="center"
                                        verticalAlign="middle"
                                        onDragEnd={(e) => {
                                            const { x, y } = e.target.attrs;
                                            setTextPosition({
                                                x: x * scale,
                                                y: y * scale,
                                            });
                                        }}
                                    />
                                    <Image
                                        image={qrImage as HTMLImageElement}
                                        width={qrSize} // Fixed size for QR code
                                        height={qrSize}
                                        x={qrPosition.x / scale}
                                        y={qrPosition.y / scale}
                                        draggable
                                        onDragEnd={(e) => {
                                            const { x, y } = e.target.attrs;
                                            setQrPosition({
                                                x: x * scale,
                                                y: y * scale,
                                            });
                                        }}
                                    />
                                </Layer>
                            </Stage>
                            {textRef.current != null && imageSize != null && (
                                <div className="mt-4 space-y-4 w-full">
                                    <div className="flex space-x-4 w-full gap-4">
                                        <div className="flex-1">
                                            <label htmlFor="textX">
                                                Text X Coordinate (Center):
                                            </label>
                                            <Input
                                                type="number"
                                                id="textX"
                                                value={
                                                    (textPosition.x +
                                                        textRef.current.getClientRect()
                                                            .width /
                                                            2) /
                                                    scale
                                                }
                                                onChange={(e) => {
                                                    // We directly update the `x` position without adding or subtracting width
                                                    const centerX = Number(
                                                        e.target.value
                                                    );
                                                    const updatedX =
                                                        centerX * scale -
                                                        textRef.current.getClientRect()
                                                            .width /
                                                            2;
                                                    setTextPosition({
                                                        ...textPosition,
                                                        x: updatedX,
                                                    });
                                                }}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label htmlFor="textY">
                                                Text Y Coordinate (Top):
                                            </label>
                                            <Input
                                                type="number"
                                                id="textY"
                                                value={textPosition.y / scale}
                                                onChange={(e) =>
                                                    setTextPosition({
                                                        ...textPosition,
                                                        y:
                                                            Number(
                                                                e.target.value
                                                            ) * scale,
                                                    })
                                                }
                                            />
                                        </div>
                                        <div className="flex-1 flex flex-col">
                                            <label htmlFor="textY">
                                                Horizontal
                                            </label>
                                            <Button
                                                type="button"
                                                variant={"outline"}
                                                onClick={() => {
                                                    setTextPosition({
                                                        ...textPosition,
                                                        x: Number(
                                                            (imageSize?.width *
                                                                scale -
                                                                textRef.current.getClientRect()
                                                                    .width) /
                                                                2
                                                        ),
                                                    });
                                                }}
                                            >
                                                Center
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="flex space-x-4 w-full gap-4">
                                        <div className="flex-1">
                                            <label htmlFor="qrX">
                                                QR Code X Coordinate (Left):
                                            </label>
                                            <Input
                                                type="number"
                                                id="qrX"
                                                value={qrPosition.x / scale}
                                                onChange={(e) =>
                                                    setQrPosition({
                                                        ...qrPosition,
                                                        x:
                                                            Number(
                                                                e.target.value
                                                            ) * scale,
                                                    })
                                                }
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label htmlFor="qrY">
                                                QR Code Y Coordinate (Top):
                                            </label>
                                            <Input
                                                type="number"
                                                id="qrY"
                                                value={qrPosition.y / scale}
                                                onChange={(e) =>
                                                    setQrPosition({
                                                        ...qrPosition,
                                                        y:
                                                            Number(
                                                                e.target.value
                                                            ) * scale,
                                                    })
                                                }
                                            />
                                        </div>
                                        <div className="flex-1 flex flex-col">
                                            <label htmlFor="textY">
                                                Horizontal
                                            </label>
                                            <Button
                                                type="button"
                                                variant={"outline"}
                                                onClick={() => {
                                                    setQrPosition({
                                                        ...qrPosition,
                                                        x:
                                                            Number(
                                                                (imageSize?.width -
                                                                    qrSize) /
                                                                    2
                                                            ) * scale,
                                                    });
                                                }}
                                            >
                                                Center
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
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
                <Button type="submit" className="btn btn-primary">
                    Generate Certificates
                </Button>
            </form>
        </div>
    );
};

export default GenerateCertificate;
