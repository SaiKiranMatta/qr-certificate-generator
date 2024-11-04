"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useState } from "react";

export default function Instructions() {
    const [username, setUsername] = useState("");
    const [reponame, setReponame] = useState("");
    const [foldername, setFoldername] = useState("");
    const [isUrlCopied, setIsUrlCopied] = useState(false);

    // Generate base URL based on user inputs
    const generateUrl = () => {
        return `https://${username}.github.io/${reponame}/${foldername}/?id=`;
    };

    // Copy generated URL to clipboard
    const handleCopyUrl = () => {
        navigator.clipboard.writeText(generateUrl());
        setIsUrlCopied(true);
        setTimeout(() => setIsUrlCopied(false), 2000); // Reset the message after 2 seconds
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-primary text-4xl font-semibold">
                Certificate Generation Instructions
            </h1>
            <Separator className="my-8" />

            {/* Prerequisites Section */}
            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Prerequisites</h2>
                <ul className="list-disc pl-6 space-y-2">
                    <li>
                        Prepare a PNG or JPG certificate template with empty
                        space for text and a QR code.
                    </li>
                    <li>
                        Convert the certificate to SVG format using tools like{" "}
                        <Link
                            href="https://pixelied.com/convert/png-converter/png-to-svg"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                        >
                            Pixelied PNG to SVG Converter
                        </Link>
                        .
                    </li>
                    <li>
                        Create an Excel sheet with the details of people who
                        will receive certificates.
                    </li>
                    <li>
                        Sign up or log into{" "}
                        <Link
                            href="https://github.com"
                            className="text-blue-600 underline"
                        >
                            GitHub
                        </Link>
                        .
                    </li>
                </ul>
            </section>

            {/* Steps Section */}
            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                    Steps to Set Up Verification Repository
                </h2>
                <ol className="list-decimal pl-6 space-y-4">
                    <li>
                        Create a new public repository on GitHub with a README
                        file.
                        <div className="mt-2">
                            <img
                                src="/create-github-repo.png"
                                alt="Creating a new GitHub repository"
                                className="w-full max-w-md rounded-md shadow-md"
                            />
                        </div>
                    </li>
                    <li>
                        Go to{" "}
                        <code className="bg-gray-200 p-1 rounded">
                            Settings &gt; Pages
                        </code>{" "}
                        and select the main branch and{" "}
                        <code className="bg-gray-200 p-1 rounded">/docs</code>{" "}
                        folder, then <strong>save.</strong>
                        <div className="mt-2">
                            <img
                                src="/github-pages-settings.png"
                                alt="GitHub Pages settings"
                                className="w-full max-w-md rounded-md shadow-md"
                            />
                        </div>
                    </li>
                    <li>
                        Your public URL will be:{" "}
                        <code className="bg-gray-200 p-1 rounded">
                            https://username.github.io/reponame
                        </code>
                    </li>
                    <li>
                        Decide a folder name for your certificates. For better
                        organization, it's recommended to use a combination of
                        the event name and the type of certificate.
                        <br />
                        <strong>Example:</strong> If the event is a bootcamp and
                        the certificate type is a merit certificate, you could
                        name the folder{" "}
                        <code className="bg-gray-200 p-1 rounded">
                            bootcampmerit
                        </code>
                        .
                    </li>
                </ol>
            </section>

            {/* Base URL Generator Section */}
            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                    Base URL Generator
                </h2>
                <p>Enter the required information to generate your base URL:</p>
                <div className="space-y-4 mt-4">
                    <div>
                        <label className="block font-medium mb-1">
                            GitHub Username
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                            placeholder="Enter your GitHub username"
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-1">
                            Repository Name
                        </label>
                        <input
                            type="text"
                            value={reponame}
                            onChange={(e) => setReponame(e.target.value)}
                            className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                            placeholder="Enter your repository name"
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-1">
                            Folder Name
                        </label>
                        <input
                            type="text"
                            value={foldername}
                            onChange={(e) => setFoldername(e.target.value)}
                            className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                            placeholder="Enter your folder name"
                        />
                    </div>
                </div>
                <div className="mt-4 flex items-center space-x-2">
                    <p className="font-semibold">Base URL:</p>
                    <code className="bg-gray-200 p-2 rounded-md">
                        {generateUrl()}
                    </code>
                    <Button
                        onClick={handleCopyUrl}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                    >
                        Copy URL
                    </Button>
                </div>
                {isUrlCopied && (
                    <p className="text-green-600 mt-2">
                        URL copied to clipboard!
                    </p>
                )}
            </section>

            {/* Next Step After URL Generation */}
            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Next Step</h2>
                <p>
                    Now that you have generated your base URL, proceed to the{" "}
                    <Link href="/generate" className="text-blue-600 underline">
                        Certificate Generation
                    </Link>{" "}
                    page to start creating your certificates.
                </p>
            </section>

            {/* Final Step */}
            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Final Step</h2>
                <p>
                    After generating certificates, follow these steps to upload
                    the <code className="bg-gray-200 p-1 rounded">docs</code>{" "}
                    folder to GitHub:
                </p>
                <ol className="list-decimal pl-6 space-y-2 mt-2">
                    <li>
                        Go to the <strong>Code</strong> section of your GitHub
                        repository.
                    </li>
                    <li>
                        Click on the <strong>+</strong> (plus) button, then
                        select <strong>Upload files</strong>.
                    </li>
                    <li>
                        Open the output directory on your computer where the{" "}
                        <code className="bg-gray-200 p-1 rounded">docs</code>{" "}
                        folder was generated.
                    </li>
                    <li>
                        Drag and drop the{" "}
                        <code className="bg-gray-200 p-1 rounded">docs</code>{" "}
                        folder into the <strong>Upload files</strong> section on
                        GitHub.
                    </li>
                    <li>
                        Scroll down and click on <strong>Commit changes</strong>{" "}
                        to upload and deploy your certificates.
                    </li>
                </ol>
                <div className="mt-4">
                    <img
                        src="/github-final-step.png"
                        alt="Uploading docs folder to GitHub"
                        className="w-full max-w-md rounded-md shadow-md"
                    />
                </div>
            </section>
        </div>
    );
}
