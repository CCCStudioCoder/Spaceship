'use client'

import {use} from "react";

type ProjectSlug = {project: string};
export type SearchParams<T = {}> = {
    searchParams: Promise<T & ProjectSlug>
}

export default function ProjectPage(slug: SearchParams) {
    const { project } = use(slug.searchParams);

    return (
        <div>

        </div>
    );
}