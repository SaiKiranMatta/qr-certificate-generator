import CertificateDesigner from "@/components/CertificateDesigner";
import Dynamic from "@/components/Dynamic";
import Image from "next/image";

export default function Home() {
    return (
        <div className=" bg-background">
            <Dynamic>
                <CertificateDesigner />
            </Dynamic>
        </div>
    );
}
