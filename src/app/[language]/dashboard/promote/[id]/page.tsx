"use client";
import { RequireAuth } from "@/components/custom/security/withAuth";
import { useParams, } from "next/navigation";
import { PromoteGroup } from "./PromoteGroupSection";




    

function PromotePage() {
    const { id } = useParams()
    return <PromoteGroup id={id as string} />
}


export default RequireAuth(PromotePage);