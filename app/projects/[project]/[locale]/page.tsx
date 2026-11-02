'use client'

import {ProjectSlug} from "@/app/projects/[project]/page";
import {use} from "react";

export type LocaleSlug = {locale: string};

export default function LocalePage(slug: Promise<ProjectSlug & LocaleSlug>) {
    const { project, locale } = use(slug);

    return (
        <div>

        </div>
    );
}