'use client'

import {use} from "react";

type ProjectSlug = {project: string};
export type SearchParams<T = {}> = {
    params: Promise<T & ProjectSlug>
}

export const instant = false;

export default function ProjectPage(slug: SearchParams) {
    const { project } = use(slug.params);

    return (
        <div>

        </div>
    );
}