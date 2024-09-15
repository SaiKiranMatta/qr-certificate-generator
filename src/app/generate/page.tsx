import Dynamic from "@/components/Dynamic";
import GenerateCertificate from "@/components/GenerateCertificate";
import { NextPage } from "next";

interface Props {}

const Page: NextPage<Props> = ({}) => {
    return (
        <Dynamic>
            <GenerateCertificate />
        </Dynamic>
    );
};

export default Page;
