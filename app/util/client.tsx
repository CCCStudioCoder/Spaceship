'use client'

import {ReactNode, useCallback, useEffect, useMemo, useReducer, useState} from "react";
import {DimensionProps, Loading} from "@/app/util/components";
import {useRouter} from "next/navigation";
import {User} from "@/app/util/db";

type Props = {children: ReactNode};
export type APIProvider = (params: Props & DimensionProps) => ReactNode;

/**
 * WARNING <br/>
 * There are two ways `result` can be null:
 * - The request is not done yet. Avoid using it in `useMemo` or `useEffect` without checking nullity.
 * - The request came to an error. <br/>
 * For both reasons checks are already done in `APIProvider`
 */
export function useAPI<T = User>(
    redirect: string = "/",
    api: string = "user_data",
    init: RequestInit = {method: "GET"},
    process: (res: any) => T = res => res
): [APIProvider, T|null, () => void] {
    const [event, refresh] = useReducer(x => x+1, 0);
    const [content, setContent] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        const abortController = new AbortController();
        fetch("/api/" + api, { ...init, signal: abortController.signal })
            .then(response => response.json())
            .then(json => setContent(json));
        return () => abortController.abort();
    }, [event, api, init]);

    const Error = useCallback(() => {
        useEffect(() => {
            if(content.redirect) {
                router.replace("/auth/login?url=" + redirect);
                router.refresh();
            }
        }, []);
        return <p className="text-red-600">{content.error}</p>
    }, [redirect]);

    function Provider({ children, width, height }: Props & DimensionProps): ReactNode {
        return content
            ? ( content.error
                ? <Error />
                : children)
            : <Loading width={width} height={height} />;
    }

    const result: T|null = useMemo(() => content && process(content), [content, process]);

    return [Provider, result, refresh];
}