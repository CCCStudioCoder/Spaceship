'use client'

import {ReactNode, useEffect, useMemo, useReducer, useState} from "react";
import {DimensionProps, Loading} from "@/app/util/components";
import {useRouter} from "next/navigation";
import {User} from "@/app/util/db";

const DEFAULT_REQUEST_INIT: RequestInit = {method: "GET"};

type Props<T> = {children: (value: T) => ReactNode};
export type APIProvider<T> = (params: Props<T> & DimensionProps) => ReactNode;

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
    init: RequestInit = DEFAULT_REQUEST_INIT,
    process: (res: any) => T = res => res
): [APIProvider<T>, T|null, () => void] {
    const [event, refresh] = useReducer(x => x+1, 0);
    const [content, setContent] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        const abortController = new AbortController();
        fetch("/api/" + api, { ...init, signal: abortController.signal })
            .then(response => response.json())
            .then(json => setContent(json));
        return () => abortController.abort("Unknown reason");
    }, [event, api, init]);

    const Error = () => {
        useEffect(() => {
            if(content.redirect) {
                router.replace("/auth/login?url=" + redirect);
                router.refresh();
            }
        }, []);
        return <p className="text-red-600">{content.error}</p>
    };

    function Provider<T>({ children, width, height }: Props<T> & DimensionProps): ReactNode {
        return content
            ? ( content.error
                ? <Error />
                : children(content))
            : <Loading width={width} height={height} />;
    }

    const result: T|null = useMemo(() => content && process(content), [content, process]);

    return [Provider, result, refresh];
}