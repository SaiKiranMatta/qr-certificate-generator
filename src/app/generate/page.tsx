import { NextPage } from "next";
import { Separator } from "@/components/ui/separator";

interface Props {}

const Page: NextPage<Props> = ({}) => {
    return (
        <div className=" flex flex-col px-8 py-8">
            <h1 className=" text-primary text-4xl font-semibold">
                Generate QR Certificate
            </h1>
            <Separator className="my-8" />
        </div>
    );
};

export default Page;
