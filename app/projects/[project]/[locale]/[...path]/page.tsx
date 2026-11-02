'use client'

import {ProjectSlug} from "@/app/projects/[project]/page";
import {LocaleSlug} from "@/app/projects/[project]/[locale]/page";
import {use} from "react";

type PathSlug = {path: string[]};

export default function Editor(slug: Promise<ProjectSlug & LocaleSlug & PathSlug>) {
    const { project, locale, path } = use(slug);

    return (
        <div>

        </div>
    );
}