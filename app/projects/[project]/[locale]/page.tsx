'use client'

import {SearchParams} from "@/app/projects/[project]/page";
import {use} from "react";

export type LocaleSlug = {locale: string};

export default function LocalePage(slug: SearchParams<LocaleSlug>) {
    const { project, locale } = use(slug.searchParams);

    return (
        <div>

        </div>
    );
}