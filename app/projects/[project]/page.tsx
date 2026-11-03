'use client'

import {use} from "react";

type ProjectSlug = {project: string};
export type SearchParams<T = {}> = {
    params: Promise<T & ProjectSlug>
}

export default function ProjectPage(slug: SearchParams) {

    return (
        <div>

        </div>
    );
}