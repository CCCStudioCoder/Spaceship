'use client'

import {use} from "react";

export type ProjectSlug = {project: string};

export default function ProjectPage(slug: Promise<ProjectSlug>) {
    const { project } = use(slug);

    return (
        <div>

        </div>
    );
}