'use client'

import {SearchParams} from "@/app/projects/[project]/page";
import {LocaleSlug} from "@/app/projects/[project]/[locale]/page";
import {use} from "react";

type PathSlug = {path: string[]};

export default function Editor(slug: SearchParams<LocaleSlug & PathSlug>) {
    const { project, locale, path } = use(slug.params);

    return (
        <div>

        </div>
    );
}