"use client";

import { useEffect, useRef, useState } from "react";
import { Stage, Layer, Image, Text } from "react-konva";
import useImage from "use-image";

const CertificateDesigner = () => {
    const [templateImage, setTemplateImage] = useState<string | null>(null);
    const [textSize, setTextSize] = useState(90);
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [qrImage, setQrImage] = useImage("/qr_code.png");
    const [imageSize, setImageSize] = useState<{
        width: number;
        height: number;
    } | null>(null);

    const [textPosition, setTextPosition] = useState({ x: 100, y: 100 });
    const [qrPosition, setQrPosition] = useState({ x: 200, y: 200 });

    // Ref to access the text node
    const textRef = useRef<any>(null);

    // Load image from URL or file
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
            const reader = new FileReader();
            reader.onloadend = () => {
                setTemplateImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = () => {
        if (imageSize) {
            const textRect = textRef.current.getClientRect();
            const textCenterCoordinates = {
                x: textPosition.x / scale + textRect.width / scale / 2,
                y: textPosition.y / scale,
            };
            console.log({
                templateImage,
                textSize,
                imageSize,
                textCenterCoordinates,
                qrPosition: {
                    x: qrPosition.x / scale,
                    y: qrPosition.y / scale,
                },
            });
        }
    };

    // Calculate the scale factor
    const canvasWidth = window.innerWidth * 0.8; // 80% of the window width
    const canvasHeight = window.innerHeight * 0.8; // 80% of the window height

    // Calculate the scale factor based on the smaller canvas size
    const scale = Math.min(
        canvasWidth / (imageSize?.width || 1),
        canvasHeight / (imageSize?.height || 1)
    );

    return (
        <div>
            <input
                type="file"
                accept="image/*"
                onChange={handleTemplateUpload}
            />
            {image != null && (
                <Stage
                    width={canvasWidth}
                    height={canvasHeight}
                    scaleX={scale}
                    scaleY={scale}
                    // offsetX={((imageSize?.width || 0) * scale) / 2}
                    // offsetY={((imageSize?.height || 0) * scale) / 2}
                    draggable
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
                                setTextPosition({ x: x * scale, y: y * scale });
                            }}
                        />
                        <Image
                            image={qrImage as HTMLImageElement}
                            width={400} // Fixed size for QR code
                            height={400}
                            x={qrPosition.x / scale}
                            y={qrPosition.y / scale}
                            fill="blue"
                            draggable
                            onDragEnd={(e) => {
                                const { x, y } = e.target.attrs;
                                setQrPosition({ x: x * scale, y: y * scale });
                            }}
                        />
                    </Layer>
                </Stage>
            )}

            <button onClick={handleSubmit} style={{ marginTop: "20px" }}>
                Submit
            </button>
        </div>
    );
};

export default CertificateDesigner;
