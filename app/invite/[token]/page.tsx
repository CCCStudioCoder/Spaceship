import Link from "next/link";
import {Suspense} from "react";
import {Loading} from "@/app/util/components";

type Props = {
    params: Promise<{ token: string }>;
    searchParams: Promise<{
        name?: string;
        inviter?: string;
    }>;
};

export default function Invite({ params, searchParams }: Props) {
    return (
        <main>
            <Suspense fallback={<Loading height={500} width={500} />}>
                <Content />
            </Suspense>
            <Link href="/">Return home</Link>
        </main>
    );

    async function Content() {
        const { token } = await params;
        const { name, inviter } = await searchParams;

        const { project, error } = await fetch("/api/invite_tokens", {
            method: "POST",
            body: JSON.stringify({
                token
            }),
        }).then(res => res.json());

        return project ? (
            <>
                <p>{inviter || "Someone"} invited you{name ? ` to become part of ${name}.` : "."}</p>
                <Link href={"/projects/" + project}>Accept</Link>
            </>
        ) : (
            <p>An error occurred: {error}</p>
        );
    }
}